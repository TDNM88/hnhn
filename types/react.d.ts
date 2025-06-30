import * as React from 'react';

declare module 'react' {
  export function useState<T>(initialState: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>];
  export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  
  export type ReactNode = 
    | React.ReactElement
    | string
    | number
    | boolean
    | null
    | undefined
    | React.ReactNodeArray;
  
  export interface ReactNodeArray extends Array<ReactNode> {}
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
