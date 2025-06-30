declare module 'drizzle-orm' {
  export function eq(a: any, b: any): any;
  export function and(...conditions: any[]): any;
  export function or(...conditions: any[]): any;
  export function sql(strings: TemplateStringsArray, ...values: any[]): any;
  export function desc(column: any): any;
  export function asc(column: any): any;
  
  export interface SQLiteTable {
    select(): any;
    insert(data: any): any;
    update(data: any): any;
    delete(): any;
  }
  
  export interface SQLiteDatabase {
    query: any;
    select(): any;
    insert(): any;
    update(): any;
    delete(): any;
    transaction<T>(fn: () => Promise<T>): Promise<T>;
  }
}

declare module 'drizzle-orm/sqlite-core' {
  export function sqliteTable(name: string, columns: any): any;
  export function text(name?: string): any;
  export function integer(name?: string): any;
  export function boolean(name?: string): any;
  export function timestamp(name?: string): any;
  export function primaryKey(...columns: any[]): any;
}
