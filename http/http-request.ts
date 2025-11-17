const token = '';

interface HttpConfig {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
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
  data,
}: HttpConfig): Promise<any> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
  console.log('url', url);

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

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`apiService error: ${error.message}`);
    }
    throw error;
  }
}
