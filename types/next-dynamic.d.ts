declare module 'next/dynamic' {
  import React from 'react';

  interface LoaderComponent<P = {}> {
    (props: P): JSX.Element | null;
    displayName?: string;
    preload?: () => Promise<React.ComponentType<P>>;
  }

  interface NextDynamicOptions<P = {}> {
    loader?: () => Promise<React.ComponentType<P> | { default: React.ComponentType<P> }>;
    loading?: React.ComponentType<{ isLoading: boolean; pastDelay: boolean; error?: Error }>;
    ssr?: boolean;
    suspense?: boolean;
    loadableGenerated?: {
      webpack?: () => number[];
      modules?: string[];
    };
    displayName?: string;
  }

  type DynamicComponent<P = {}> = React.ComponentType<P>;

  export default function dynamic<P = {}>
    (dynamicOptions: () => Promise<React.ComponentType<P> | { default: React.ComponentType<P> }> | NextDynamicOptions<P>, options?: NextDynamicOptions<P>): DynamicComponent<P>;
}
