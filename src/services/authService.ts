import api from "./api";

export interface Caregiver {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  caregiver: Caregiver;
}

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data);
    const result = response.data;
    if (result.success && result.data) {
      localStorage.setItem("authToken", result.data.token);
      localStorage.setItem("caregiverName", result.data.caregiver.name);
      localStorage.setItem("caregiverEmail", result.data.caregiver.email);
    }
    return result.data;
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    const result = response.data;
    if (result.success && result.data) {
      localStorage.setItem("authToken", result.data.token);
      localStorage.setItem("caregiverName", result.data.caregiver.name);
      localStorage.setItem("caregiverEmail", result.data.caregiver.email);
    }
    return result.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      // Ignore error during logout
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("caregiverName");
      localStorage.removeItem("caregiverEmail");
    }
  },

  getProfile: async (): Promise<Caregiver> => {
    const response = await api.get("/auth/profile");
    return response.data?.data;
  },
};

export default authService;
