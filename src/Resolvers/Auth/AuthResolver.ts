import argon2 from 'argon2';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { Logger } from '../../Configs';
import { COOKIES_NAME } from '../../Constants';
import { User } from '../../Entities';
import {
    ChangePasswordInput,
    Context,
    IMutationResponse,
    LoginInput,
    RegisterInput,
    ServerInternal,
    UserMutationResponse,
} from '../../Types';
import ValidateInput from '../../Utils/Validation';
import jwt from 'jsonwebtoken';
import CheckLogged from '../../Utils/CheckLogged';
import i18n from 'i18n';
import SendGmail from '../../Utils/SendMail';
import generateCode from '../../Utils/generateCode';
import { TokenModel } from '../../Models/Token';
import { Authentication } from '../../Middlewares/Auth.middleware';

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

            const token = jwt.sign(
                {
                    id: existingUser.id,
                },
                process.env.JWT_SECRET as string
            );

            if (req.device?.type === 'desktop') {
                req.session.userId = existingUser.id;

                return {
                    code: 200,
                    success: true,
                    message: i18n.__('AUTH.LOGIN.SUCCESS'),
                    result: existingUser,
                    token,
                };
            } else {
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

    @Mutation(() => IMutationResponse)
    async sendEmail(@Arg('email') email: string): Promise<IMutationResponse> {
        try {
            const existingUser = await User.findOne({
                email,
            });

            if (!existingUser) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('AUTH.FORGOT_PASSWORD.INVALID_EMAIL'),
                };
            }

            const token = generateCode(4);

            await new TokenModel({ userId: `${existingUser.id}`, token }).save();

            await SendGmail(email, token);

            return {
                code: 200,
                success: true,
                message: 'SUCCESS',
            };
        } catch (error: any) {
            throw new ServerInternal(error.message);
        }
    }

    @Mutation(() => String, { nullable: true })
    async sendCode(@Arg('code') token: string): Promise<string | null | undefined> {
        const existingToken = await TokenModel.findOne({ token });

        if (!existingToken) {
            return null;
        }

        await TokenModel.findByIdAndDelete(existingToken._id);

        return existingToken.userId;
    }

    @Mutation((_return) => IMutationResponse)
    async changePassword(
        @Arg('changePasswordInput') { newPassword, user_id }: ChangePasswordInput
    ): Promise<IMutationResponse> {
        try {
            const user = await User.findOne(user_id);

            if (!user) {
                return {
                    code: 403,
                    success: false,
                    message: i18n.__('AUTH.FIND_USER_FAIL'),
                    errors: [{ field: 'user', message: i18n.__('AUTH.FIND_USER_FAIL') }],
                };
            }

            await User.update(
                {
                    id: user_id,
                },
                {
                    password: await await argon2.hash(newPassword),
                }
            );

            return {
                code: 200,
                success: true,
                message: i18n.__('AUTH.FORGOT_PASSWORD.CHANGE_PASSWORD_SUCCESS'),
            };
        } catch (error: any) {
            Logger.error(error.message);
            return {
                code: 500,
                message: error.message,
                success: false,
            };
        }
    }

    @UseMiddleware(Authentication)
    @Mutation((_return) => IMutationResponse)
    async changeOldPassword(
        @Arg('newPassword') newPassword: string,
        @Arg('oldPassword') oldPassword: string,
        @Ctx() { req }: Context
    ): Promise<IMutationResponse>{
        const user = await User.getMyUser(req);

        const checkPassword = await argon2.verify(user.password, oldPassword)

        if (!checkPassword) return {
            code: 400,
            success: false,
            message: "FAIL"
        }

        await User.update({
            id: user.id
        }, {
            password: await argon2.hash(newPassword)
        })

        return {
            code: 200,
            success: true,
            message: "SUCCESS"
        }
    }
}
