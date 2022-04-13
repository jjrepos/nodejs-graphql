import { fieldsList } from "graphql-fields-list";
import { createParamDecorator } from "type-graphql";

function Fields(): ParameterDecorator {
    return createParamDecorator(({ info }): string[] => {
        return fieldsList(info);
    });
}

export { Fields };

