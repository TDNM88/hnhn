declare module 'next' {
  export interface NextApiRequest {
    body: any;
    query: Record<string, string | string[]>;
    cookies: Record<string, string>;
    headers: Record<string, string | string[]>;
  }

  export interface NextApiResponse {
    status(code: number): NextApiResponse;
    json(data: any): void;
    send(data: any): void;
    end(): void;
    setHeader(name: string, value: string): void;
  }

  export type NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>;
}
