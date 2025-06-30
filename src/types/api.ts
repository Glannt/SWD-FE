// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// User Enums
export enum UserRole {
  ADMIN = "admin",
  STUDENT = "student",
  STAFF = "staff",
  TEACHER = "teacher",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

// CreateUserDto - Dành cho admin tạo user
export interface CreateUserDto {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
  batch?: string; // IntakeBatch
  dateOfBirth?: Date;
  status?: UserStatus;
}

// RegisterDto - Dành cho user tự đăng ký
export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  confirmPassword: string;
  batch?: string; // IntakeBatch
  dateOfBirth?: Date;
  isRegister: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface User {
  user_id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

// Chat Types
export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
  sessionId: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface AskQuestionRequest {
  question: string;
  sessionId?: string;
}

export interface AskQuestionResponse {
  answer: string;
  sessionId: string;
  sources?: string[];
}

// Campus Types
export interface Campus {
  id: string;
  name: string;
  location: string;
  description: string;
  programs: Program[];
}

export interface Program {
  id: string;
  name: string;
  description: string;
  duration: string;
  tuition: number;
  requirements: string[];
}

// Error Types
export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}
