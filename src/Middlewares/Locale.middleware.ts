import { readFileSync } from 'fs';
import path from 'path';
import { MiddlewareFn } from 'type-graphql';
import { Context } from '../Types';
import i18n from 'i18n';
import { Logger } from '../Configs';

//Change language by locale from query
const LocaleMiddleware: MiddlewareFn<Context> = ({ context: { req } }, next) => {
    let locale = req.headers.locale;

    let pathname;

    if (!locale) locale = 'vi';

    switch (locale) {
        case 'en':
            pathname = '../languages/class-validator/en.json';
            i18n.setLocale('en');
            break;
        case 'vi':
            pathname = '../languages/class-validator/vi.json';
            i18n.setLocale('vi');
            break;
        default:
            pathname = '../languages/class-validator/vi.json';
            i18n.setLocale('vi');
    }

    req.locale = JSON.parse(readFileSync(path.join(__dirname, pathname)).toString());

    return next();
};

export default LocaleMiddleware;
