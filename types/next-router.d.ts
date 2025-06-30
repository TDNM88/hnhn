declare module 'next/router' {
  export interface RouterProps {
    pathname: string;
    query: { [key: string]: string | string[] };
    asPath: string;
    isFallback: boolean;
    basePath: string;
    locale: string;
    locales: string[];
    defaultLocale: string;
    isReady: boolean;
    isPreview: boolean;
  }
  
  export interface TransitionOptions {
    shallow?: boolean;
    locale?: string | false;
    scroll?: boolean;
  }
  
  export type Url = string | UrlObject;
  export interface UrlObject {
    pathname?: string;
    query?: { [key: string]: string | string[] | number | undefined };
    hash?: string;
  }
  
  export interface UseRouterType extends RouterProps {
    back: () => void;
    forward: () => void;
    refresh: () => void;
    push: (url: Url, as?: Url, options?: TransitionOptions) => Promise<boolean>;
    replace: (url: Url, as?: Url, options?: TransitionOptions) => Promise<boolean>;
    prefetch: (url: Url) => Promise<void>;
    events: {
      on: (event: string, handler: (...args: any[]) => void) => void;
      off: (event: string, handler: (...args: any[]) => void) => void;
      emit: (event: string, ...args: any[]) => void;
    };
  }
  
  export function useRouter(): UseRouterType;
  
  export const Router: {
    events: {
      on: (event: string, handler: (...args: any[]) => void) => void;
      off: (event: string, handler: (...args: any[]) => void) => void;
      emit: (event: string, ...args: any[]) => void;
    };
    push: (url: Url, as?: Url, options?: TransitionOptions) => Promise<boolean>;
    replace: (url: Url, as?: Url, options?: TransitionOptions) => Promise<boolean>;
    reload: () => void;
    back: () => void;
    prefetch: (url: Url) => Promise<void>;
    beforePopState: (cb: (state: any) => boolean) => void;
  };
  
  export default Router;
}
