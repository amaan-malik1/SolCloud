export interface JwtPayload {
  userId: string
  email: string
  tokenVersion: number
}

export interface AuthUser {
  id: string
  email: string
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}