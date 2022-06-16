import argon2 from 'argon2';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { Logger } from '../../Configs';
import { COOKIES_NAME } from '../../Constants';
import { User } from '../../Entities';
import {
    Context,
    LoginInput,
    RegisterInput,
    ServerInternal,
    UserMutationResponse,
} from '../../Types';
import ValidateInput from '../../Utils/Validation';
import jwt from 'jsonwebtoken';
import CheckLogged from '../../Utils/CheckLogged';
import i18n from 'i18n';

@Resolver()
export default class AuthResolver {
    //Register
    @Mutation((_return) => UserMutationResponse)
    async register(
        @Arg('registerInput') registerInput: RegisterInput,
        @Ctx() { req }: Context
    ): Promise<UserMutationResponse> {
        const { username, email, password, phoneNumber } = registerInput;

        try {
            const validate = await ValidateInput(req, registerInput);

            if (validate !== null) {
                return validate;
            }

            const existingUser = await User.findOne({
                where: [{ username }, { email }, { phoneNumber }],
            });

            if (existingUser) {
                let field =
                    existingUser.username === username
                        ? 'username'
                        : existingUser.email === email
                        ? 'email'
                        : 'phoneNumber';

                return {
                    code: 400,
                    message: i18n.__('AUTH.REGISTER.DUPLICATE'),
                    success: false,
                    errors: [
                        {
                            field,
                            message: `${field.toUpperCase()} already exist`,
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


        if (await CheckLogged(req)) {
            return {
                code: 400,
                success: false,
                message: 'You have to logout first',
            };
        }

        try {
            const validate = await ValidateInput(req, loginInput);

            if (validate !== null) {
                return validate;
            }

            const existingUser = await User.findOne({
                where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
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

            if (req.device?.type === 'desktop') {
                req.session.userId = existingUser.id;

                return {
                    code: 200,
                    success: true,
                    message: i18n.__('AUTH.LOGIN.SUCCESS'),
                    result: existingUser,
                };
            } else {
                const token = jwt.sign(
                    {
                        id: existingUser.id,
                    },
                    process.env.JWT_SECRET as string
                );

                return {
                    code: 200,
                    success: true,
                    message: i18n.__('AUTH.LOGIN.SUCCESS'),
                    token: `Bearer ${token}`,
                    result: existingUser,
                };
            }
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
