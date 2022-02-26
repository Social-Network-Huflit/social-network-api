import {Logger} from '@Configs';
import { COOKIES_NAME } from '@Constants/index';
import { User } from '@Entities';
import { Context, LoginInput, RegisterInput, ServerInternal, UserMutationResponse } from '@Types';
import ValidateInput from '@Utils/Validation';
import argon2 from 'argon2';
import i18n from 'i18n';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

@Resolver()
export default class AuthResolver {
    //Register
    @Mutation((_return) => UserMutationResponse)
    async register(
        @Arg('registerInput') registerInput: RegisterInput,
        @Ctx() { req }: Context
    ): Promise<UserMutationResponse> {
        const { username, email, password } = registerInput;

        try {
            const validate = await ValidateInput(req, registerInput);

            if (validate !== null) {
                return validate;
            }

            const existingUser = await User.findOne({
                where: [
                    { username, active: true },
                    { email, active: true },
                ],
            });

            if (existingUser) {
                return {
                    code: 400,
                    message: i18n.__('AUTH.REGISTER.DUPLICATE'),
                    success: false,
                    errors: [
                        {
                            field: existingUser.username === username ? 'username' : 'email',
                            message: `${
                                existingUser.username === username ? 'Username' : 'Email'
                            } ${i18n.__('AUTH.REGISTER.EXIST')}`,
                        },
                    ],
                };
            }

            const hashPassword = await argon2.hash(password);

            const newUser = User.create({
                ...registerInput,
                password: hashPassword,
            });

            return {
                code: 201,
                success: true,
                message: i18n.__('AUTH.REGISTER.SUCCESS'),
                result: await newUser.save(),
            };
        } catch (error: any) {
            Logger.error(error.message);
            throw new ServerInternal(error.message);
        }
    }

    //Login
    @Mutation(() => UserMutationResponse)
    async login(
        @Arg('loginInput') loginInput: LoginInput,
        @Ctx() { req }: Context
    ): Promise<UserMutationResponse> {
        const { usernameOrEmail, password } = loginInput;
        try {
            const validate = await ValidateInput(req, loginInput);

            if (validate !== null) {
                return validate;
            }

            const existingUser = await User.findOne({
                where: [
                    { username: usernameOrEmail, active: true },
                    { email: usernameOrEmail, active: true },
                ],
            });

            if (!existingUser || !(await argon2.verify(existingUser.password, password))) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('AUTH.LOGIN.INVALID.INDEX'),
                    errors: [
                        {
                            field: 'usernameOrEmail',
                            message: i18n.__('AUTH.LOGIN.INVALID.USERNAME_EMAIL'),
                        },
                        { field: 'password', message: i18n.__('AUTH.LOGIN.INVALID.PASSWORD') },
                    ],
                };
            }

            req.session.userId = existingUser.id;

            return {
                code: 200,
                success: true,
                message: i18n.__('AUTH.LOGIN.SUCCESS'),
            };
        } catch (error: any) {
            Logger.error(error.message);
            throw new ServerInternal(error.message);
        }
    }

    @Mutation(() => Boolean)
    async logout(@Ctx() { req, res }: Context): Promise<boolean> {
        res.clearCookie(COOKIES_NAME);

        return new Promise((resolver) => {
            req.session.destroy((err) => {
                if (err) {
                    resolver(false);
                } else {
                    resolver(true);
                }
            });
        });
    }
}
