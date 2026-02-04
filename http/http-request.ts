import { IFetchResponse } from '@/interfaces/response.interface';
import { ICSRFTokenResponse } from '@/interfaces/web/auth.interface';

interface BaseConfig {
  apiUrl?: string;
  endpoint?: string;
  jwtToken?: string;
}

interface JsonConfig extends BaseConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: unknown;
}

interface ExternalConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: HeadersInit;
  data?: unknown;
}

interface FormDataConfig extends BaseConfig {
  method?: 'POST' | 'PUT' | 'DELETE';
  formData: FormData;
}

let cachedCsrfToken: string | null = null;

export async function getOrFetchCsrfToken(): Promise<string> {
  if (cachedCsrfToken) return cachedCsrfToken;

  const url = `${process.env.NEXT_PUBLIC_API_URL}/csrf-token`;
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Failed to fetch CSRF token. Status: ${response.status}`);
  }

  const apiResponse: IFetchResponse<ICSRFTokenResponse> = await response.json();

  if (apiResponse.data?.csrfToken) {
    cachedCsrfToken = apiResponse.data.csrfToken;
    return cachedCsrfToken;
  }

  throw new Error('CSRF token property missing from API response.');
}

function buildApiUrl(endpoint?: string, apiUrl?: string) {
  if (apiUrl) return apiUrl;
  if (endpoint) return `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`;
  return '/';
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    let errorMessage = 'Erro interno do servidor';

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage.join(', ');
      }
    } catch {}
    throw new Error(errorMessage);
  }

  if (
    response.status === 204 ||
    response.headers.get('content-length') === '0'
  ) {
    return null;
  }

  return response.json();
}

async function applyCsrfIfNeeded(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  headers: HeadersInit
): Promise<HeadersInit> {
  const isMutating =
    method === 'POST' || method === 'PUT' || method === 'DELETE';

  if (!isMutating) return headers;

  try {
    const csrfToken = await getOrFetchCsrfToken();
    return {
      ...headers,
      'X-CSRF-Token': csrfToken,
    };
  } catch {
    throw new Error('Erro ao gerar o CSRF Token');
  }
}

/**
 * 1) JSON for backend API (CSRF + JWT optional)
 */
export async function onHttpRequestJson({
  endpoint,
  method = 'GET',
  jwtToken,
  data,
}: JsonConfig): Promise<any> {
  const url = buildApiUrl(endpoint);

  let headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(jwtToken && { Authorization: `Bearer ${jwtToken}` }),
  };

  headers = await applyCsrfIfNeeded(method, headers);

  const options: RequestInit = {
    method,
    credentials: 'include',
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  return handleResponse(response);
}

/**
 * 2) External API without credentials neither CSRF)
 */
export async function onHttpExternalRequest({
  url,
  method = 'GET',
  headers = {},
  data,
}: ExternalConfig): Promise<any> {
  const isFormData =
    typeof FormData !== 'undefined' && data instanceof FormData;

  const finalHeaders: HeadersInit = {
    ...headers,
    ...(!isFormData && { 'Content-Type': 'application/json' }),
  };

  const options: RequestInit = {
    method,
    credentials: 'omit',
    headers: finalHeaders,
  };

  if (data) {
    options.body = isFormData ? data : JSON.stringify(data);
  }

  const response = await fetch(url, options);
  return handleResponse(response);
}

/**
 * 3) FormData to backend API (CSRF + JWT optional)
 */
export async function onHttpRequestFormData({
  endpoint,
  method = 'POST',
  jwtToken,
  formData,
}: FormDataConfig): Promise<any> {
  const url = buildApiUrl(endpoint);

  let headers: HeadersInit = {
    ...(jwtToken && { Authorization: `Bearer ${jwtToken}` }),
  };

  headers = await applyCsrfIfNeeded(method, headers);

  const options: RequestInit = {
    method,
    credentials: 'include',
    headers,
    body: formData,
  };

  const response = await fetch(url, options);
  return handleResponse(response);
}
