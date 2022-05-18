import { readFileSync } from 'fs';
import path from 'path';
import { MiddlewareFn } from 'type-graphql';
import { Context } from '../Types';

//Change language by locale from query
const LocaleMiddleware: MiddlewareFn<Context> = ({ context: { req } }, next) => {
    let locale = req.headers.locale;
    let pathname;

    
    if (!locale) locale = 'vi';
    
    switch (locale) {
        case 'en':
            pathname = '../languages/class-validator/en.json';
            break;
        case 'vi':
            pathname = '../languages/class-validator/vi.json';
            break;
        default:
            pathname = '../languages/class-validator/vi.json';
    }

    req.locale = JSON.parse(readFileSync(path.join(__dirname, pathname)).toString());

    return next();
};

export default LocaleMiddleware;
