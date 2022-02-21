import argon2 from 'argon2';
import i18n from 'i18n';
import jwt from 'jsonwebtoken';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import Logger from '../Configs/Logger';
import { COOKIES_NAME } from '../Constants';
import { Authentication } from '../Middlewares/Auth.middleware';
import { User, UserSchema } from '../Models';
import { Context, LoginInput, RegisterInput, ServerInternal, UserMutationResponse } from '../Types';
import ValidateModel from '../Utils/Validation';

@Resolver()
export default class AuthResolver {
    //Get My user
    @UseMiddleware(Authentication)
    @Query(() => User, { nullable: true })
    async getMyUser(@Ctx() { req }: Context): Promise<User | null> {
        const user = await UserSchema.findById(req.userId);
        return user;
    }

    //Register
    @Mutation((_return) => UserMutationResponse)
    async register(
        @Arg('registerInput') registerInput: RegisterInput,
        @Ctx() { req }: Context
    ): Promise<UserMutationResponse> {
        const { username, email, password } = registerInput;

        try {
            const validate = await ValidateModel(req, registerInput);

            if (validate !== null) {
                return validate;
            }

            const existingUser = await UserSchema.findOne({
                $or: [{ username }, { email }],
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

            const newUser = await UserSchema.create({
                ...registerInput,
                password: hashPassword,
            });

            return {
                code: 201,
                success: true,
                message: i18n.__('AUTH.REGISTER.SUCCESS'),
                result: newUser,
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
        try {
            const { usernameOrEmail, password } = loginInput;

            const existingUser = await UserSchema.findOne({
                $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
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

            //jsonwebtoken
            const token = jwt.sign(
                {
                    userId: existingUser._id,
                },
                process.env.JWT_SECRET as string,
                {
                    expiresIn: '1 hour',
                }
            );

            req.session.token = token;

            return {
                code: 200,
                success: true,
                message: i18n.__('AUTH.LOGIN.SUCCESS'),
                token,
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
