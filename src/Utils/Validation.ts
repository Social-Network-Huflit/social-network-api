import { IMutationResponse, Request } from '@Types';
import { Validator } from 'class-validator-multi-lang';
import MapErrorValidator from './MapFieldError';

export default async function ValidateInput(
    req: Request,
    input: any
): Promise<IMutationResponse | null> {
    const validation = await new Validator().validate(input, {
        messages: req.locale,
    });

    if (validation.length > 0) {
        return {
            code: 400,
            message: 'Bad Request',
            success: false,
            errors: MapErrorValidator(validation),
        };
    }

    return null;
}
