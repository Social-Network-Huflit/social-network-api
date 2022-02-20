import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';

type Context = {
    req: Request & { session: Session & Partial<SessionData> & { token?: string } } & {
        userId?: string;
    };
    res: Response;
};

export default Context;
