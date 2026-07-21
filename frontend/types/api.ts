export interface ValidationErrors {
  [field: string]: string[];
}

export interface LaravelValidationError {
  message: string;
  errors: ValidationErrors;
}