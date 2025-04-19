/**
 * Email Service Module
 * A reusable service for sending emails using Resend API
 */

class EmailService {
  constructor(apiKey, defaultFrom = '', defaultReplyTo = '') {
    this.apiKey = apiKey;
    this.defaultFrom = defaultFrom;
    this.defaultReplyTo = defaultReplyTo;
    this.isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
  }

  /**
   * Send an email using Resend API
   * @param {Object} options - Email options
   * @returns {Promise<Object>} - Result of the email sending operation
   */
  async sendEmail(options) {
    try {
      if (this.isDev) {
        console.log('📧 Email Service: Sending email in development mode');
        console.log('Email options:', JSON.stringify(options, null, 2));
      }

      // Configure email parameters
      const emailConfig = {
        from: options.from || this.defaultFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo || this.defaultReplyTo,
        attachments: options.attachments || []
      };

      if (this.isDev) {
        // In development mode, just log the email and return success
        console.log('Email would be sent with config:', emailConfig);
        return {
          success: true,
          data: { id: 'dev-mode-email-id', message: 'Email logged in development mode' },
          isDev: true
        };
      } else {
        // In production, use the serverless API endpoint
        console.log('Sending email via API');
        
        try {
          const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailConfig),
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
              const data = await response.json();
              return {
                success: true,
                data
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
        } catch (networkError) {
          console.error('Network error sending email:', networkError);
          return {
            success: false,
            error: 'Network error when connecting to email service'
          };
        }
      }
    } catch (error) {
      console.error('Email Service Error:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred while sending email',
        isDev: this.isDev
      };
    }
  }

  /**
   * Process photo attachments from base64 data
   * @param {Array} photoBase64Array - Array of base64 encoded photos
   * @returns {Array} - Processed attachments for email
   */
  processAttachments(photoBase64Array) {
    console.log('==== Processing Attachments ====');
    console.log('Received attachment array length:', Array.isArray(photoBase64Array) ? photoBase64Array.length : 'Not an array');
    
    if (!photoBase64Array || !photoBase64Array.length) {
      console.log('No attachments to process, returning empty array');
      return [];
    }
    
    console.log('Starting attachment processing...');
    
    const processedAttachments = photoBase64Array.map((photo, index) => {
      console.log(`Processing attachment ${index + 1}/${photoBase64Array.length}`);
      
      // Check the type of the photo data
      console.log(`Photo ${index + 1} type:`, typeof photo);
      
      if (typeof photo !== 'string') {
        console.error(`Photo ${index + 1} is not a string but a ${typeof photo}`, photo);
        return null;
      }
      
      // Check if it's a proper data URL
      if (!photo.startsWith('data:')) {
        console.error(`Photo ${index + 1} is not a proper data URL`);
        
        // Try to log the first 50 characters for debugging
        try {
          console.log(`Photo ${index + 1} prefix:`, photo.substring(0, 50) + '...');
        } catch (e) {
          console.error(`Could not log photo prefix: ${e.message}`);
        }
        
        return null;
      }
      
      // Extract the base64 data and content type
      const matches = photo.match(/^data:(.+);base64,(.+)$/);
      
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
    }).filter(Boolean); // Remove any null entries
    
    console.log(`Successfully processed ${processedAttachments.length} out of ${photoBase64Array.length} attachments`);
    console.log('==== Attachment Processing Complete ====');
    
    return processedAttachments;
  }
}

// Create and export a singleton instance
const apiKey = import.meta.env.VITE_RESEND_API_KEY;
const defaultFrom = import.meta.env.VITE_EMAIL_FROM || 'Remembrance Supper <contact@thecenterforunity.org>';
const defaultReplyTo = import.meta.env.VITE_EMAIL_TO || 'contact@thecenterforunity.org';

export const emailService = new EmailService(apiKey, defaultFrom, defaultReplyTo); 