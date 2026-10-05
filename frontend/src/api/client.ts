export const API_BASE_URL = 'http://localhost:8080/api';

export const getAuthToken = () => {
  const session = localStorage.getItem('cc_auth_session');
  if (session) {
    try {
      const data = JSON.parse(session);
      return data.token;
    } catch {
      return null;
    }
  }
  return null;
};

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = response.statusText;
    try {
      const errorData = await response.text();
      if (errorData) errorMsg = errorData;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  // Some endpoints might not return JSON (e.g. 204 No Content, or empty responses)
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};
