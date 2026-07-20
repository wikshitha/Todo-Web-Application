import api from "@/lib/api";

import type {
  AuthResponse,
  LoginData,
  RegisterData,
  User,
} from "@/types/auth";

export const getCsrfCookie = async (): Promise<void> => {
  await api.get("/sanctum/csrf-cookie");
};

export const register = async (
  data: RegisterData
): Promise<AuthResponse> => {
  await getCsrfCookie();

  const response = await api.post<AuthResponse>("/register", data);

  return response.data;
};

export const login = async (
  data: LoginData
): Promise<AuthResponse> => {
  await getCsrfCookie();

  const response = await api.post<AuthResponse>("/login", data);

  return response.data;
};

export const logout = async (): Promise<void> => {
  await getCsrfCookie();
  await api.post("/logout");
};

export const getAuthenticatedUser = async (): Promise<User> => {
  const response = await api.get<{ user: User }>("/api/user");

  return response.data.user;
};