import { google } from 'googleapis';
import nodemailer from 'nodemailer';

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = process.env;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export default async function SendGmail(to: string, code: string) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'oauth2',
                user: 'doba.fullstack@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken as any,
            },
        });

        const mailOptions = {
            from: 'Netzen Network',
            to,
            subject: 'Verify Code Forgot Password',
            text: 'Verify Code Forgot Password',
            html: `<h1>This is your verify code: <strong>${code}</strong></h1>`,
        };

        const result = await transport.sendMail(mailOptions);

        return result;
    } catch (error) {
        return error;
    }
}
