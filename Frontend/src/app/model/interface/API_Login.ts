export interface APILoginResponseModel {
    user?: string;  // User ID when login is successful
    token?: string;
    role?:string;
    errors?: {
      email?: string;
      password?: string;
    };
  }
  