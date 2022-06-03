import { Request } from '../Types';
import jwt from 'jsonwebtoken';
import { Logger } from '../Configs';

export default async function CheckLogged(req: Request): Promise<boolean> {
    if (req.device?.type === 'desktop') {
        if (req.session.userId) return true;
    }

    if (req.device?.type === 'phone') {
        const bearerToken = req.headers.authorization;

        const token = bearerToken?.replace('Bearer ', '');

        if (token) {
            return new Promise<boolean>((resolve) => {
                jwt.verify(token, process.env.JWT_SECRET as string, (err) => {
                    if (err) {
                        Logger.error(err);
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                });
            });
        }
    }

    return false;
}
