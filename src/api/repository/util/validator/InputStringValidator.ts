import { Validator } from "./Validator";
import { isString } from "util";
import { AddressInput } from "../../../resolver/types/input/AddressInput";

export class InputStringValidator implements Validator {
    validate(input: any): Error | null {
        let error = this.validateVariables(input, false);
        if(error instanceof Error) {
            return error;
        } 
        return null;
    }

    validateVariables(input: any, internalVariable?: boolean): Error | string | null {
        let errorVariables: string = "";
        let inputVariables = Object.entries(input);
        for(let i = 0; i <= inputVariables.length - 1; i++) {
            if(isString(inputVariables[i][1])) {
                let stringValue: string = inputVariables[i][1] as string;
                let regex: RegExp = /(^\s+$)/;
                if (regex.test(stringValue)) {
                    errorVariables = errorVariables + inputVariables[i][0] + ", ";
                }
            } else if(inputVariables[i][1] instanceof AddressInput) {
                let addressError = this.validateVariables(inputVariables[i][1], true);
                if(addressError) {
                    errorVariables = errorVariables + addressError;
                }
            } 
        }

        if(errorVariables !== "") {
            if(internalVariable) {
                return errorVariables;
            }
            errorVariables = errorVariables.substring(0, errorVariables.lastIndexOf(","));
            return new Error(errorVariables + " should not contain blank spaces only.");
        }
        return null;
    }
}