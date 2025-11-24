interface HttpConfig {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  contentType?: string;
  jwtToken?: string;
  csrfToken?: string;
  data?: unknown;
}

/**
 * @param endpoint The API endpoint (e.g., '/users')
 * @param method The HTTP method (GET, POST, PUT, DELETE)
 * @param data The data (body) to send (for POST, PUT)
 * @returns The JSON response data
 */
export async function httpRequest({
  endpoint,
  method = 'GET',
  contentType = 'application/json',
  jwtToken,
  csrfToken,
  data,
}: HttpConfig): Promise<any> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`;

  const options: RequestInit = {
    method: method,
    credentials: 'include',
    headers: {
      'Content-Type': contentType,
      ...(jwtToken && { Authorization: `Bearer ${jwtToken}` }),
      ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.message || errorData.error || 'Erro interno do servidor';
      throw new Error(
        Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage
      );
    }

    if (
      response.status === 204 ||
      response.headers.get('content-length') === '0'
    ) {
      return null;
    }
    console.log('json()', await response.json());
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`apiService error: ${error.message}`);
    }
    throw error;
  }
}
