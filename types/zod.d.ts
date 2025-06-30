declare module 'zod' {
  export interface ZodType<T> {
    parse(data: unknown): T;
    safeParse(data: unknown): { success: true; data: T } | { success: false; error: any };
    min(length: number, message?: string): ZodType<T>;
    max(length: number, message?: string): ZodType<T>;
    email(message?: string): ZodType<T>;
    refine(refinement: (data: T) => boolean, message?: string | { message: string }): ZodType<T>;
  }

  export function string(): ZodType<string>;
  export function number(): ZodType<number>;
  export function boolean(): ZodType<boolean>;
  export function object<T extends Record<string, ZodType<any>>>(shape: T): ZodType<{ [K in keyof T]: T[K] extends ZodType<infer U> ? U : never }>;
  
  export type infer<T extends ZodType<any>> = T extends ZodType<infer U> ? U : never;
}
