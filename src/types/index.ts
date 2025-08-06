export interface User {
  _id: string;
  username: string;
  email: string;
  img?: string;
  country: string;
  phone?: string;
  desc?: string;
  isSeller: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Gig {
  _id: string;
  title: string;
  desc: string;
  totalStars: number;
  starNumber: number;
  price: number;
  cover: string;
  images?: string[];
  category: string;
  userId: string;
  shortTitle: string;
  shortDesc: string;
  deliveryTime: number;
  revisionNumber: number;
  features?: string[];
  sales: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  gigId: string;
  img: string;
  title: string;
  price: number;
  sellerId: string;
  buyerId: string;
  isCompleted: boolean;
  payment_intent: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  userId: string;
  desc: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  readBySeller: boolean;
  readByBuyer: boolean;
  lastMessage?: string;
  sellerId: string;
  buyerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  gigId: string;
  userId: string;
  star: number;
  desc: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  country: string;
  isSeller: boolean;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface CreateGigData {
  title: string;
  desc: string;
  category: string;
  price: number;
  cover: string;
  images?: string[];
  shortTitle: string;
  shortDesc: string;
  deliveryTime: number;
  revisionNumber: number;
  features?: string[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
} 