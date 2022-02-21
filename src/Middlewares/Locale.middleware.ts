import { readFileSync } from 'fs';
import path from 'path';
import i18n from 'i18n';
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

    i18n.setLocale(locale as string);
    req.locale = JSON.parse(readFileSync(path.join(__dirname, pathname)).toString());

    return next();
};

export default LocaleMiddleware;
