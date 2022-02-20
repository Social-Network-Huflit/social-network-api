import md5 from "md5";
import { Arg, Mutation, Resolver } from "type-graphql";
import Logger from "../Configs/Logger";
import {User, UserSchema} from "../Models/User";
import RegisterInput from "../Types/InputType/RegisterInput";
import UserMutationResponse from "../Types/Mutation/UserMutationResponse";
import { ValidateRegister } from "../Utils/Validation";

@Resolver()
export default class AuthResolver {
    //Register
    @Mutation((_return) => UserMutationResponse)
    async Register(
        @Arg('registerInput') registerInput: RegisterInput
    ): Promise<UserMutationResponse> {
        const { username, email, password } = registerInput;
        const validate = ValidateRegister(registerInput);

        if (validate !== null) {
            return {
                ...validate,
            };
        }

        try {
            const existingUser = await UserSchema.findOne({
                $or: [{ username }, { email }],
            });

            console.log(existingUser)

            if (existingUser) {
                return {
                    code: 400,
                    message: 'Duplicate username or email',
                    success: false,
                    errors: [
                        {
                            field: existingUser.username === username ? 'username' : 'email',
                            message: `${ existingUser.username === username ? 'Username' : 'Email'} already taken`,
                        },
                    ],
                };
            }

            const hashPassword = md5(password);

            const newUser = await UserSchema.create({
                ...registerInput,
                password: hashPassword,
            });

            console.log(newUser)

            return {
                code: 201,
                success: true,
                message: 'Register successfully',
                user: newUser,
            };
        } catch (error: any) {
            Logger.error(error.message);

            return {
                code: 500,
                success: false,
                message: `Interval server error ${error.message}`,
            };
        }
    }
}
