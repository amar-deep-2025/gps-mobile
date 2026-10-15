
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../../types/Auth";

const AUTH_BASE_URL = process.env.EXPO_PUBLIC_AUTH_SERVICE_URL;



if (!AUTH_BASE_URL) {
  throw new Error(
    "PUBLIC_AUTH_SERVICE_URL is not configured in .env"
  );
}

async function parseResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorMessage(data: unknown, status: number): string {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return `Request failed with status ${status}`;
}

export async function registerUser(
  request: RegisterRequest
): Promise<string> {
  const response = await fetch(`${AUTH_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(request),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, response.status));
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  return "Registration successful";
}

export async function loginUser(
  request: LoginRequest
): Promise<LoginResponse> {
  const response = await fetch(`${AUTH_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(request),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, response.status));
  }

  if (
    typeof data !== "object" ||
    data === null ||
    !("accessToken" in data) ||
    typeof data.accessToken !== "string" ||
    !("refreshToken" in data) ||
    typeof data.refreshToken !== "string" ||
    !("publicId" in data) ||
    typeof data.publicId !== "string" ||
    !("tokenType" in data) ||
    typeof data.tokenType !== "string" ||
    !("message" in data) ||
    typeof data.message !== "string"
  ) {
    throw new Error("Invalid login response received from server");
  }

  return data as LoginResponse;
}

export async function logoutUser(
  refreshToken:string
): Promise<string>{
  const response=await fetch(`${AUTH_BASE_URL}/logout`,{
    method:"POST",
    headers :{
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      refreshToken
    })
  });
  const responseText=await response.text();

  let message="";
  if (responseText){
    try{
      const data: unknown=JSON.parse(responseText);
      if (typeof data==="string"){
        message=data;
      }else if(typeof data==="object" && data!=null && "message" in data && typeof data.message==="string"){
        message=data.message;
      }else{
        message=responseText;
      }
    }catch{
      message=responseText;
    }
  }
  if (!response.ok){
    throw new Error(
      message || `Logout failed with status  ${response.status}`
    );
  }
  return message || "Logout successful";
}
