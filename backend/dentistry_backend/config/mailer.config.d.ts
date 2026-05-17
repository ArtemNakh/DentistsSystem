import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
export declare const getMailerConfig: (configService: ConfigService) => Promise<MailerOptions>;
