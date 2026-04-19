import { config } from '../config/index.js';
import { createServiceLogger } from '@freeshop/shared-utils';

const logger = createServiceLogger('notification-service');

interface SmsOptions {
  to: string;
  body: string;
}

class SmsProvider {
  private provider: string;

  constructor() {
    this.provider = config.sms.provider;
  }

  async sendSms(options: SmsOptions): Promise<{ messageId: string }> {
    try {
      switch (this.provider) {
        case 'twilio':
          return await this.sendViaTwilio(options);
        case 'bd-sms':
          return await this.sendViaBdSms(options);
        default:
          logger.info('SMS sending skipped - no provider configured', {
            to: options.to,
          });
          return { messageId: 'mock-' + Date.now() };
      }
    } catch (error) {
      logger.error('Failed to send SMS', {
        error: error instanceof Error ? error.message : 'Unknown error',
        to: options.to,
      });
      throw error;
    }
  }

  private async sendViaTwilio(options: SmsOptions): Promise<{ messageId: string }> {
    if (!config.sms.accountSid || !config.sms.authToken) {
      logger.warn('Twilio credentials not configured');
      return { messageId: 'mock-' + Date.now() };
    }

    const accountSid = config.sms.accountSid;
    const authToken = config.sms.authToken;
    const fromNumber = config.sms.fromNumber;

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: options.to,
          From: fromNumber,
          Body: options.body,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Twilio API error: ${response.statusText}`);
    }

    const data = await response.json() as Record<string, string>;

    logger.info('SMS sent via Twilio', {
      to: options.to,
      messageId: data.sid,
    });

    return { messageId: data.sid };
  }

  private async sendViaBdSms(options: SmsOptions): Promise<{ messageId: string }> {
    logger.info('SMS sent via BD-SMS (mock)', {
      to: options.to,
    });
    return { messageId: 'bd-sms-' + Date.now() };
  }
}

export const smsProvider = new SmsProvider();
