import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || '';
const resend = new Resend(RESEND_API_KEY);

// Interface for email data
interface EmailData {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  photos?: {
    name: string;
    data: string;
  }[];
}

/**
 * Send an email using Resend
 * @param data Email data including sender info, message, and optional photos
 * @returns Response from Resend API
 */
export async function sendEmail(data: EmailData) {
  try {
    console.log('Sending email with Resend using API key:', RESEND_API_KEY ? 'API key exists' : 'No API key found');
    
    if (!RESEND_API_KEY) {
      throw new Error('Resend API key is missing. Please check your environment variables.');
    }

    // Prepare attachments if photos are included
    const attachments = data.photos?.map(photo => ({
      filename: photo.name,
      content: photo.data.split(',')[1], // Remove the data:image/jpeg;base64, part
    })) || [];

    // Send email using Resend
    const response = await resend.emails.send({
      from: 'Remembrance Supper <onboarding@resend.dev>', // Use verified sender during testing
      to: 'gabriel@qlingua.com', // Use your email for testing
      subject: `[TEST] New ${data.inquiryType} from ${data.name}`,
      html: `
        <h1>New Message from ${data.name}</h1>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Inquiry Type:</strong> ${data.inquiryType}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
        ${data.photos && data.photos.length > 0 ? `<p><strong>Attached Photos:</strong> ${data.photos.map(p => p.name).join(', ')}</p>` : ''}
      `,
      attachments: attachments,
    });

    console.log('Resend API response:', response);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error sending email with Resend:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
} 