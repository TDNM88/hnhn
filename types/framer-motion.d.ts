declare module 'framer-motion' {
  import * as React from 'react';
  
  export interface AnimatePresenceProps {
    children?: React.ReactNode;
    initial?: boolean;
    onExitComplete?: () => void;
    exitBeforeEnter?: boolean;
  }
  
  export const AnimatePresence: React.FC<AnimatePresenceProps>;
  
  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    variants?: any;
    whileHover?: any;
    whileTap?: any;
    whileFocus?: any;
    whileDrag?: any;
    whileInView?: any;
    viewport?: any;
    [key: string]: any;
  }
  
  export const motion: {
    div: React.FC<MotionProps & React.HTMLAttributes<HTMLDivElement>>;
    span: React.FC<MotionProps & React.HTMLAttributes<HTMLSpanElement>>;
    button: React.FC<MotionProps & React.HTMLAttributes<HTMLButtonElement>>;
    a: React.FC<MotionProps & React.AnchorHTMLAttributes<HTMLAnchorElement>>;
    img: React.FC<MotionProps & React.ImgHTMLAttributes<HTMLImageElement>>;
    [key: string]: React.FC<MotionProps & any>;
  };
  
  export const useAnimation: () => any;
  export const useMotionValue: (initialValue: number) => any;
  export const useTransform: (value: any, inputRange: number[], outputRange: any[]) => any;
  export const useViewportScroll: () => { scrollY: any; scrollX: any; scrollYProgress: any; scrollXProgress: any };
  export const useInView: (options?: any) => [React.RefObject<any>, boolean];
}
