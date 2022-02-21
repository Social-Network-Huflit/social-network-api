import { ValidationError } from "class-validator";
import { FieldError } from "../Types";

//Custom error from class-validator
export default function MapErrorValidator(validate: ValidationError[]): FieldError[]{
    return validate.map(val => {
        const message = Object.values(val.constraints as {
            [type: string]: string;
        })[0];

        return {
            field: val.property,
            message
        }
    })
}