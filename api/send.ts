import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

interface Attachment {
  filename: string;
  content: Buffer;
  content_type: string;
}

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  console.log('==== API: Received Email Request ====');
  
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Method not allowed' 
    }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  
  try {
    const data: EmailData = await request.json();
    console.log('Received data:', {
      name: data.name,
      email: data.email,
      inquiryType: data.inquiryType,
      messageLength: data.message.length,
      photoCount: data.photos?.length || 0
    });

    // Process attachments if any
    console.log('Processing attachments...');
    const attachments: Attachment[] = data.photos?.map(photo => {
      if (!photo.data.startsWith('data:')) {
        console.error('Invalid photo data format');
        return null;
      }
      
      const matches = photo.data.match(/^data:(.+);base64,(.+)$/);
      if (!matches) {
        console.error('Invalid base64 format');
        return null;
      }
      
      const contentType = matches[1];
      const base64Data = matches[2];
      const extension = contentType.split('/')[1] || 'jpg';
      
      return {
        filename: `photo-${Date.now()}.${extension}`,
        content: Buffer.from(base64Data, 'base64'),
        content_type: contentType,
      };
    }).filter((attachment): attachment is Attachment => attachment !== null) || [];

    console.log(`Processed ${attachments.length} attachments`);

    // Send email using Resend
    console.log('Sending email via Resend API...');
    const result = await resend.emails.send({
      from: process.env.VITE_EMAIL_FROM || 'contact@thecenterforunity.org',
      to: process.env.VITE_EMAIL_TO || 'contact@thecenterforunity.org',
      subject: `New Contact Form Submission: ${data.inquiryType}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Inquiry Type:</strong> ${data.inquiryType}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
      attachments,
    });

    console.log('Email sent successfully:', result);
    console.log('==== API: Email Request Complete ====');

    return new Response(JSON.stringify({ 
      success: true,
      data: result 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('==== API: Email Request Failed ====');
    console.error('Error details:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 