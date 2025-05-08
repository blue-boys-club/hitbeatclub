import { registerAs } from '@nestjs/config';

export default registerAs(
    'email',
    (): Record<string, any> => ({
        fromEmail: 'support@findeet.io',
        domain: process.env.DOMAIN
    })
);
