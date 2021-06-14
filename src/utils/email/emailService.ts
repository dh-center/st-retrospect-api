import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import resetPasswordTemplate from './templates/resetPassword';

/**
 * Represents template data for sending email to client
 */
interface TemplateData {
  /**
   * HTML version of the letter
   */
  html: string;

  /**
   * Plain text version of the letter
   */
  text: string;

  /**
   * Subject of the letter
   */
  subject: string;
}

/**
 * Function for generating template data
 */
export type TemplateFunction<T> = (variables: T) => TemplateData;

/**
 * All possible templates
 */
const templates  = {
  resetPassword: resetPasswordTemplate,
};

/**
 * All possible template names
 */
type TemplateNames = keyof typeof templates;

/**
 * Helper for sending emails
 */
export default class EmailService {
  /**
   * SMTP transport config
   */
  private config: SMTPTransport.Options = {
    host: process.env.SMTP_HOST || '',
    port: +(process.env.SMTP_PORT || ''),
    secure: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  /**
   * Transporter for sending emails
   */
  private transporter = nodemailer.createTransport(this.config);

  /**
   * Send email to specified receiver from template
   *
   * @param to - email's receivers
   * @param templateName - name of the template to generate letter
   * @param variables - variables for generating letter
   */
  public async send<T extends TemplateNames>(to: string, templateName: T, variables: Parameters<typeof templates[T]>[0]): Promise<void> {
    const emailContent = templates[templateName](variables);

    const mailOptions = {
      from: `"${process.env.SMTP_SENDER_NAME}" <${
        process.env.SMTP_SENDER_ADDRESS
      }>`, // sender address
      to,
      ...emailContent,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log(emailContent);
    }

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (e) {
      console.error(
        'Error sending letter. Try to check the environment settings (in .env file).'
      );
    }
  }
}
