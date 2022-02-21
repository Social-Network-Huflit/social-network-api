import { Request as ExpressRequest, Response } from 'express';
import { Session, SessionData } from 'express-session';

export type Request = ExpressRequest & {
    session: Session & Partial<SessionData> & { token?: string };
} & {
    userId?: string;
    locale?: string;
    device?: {
        type: string;
        name: string;
    }
};

type Context = {
    req: Request;
    res: Response;
};

export default Context;
