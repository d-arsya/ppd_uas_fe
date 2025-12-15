// lib/api.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// Types
export interface User {
  id: number;
  email: string;
  fullname: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface PredictionRequest {
  text: string;
}

export interface PredictionResponse {
  text: string;
  sentiment: "positive" | "negative" | "neutral";
}

export interface NewsItem {
  article_id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  sentiment: "positive" | "negative" | "neutral";
  image_url: string | null;
}

export interface NewsResponse {
  news: NewsItem[];
  page: number;
  pages: number;
  total: number;
  count: number;
}

export interface HistoryItem {
  id: number;
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  timestamp: string;
}

export interface HistoryResponse {
  history: HistoryItem[];
  page: number;
  pages: number;
  total: number;
  count: number;
}

// API Client
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(
    fullname: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ fullname, email, password }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async getProfile(token: string): Promise<{ user: User }> {
    return this.request<{ user: User }>("/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Prediction endpoint
  async predictSentiment(
    text: string,
    token: string
  ): Promise<PredictionResponse> {
    return this.request<PredictionResponse>("/api/predict", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });
  }

  // News endpoint (no auth required)
  async getNews(page: number = 1, view: number = 10): Promise<NewsResponse> {
    return this.request<NewsResponse>(`/api/news?page=${page}&view=${view}`, {
      method: "GET",
    });
  }

  // History endpoint
  async getHistory(
    token: string,
    page: number = 1,
    view: number = 10
  ): Promise<HistoryResponse> {
    return this.request<HistoryResponse>(
      `/api/history?page=${page}&view=${view}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>("/api/health", {
      method: "GET",
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
