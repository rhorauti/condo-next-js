const token = '';

/**
 * @param endpoint The API endpoint (e.g., '/users')
 * @param method The HTTP method (GET, POST, PUT, DELETE)
 * @param data The data (body) to send (for POST, PUT)
 * @returns The JSON response data
 */
export async function httpRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: unknown
): Promise<T> {
  const baseUrl = process.env.API_URL;
  const url = `${baseUrl}${endpoint}`;

  const options: RequestInit = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData instanceof Error) {
        throw new Error(errorData.message || 'Erro interno do servidor');
      }
    }

    if (
      response.status === 204 ||
      response.headers.get('content-length') === '0'
    ) {
      return null as T;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`apiService error: ${error.message}`);
    }
    throw error;
  }
}
