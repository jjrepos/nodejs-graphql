import { GraphQLError } from "graphql";

export class ErrorHandlerService {
    public static processError(error: GraphQLError): GraphQLError {
        if(error.extensions && error.extensions.code != "GRAPHQL_VALIDATION_FAILED" && error.extensions.exception && !error.extensions.exception.reason){
            error.extensions.code = "BAD_REQUEST_ERROR";
        }
        if(error.extensions && error.extensions.exception && error.extensions.exception.validationErrors && error.extensions.exception.validationErrors.length > 0) {
            for(let i=0; i<= error.extensions.exception.validationErrors.length - 1; i++) {
                let validationError = ErrorHandlerService.findError(error.extensions.exception.validationErrors[i]);
                if(validationError){
                    let validationConstraintError = Object.entries(validationError);
                    error.message = error.message + ": ";
                    for(let j=0; j<= validationConstraintError.length - 1; j++) {
                        error.message = error.message + validationConstraintError[j][1];
                        if(j != validationConstraintError.length - 1) {
                            error.message = error.message + ","; 
                        }  
                    } 
                }
                if(i != error.extensions.exception.validationErrors.length - 1) {
                    error.message = error.message + ","; 
                }  
            }
        }
        return error;
    }

    public static findError(validationError: any): any{
        if(validationError.constraints) {
            return validationError.constraints;
        } else if(validationError.children) {
            for(let i = 0; i<= validationError.children.length - 1; i++) {
                let constraint = this.findError(validationError.children[i]);
                if(constraint) {
                    return constraint;
                }
            } 
        }
        return null
    }
}