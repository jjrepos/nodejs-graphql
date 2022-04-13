export interface Validator {
    validate(toValidate: any): Error | null;
}