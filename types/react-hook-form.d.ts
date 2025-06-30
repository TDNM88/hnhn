declare module 'react-hook-form' {
  import * as React from 'react';

  export interface UseFormProps<TFieldValues extends FieldValues = FieldValues, TContext = any> {
    mode?: Mode;
    reValidateMode?: Mode;
    defaultValues?: DefaultValues<TFieldValues>;
    resolver?: Resolver<TFieldValues, TContext>;
    context?: TContext;
    shouldFocusError?: boolean;
    shouldUnregister?: boolean;
    shouldUseNativeValidation?: boolean;
    criteriaMode?: CriteriaMode;
    delayError?: number;
  }

  export type FieldValues = Record<string, any>;
  
  export type DefaultValues<TFieldValues> = Partial<TFieldValues>;
  
  export type Mode = 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all';
  
  export type CriteriaMode = 'firstError' | 'all';
  
  export interface ValidationRule<TValidationValue> {
    value: TValidationValue;
    message: string;
  }
  
  export interface ValidationOptions {
    required?: boolean | string;
    min?: ValidationRule<number | string> | number;
    max?: ValidationRule<number | string> | number;
    maxLength?: ValidationRule<number | string> | number;
    minLength?: ValidationRule<number | string> | number;
    pattern?: ValidationRule<RegExp> | RegExp;
    validate?: Validate<any> | Record<string, Validate<any>>;
  }
  
  export type Validate<TFieldValue> = (value: TFieldValue) => string | boolean | Promise<string | boolean>;
  
  export type FieldPath<TFieldValues extends FieldValues> = string;
  
  export interface ControllerProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
  > {
    name: TName;
    control?: Control<TFieldValues>;
    render: ({
      field,
      fieldState,
      formState,
    }: {
      field: ControllerRenderProps<TFieldValues, TName>;
      fieldState: ControllerFieldState;
      formState: UseFormStateReturn<TFieldValues>;
    }) => React.ReactElement;
    shouldUnregister?: boolean;
  }

  export interface Control<TFieldValues extends FieldValues = FieldValues> {
    _formState: any;
    _defaultValues: DefaultValues<TFieldValues>;
    _names: {
      mount: Set<string>;
      unMount: Set<string>;
      array: Set<string>;
      watch: Set<string>;
    };
    _fieldArrayDefaultValues: Record<string, unknown>;
  }
  
  export interface ControllerRenderProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
  > {
    onChange: (...event: any[]) => void;
    onBlur: () => void;
    value: any;
    name: TName;
    ref: React.Ref<any>;
  }
  
  export interface ControllerFieldState {
    invalid: boolean;
    isTouched: boolean;
    isDirty: boolean;
    error?: FieldError;
  }
  
  export interface UseFormStateReturn<TFieldValues> {
    isDirty: boolean;
    isSubmitted: boolean;
    isSubmitting: boolean;
    isSubmitSuccessful: boolean;
    isValid: boolean;
    isValidating: boolean;
    submitCount: number;
    errors: Record<string, any>;
    touchedFields: Record<string, any>;
    dirtyFields: Record<string, any>;
  }
  
  export interface FieldError {
    type: string;
    message?: string;
  }
  
  export interface Resolver<TFieldValues, TContext> {
    (values: TFieldValues, context?: TContext): Promise<ResolverResult<TFieldValues>>;
  }
  
  export interface ResolverResult<TFieldValues> {
    values: TFieldValues;
    errors: Record<string, FieldError>;
  }
  
  // Export the components and hooks
  export function Controller<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
  >(props: ControllerProps<TFieldValues, TName>): React.ReactElement;
  
  export function FormProvider<TFieldValues extends FieldValues = FieldValues>(
    props: {
      children: React.ReactNode;
    } & UseFormReturn<TFieldValues>
  ): React.ReactElement;
  
  export function useFormContext<TFieldValues extends FieldValues = FieldValues>(): UseFormReturn<TFieldValues>;
  
  export function useForm<TFieldValues extends FieldValues = FieldValues, TContext = any>(
    props?: UseFormProps<TFieldValues, TContext>
  ): UseFormReturn<TFieldValues>;
  
  export interface UseFormReturn<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>;
    register: any;
    handleSubmit: any;
    reset: any;
    formState: UseFormStateReturn<TFieldValues>;
    setValue: any;
    getValues: any;
    trigger: any;
    clearErrors: any;
    unregister: any;
    watch: any;
    setError: any;
  }
}
