/**
 * Email Service TypeScript Declarations
 */

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    content_type?: string;
  }>;
  tags?: Array<{
    name: string;
    value: string;
  }>;
}

export interface EmailResult {
  success: boolean;
  data?: any;
  error?: string;
  isDev?: boolean;
}

export class EmailService {
  constructor(apiKey: string, defaultFrom?: string, defaultReplyTo?: string);
  
  sendEmail(options: EmailOptions): Promise<EmailResult>;
  
  processAttachments(photoBase64Array: string[]): Array<{
    filename: string;
    content: string;
    content_type: string;
  }>;
}

export const emailService: EmailService; 