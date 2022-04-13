
import { Address } from "../../../model/Address";
import { Validator } from "./Validator";

export class AddressValidator implements Validator {
    validate(address: Address): Error | null {
        if(address !== undefined && address.countryCode.toUpperCase() == 'USA') {
            if (address.zipCode !== undefined && address.stateCode !== undefined && address.stateCode.length < 2)
                return new Error("State Code must be longer than or equal to 2 characters.");
        }

        return null;
    }
    
}