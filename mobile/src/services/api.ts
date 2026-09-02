import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "http://localhost:4000";

interface ApiOptions {
  method?: string;
  body?: unknown;
}

class ApiClient {
  private token: string | null = null;

  async setToken(token: string | null) {
    this.token = token;
    if (token) {
      await AsyncStorage.setItem("tpid_token", token);
    } else {
      await AsyncStorage.removeItem("tpid_token");
    }
  }

  async loadToken() {
    this.token = await AsyncStorage.getItem("tpid_token");
    return this.token;
  }

  async request<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ user?: { id: string; name: string; email: string }; token?: string }>("/api/auth/callback/credentials", {
      method: "POST",
      body: { email, password },
    });
    return data;
  }

  // Projects
  async getProjects() {
    return this.request("/api/projects");
  }

  async getProject(slug: string) {
    return this.request(`/api/projects/${slug}`);
  }

  // Evidence
  async getEvidence(slug: string) {
    return this.request(`/api/projects/${slug}/evidence`);
  }

  // Reports
  async getReports(slug: string) {
    return this.request(`/api/projects/${slug}/reports`);
  }

  // Health
  async getHealth() {
    return this.request("/api/health");
  }
}

export const api = new ApiClient();
export default api;
