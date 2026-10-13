
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface RegisterResponse {
  message: string;
}

export interface LoginRequest{
  email:string;
  password:string;
}

export interface LoginResponse{
  message:string;
  publicId:string;
  accessToken:string;
  refreshToken:string;
  tokenType:string;
}