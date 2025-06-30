import { apiPost } from "../utils/api";
import {
  LoginRequest,
  RegisterDto,
  CreateUserDto,
  AuthResponse,
  User,
} from "../types/api";

class AuthService {
  private readonly baseUrl = "/auth";

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log(
      "authService.login - Starting login with credentials:",
      credentials
    );

    const response = await apiPost<{
      data: AuthResponse;
      message: string;
      statusCode: number;
    }>(`${this.baseUrl}/login`, credentials);

    console.log("authService.login - API response:", response);

    // Extract data from response.data
    const authData = response.data;

    // Store token and user data
    localStorage.setItem("access_token", authData.accessToken);
    localStorage.setItem("user", JSON.stringify(authData.user));

    console.log("authService.login - Stored in localStorage:", {
      token: authData.accessToken,
      user: authData.user,
    });

    return authData;
  }

  // Dành cho user tự đăng ký
  async register(userData: RegisterDto): Promise<AuthResponse> {
    console.log(
      "authService.register - Starting registration with data:",
      userData
    );

    const response = await apiPost<{
      data: AuthResponse;
      message: string;
      statusCode: number;
    }>(`${this.baseUrl}/register`, userData);

    console.log("authService.register - API response:", response);

    // Extract data from response.data
    const authData = response.data;

    // Store token and user data
    localStorage.setItem("access_token", authData.accessToken);
    localStorage.setItem("user", JSON.stringify(authData.user));

    console.log("authService.register - Stored in localStorage:", {
      token: authData.accessToken,
      user: authData.user,
    });

    return authData;
  }

  // Dành cho admin tạo user mới
  async createUser(userData: CreateUserDto): Promise<User> {
    return apiPost<User>(`${this.baseUrl}/create-user`, userData);
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint if available
      await apiPost(`${this.baseUrl}/logout`);
    } catch (error) {
      // Even if logout fails, clear local storage
      console.warn(
        "Logout request failed, clearing local storage anyway",
        error
      );
    } finally {
      // Clear local storage
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("access_token");

      console.log("getCurrentUser - localStorage check:", {
        hasUser: !!user,
        hasToken: !!token,
        user: user ? JSON.parse(user) : null,
      });

      if (!user || !token) {
        console.log("getCurrentUser - No user or token found");
        return null;
      }

      // For now, just return stored user without API validation
      // TODO: Add API validation when backend profile endpoint is ready
      const storedUser = JSON.parse(user);
      console.log("getCurrentUser - Returning stored user:", storedUser);
      return storedUser;

      // Optionally validate token with server (commented out for now)
      // const response = await apiGet<User>(`${this.baseUrl}/profile`);
      // return response;
    } catch (error) {
      // If parsing fails, clear storage
      console.warn(
        "getCurrentUser - Error parsing user data, clearing storage",
        error
      );
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem("access_token");
    return !!token;
  }

  getStoredUser(): User | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
}

export const authService = new AuthService();
export default authService;
