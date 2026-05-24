declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: string;
      email: string;
      iat?: number;
      exp?: number;
    };
  }
}

export {};
