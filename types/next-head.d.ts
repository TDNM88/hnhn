declare module 'next/head' {
  import * as React from 'react';
  
  export interface HeadProps {
    children?: React.ReactNode;
  }
  
  export default function Head(props: HeadProps): JSX.Element;
}
