const API_BASE_URL = 'http://localhost:3001/api';

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to make API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: async (email: string, password: string, name: string) => {
    return apiRequest<{
      message: string;
      user: {
        id: string;
        email: string;
        name: string;
        isAdmin: boolean;
        createdAt: string;
      };
      token: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  login: async (email: string, password: string) => {
    return apiRequest<{
      message: string;
      user: {
        id: string;
        email: string;
        name: string;
        isAdmin: boolean;
      };
      token: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};

// Sweets API
export const sweetsAPI = {
  getAll: async () => {
    return apiRequest<{
      message: string;
      sweets: Array<{
        id: string;
        name: string;
        category: string;
        price: number;
        quantity: number;
        createdAt: string;
        updatedAt: string;
      }>;
    }>('/sweets');
  },

  search: async (params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params.name) searchParams.append('name', params.name);
    if (params.category) searchParams.append('category', params.category);
    if (params.minPrice) searchParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());

    return apiRequest<{
      message: string;
      sweets: Array<{
        id: string;
        name: string;
        category: string;
        price: number;
        quantity: number;
        createdAt: string;
        updatedAt: string;
      }>;
    }>(`/sweets/search?${searchParams.toString()}`);
  },

  create: async (sweetData: {
    name: string;
    category: string;
    price: number;
    quantity: number;
  }) => {
    return apiRequest<{
      message: string;
      sweet: {
        id: string;
        name: string;
        category: string;
        price: number;
        quantity: number;
        createdAt: string;
        updatedAt: string;
      };
    }>('/sweets', {
      method: 'POST',
      body: JSON.stringify(sweetData),
    });
  },

  update: async (id: string, sweetData: {
    name?: string;
    category?: string;
    price?: number;
    quantity?: number;
  }) => {
    return apiRequest<{
      message: string;
      sweet: {
        id: string;
        name: string;
        category: string;
        price: number;
        quantity: number;
        createdAt: string;
        updatedAt: string;
      };
    }>(`/sweets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sweetData),
    });
  },

  delete: async (id: string) => {
    return apiRequest<{
      message: string;
    }>(`/sweets/${id}`, {
      method: 'DELETE',
    });
  },

  purchase: async (id: string, quantity: number) => {
    return apiRequest<{
      message: string;
      sweet: {
        id: string;
        name: string;
        category: string;
        price: number;
        quantity: number;
        createdAt: string;
        updatedAt: string;
      };
      purchasedQuantity: number;
    }>(`/sweets/${id}/purchase`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    });
  },

  restock: async (id: string, quantity: number) => {
    return apiRequest<{
      message: string;
      sweet: {
        id: string;
        name: string;
        category: string;
        price: number;
        quantity: number;
        createdAt: string;
        updatedAt: string;
      };
      restockedQuantity: number;
    }>(`/sweets/${id}/restock`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    });
  },
};
