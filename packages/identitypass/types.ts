export interface IdentityPassConfig {
  apiKey: string;
  appId: string;
  baseUrl?: string;
  timeout?: number;
}

export interface IdentityPassVerificationRequest {
  number: string;
  service_type: string;
  [key: string]: any;
}

export interface IdentityPassVerificationResponse {
  status: boolean;
  detail: string;
  response_code: string;
  verification?: {
    status: boolean;
    [key: string]: any;
  };
}
