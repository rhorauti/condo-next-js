import { IFetchResponse } from '@/interfaces/response.interface';
import { ICSRFTokenResponse } from '@/interfaces/auth.interface';
import { supabase } from '@/app/supabase/supabase.config';

/* ======================================================
   TYPES
====================================================== */

interface BaseConfig {
  apiUrl?: string;
  endpoint?: string;
  accessToken?: string;
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

/* ======================================================
   CSRF TOKEN CACHE (WITH EXPIRATION)
====================================================== */

let cachedCsrfToken: {
  token: string;
  expiresAt: number;
} | null = null;

export async function getOrFetchCsrfToken(): Promise<string> {
  if (cachedCsrfToken && Date.now() < cachedCsrfToken.expiresAt) {
    return cachedCsrfToken.token;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/csrf-token`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Erro ao obter CSRF token');
  }

  const apiResponse: IFetchResponse<ICSRFTokenResponse> = await response.json();

  const csrfToken = apiResponse.data?.csrfToken;

  if (!csrfToken) {
    throw new Error('CSRF token inválido');
  }

  cachedCsrfToken = {
    token: csrfToken,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 min
  };

  return csrfToken;
}

/* ======================================================
   HELPERS
====================================================== */

function buildApiUrl(endpoint?: string, apiUrl?: string) {
  if (apiUrl) return apiUrl;
  if (endpoint) return `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`;
  return '/';
}

async function handleResponse(response: Response) {
  if (response.status === 401 || response.status === 403) {
    throw new Error('UNAUTHORIZED');
  }

  if (!response.ok) {
    let message = 'Erro interno do servidor';

    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch {}

    throw new Error(message);
  }

  if (
    response.status === 204 ||
    response.headers.get('content-length') === '0'
  ) {
    return null;
  }

  return response.json();
}

/* ======================================================
   SUPABASE SESSION (AUTO REFRESH)
====================================================== */

async function attachSupabaseSession(
  headers: HeadersInit
): Promise<HeadersInit> {
  const { data: sessionData, error } = await supabase.auth.getSession();

  if (error) throw error;

  const session = sessionData.session;

  if (!session) {
    throw new Error('UNAUTHORIZED');
  }

  /**
   * 🔥 IMPORTANT:
   * getUser() forces validation + refresh if expired
   */
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new Error('UNAUTHORIZED');
  }

  return {
    ...headers,
    Authorization: `Bearer ${session.access_token}`,
  };
}

/* ======================================================
   CSRF ATTACHER
====================================================== */

async function applyCsrfIfNeeded(method: string, headers: HeadersInit) {
  const isMutating =
    method === 'POST' || method === 'PUT' || method === 'DELETE';

  if (!isMutating) return headers;

  const csrfToken = await getOrFetchCsrfToken();

  return {
    ...headers,
    'X-CSRF-Token': csrfToken,
  };
}

/* ======================================================
   JSON REQUEST
====================================================== */

export async function onHttpRequestJson({
  endpoint,
  method = 'GET',
  accessToken,
}: JsonConfig) {
  const url = buildApiUrl(endpoint);

  let headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(accessToken && {
      Authorization: `Bearer ${accessToken}`,
    }),
  };

  headers = await attachSupabaseSession(headers);
  headers = await applyCsrfIfNeeded(method, headers);

  const response = await fetch(url, {
    method,
    credentials: 'include',
    headers,
  });

  return handleResponse(response);
}

/* ======================================================
   FORM DATA REQUEST
====================================================== */

export async function onHttpRequestFormData({
  endpoint,
  method = 'POST',
  accessToken,
  formData,
}: FormDataConfig) {
  const url = buildApiUrl(endpoint);

  let headers: HeadersInit = {
    ...(accessToken && {
      Authorization: `Bearer ${accessToken}`,
    }),
  };

  headers = await attachSupabaseSession(headers);
  headers = await applyCsrfIfNeeded(method, headers);

  const response = await fetch(url, {
    method,
    credentials: 'include',
    headers,
    body: formData,
  });

  return handleResponse(response);
}

/* ======================================================
   EXTERNAL REQUEST
====================================================== */

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
