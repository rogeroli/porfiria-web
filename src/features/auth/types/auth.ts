export enum UserProfile {
  Patient = 'PATIENT',
  Doctor = 'DOCTOR',
  Researcher = 'RESEARCHER',
}

export enum UserStatus {
  Pending = 'PENDING',
  Available = 'AVAILABLE',
  ChangePassword = 'CHANGE_PASSWORD',
}

export interface RegisterUserInput {
  name: string;
  profile: UserProfile;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisteredUser {
  id: string;
  name: string;
  profile: UserProfile;
  status: UserStatus;
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
  profile: UserProfile;
  status: UserStatus;
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
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
