export interface Sweet {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  // Optional fields for frontend display
  description?: string;
  image?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  createdAt?: string;
}

export interface CartItem {
  sweet: Sweet;
  quantity: number;
}