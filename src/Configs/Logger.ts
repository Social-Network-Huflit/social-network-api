import chalk from 'chalk';

export default class Logger {
    public static success(content: any): void {
        console.log(chalk.bgGreen.black(content));
    }
    public static error(content: any): void {
        console.log(chalk.bgRed.black(content));
    }
}
