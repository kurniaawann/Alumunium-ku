export interface TokenPayload {
  user_id: String;
  role: string
  exp?: number;
  iat?: number;
}