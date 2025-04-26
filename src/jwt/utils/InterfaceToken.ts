export interface TokenPayload {
  user_id: string;
  role: string;
  exp?: number;
  iat?: number;
}
