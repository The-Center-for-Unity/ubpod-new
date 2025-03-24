interface EmailData {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  photos?: Array<{
    name: string;
    data: string;
  }>;
}

interface EmailResponse {
  success: boolean;
  error?: string;
  data?: any;
  isDev?: boolean;
}

class EmailService {
  private apiKey: string;
  private fromEmail: string;
  private toEmail: string;
  private siteName: string;
  private isDev: boolean;

  constructor() {
    this.apiKey = import.meta.env.RESEND_API_KEY;
    this.fromEmail = import.meta.env.VITE_EMAIL_FROM;
    this.toEmail = import.meta.env.VITE_EMAIL_TO;
    this.siteName = import.meta.env.VITE_SITE_NAME;
    this.isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
  }

  async sendEmail(data: EmailData): Promise<EmailResponse> {
    try {
      if (this.isDev) {
        console.log('📧 Email Service: Sending email in development mode');
        console.log('Email data:', JSON.stringify(data, null, 2));
        return {
          success: true,
          data: { id: 'dev-mode-email-id', message: 'Email logged in development mode' },
          isDev: true
        };
      }

      console.log('Sending email via API');
      
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          inquiryType: data.inquiryType,
          message: data.message,
          photos: data.photos,
        }),
      });

      const isJsonResponse = response.headers.get('content-type')?.includes('application/json');
      
      if (!response.ok) {
        if (isJsonResponse) {
          const errorData = await response.json();
          return {
            success: false,
            error: errorData.error || `Server error: ${response.status}`
          };
        } else {
          return {
            success: false,
            error: `Server error: ${response.status} ${response.statusText}`
          };
        }
      }
      
      if (isJsonResponse) {
        try {
          const responseData = await response.json();
          return {
            success: true,
            data: responseData
          };
        } catch (parseError) {
          console.error('Failed to parse JSON response:', parseError);
          return {
            success: false,
            error: 'Invalid response from server'
          };
        }
      } else {
        return {
          success: true,
          data: { message: 'Email request processed' }
        };
      }
    } catch (error) {
      console.error('Email Service Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred while sending email',
        isDev: this.isDev
      };
    }
  }

  processAttachments(photoBase64Array: Array<{ name: string; data: string }>) {
    console.log('==== Processing Attachments ====');
    console.log('Received attachment array length:', photoBase64Array?.length || 0);
    
    if (!photoBase64Array || !photoBase64Array.length) {
      console.log('No attachments to process, returning empty array');
      return [];
    }
    
    console.log('Starting attachment processing...');
    
    const processedAttachments = photoBase64Array.map((photo, index) => {
      console.log(`Processing attachment ${index + 1}/${photoBase64Array.length}`);
      
      if (!photo.data.startsWith('data:')) {
        console.error(`Photo ${index + 1} is not a proper data URL`);
        return null;
      }
      
      const matches = photo.data.match(/^data:(.+);base64,(.+)$/);
      
      if (!matches) {
        console.error(`Invalid base64 format for photo ${index + 1}`);
        return null;
      }
      
      const contentType = matches[1];
      const base64Data = matches[2];
      const extension = contentType.split('/')[1] || 'jpg';
      
      console.log(`Attachment ${index + 1} details:`, {
        contentType,
        extension,
        base64Length: base64Data.length,
        firstFewChars: base64Data.substring(0, 20) + '...'
      });
      
      return {
        filename: `photo-${index + 1}.${extension}`,
        content: base64Data,
        content_type: contentType,
      };
    }).filter(Boolean);
    
    console.log(`Successfully processed ${processedAttachments.length} out of ${photoBase64Array.length} attachments`);
    console.log('==== Attachment Processing Complete ====');
    
    return processedAttachments;
  }
}

export const emailService = new EmailService(); 