export enum UserStatus {
  Pending = 'PENDING',
  Available = 'AVAILABLE',
  ChangePassword = 'CHANGE_PASSWORD',
}

export enum UserRole {
  User = 'USER',
  Admin = 'ADMIN',
}

export enum ProfileStatus {
  Active = 'ACTIVE',
  Disabled = 'DISABLED',
}

export interface ProfileSummary {
  id: string;
  code: string;
  name: string;
  description: string | null;
  status: ProfileStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterUserInput {
  name: string;
  profileId: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisteredUser {
  id: string;
  name: string;
  profileId: string;
  profile: ProfileSummary;
  status: UserStatus;
  role: UserRole;
  email: string;
  createdAt: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  profileId: string;
  profile: ProfileSummary;
  status: UserStatus;
  role: UserRole;
  email: string;
  createdAt: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  mustChangePassword: boolean;
  user: AuthUser;
}

export interface MessageResponse {
  message: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
