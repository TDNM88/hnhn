// Type declarations for modules without type definitions

declare module 'zod' {
  export interface ZodType<T> {
    parse(data: unknown): T;
    safeParse(data: unknown): { success: true; data: T } | { success: false; error: any };
  }

  export function string(): ZodType<string>;
  export function number(): ZodType<number>;
  export function boolean(): ZodType<boolean>;
  export function object<T extends Record<string, ZodType<any>>>(shape: T): ZodType<{ [K in keyof T]: T[K] extends ZodType<infer U> ? U : never }>;
}

declare module '@hookform/resolvers/zod' {
  import { ZodType } from 'zod';
  export function zodResolver<T>(schema: ZodType<T>): any;
}

declare module 'react-hook-form' {
  export function useForm<T>(options?: { resolver?: any, defaultValues?: Partial<T> }): {
    register: (name: string) => { name: string; onChange: any; onBlur: any; ref: any };
    handleSubmit: (onSubmit: (data: T) => void) => (e: any) => void;
    formState: { errors: Record<string, { message?: string }> };
  };
}

declare module 'drizzle-orm' {
  export function eq(a: any, b: any): any;
  export function and(...conditions: any[]): any;
  export function sql(strings: TemplateStringsArray, ...values: any[]): any;
}

declare interface AuthUser {
  id: string;
  username: string;
  email?: string;
  role: string;
  isVerified: boolean;
}

declare const JWT_SECRET: string;
declare const JWT_EXPIRES_IN: string;
