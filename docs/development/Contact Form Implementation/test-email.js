// Test script for the email service
import { emailService } from './emailService.js';

async function testEmailService() {
  try {
    console.log('Testing email service...');
    
    const testEmail = process.env.VITE_TEST_EMAIL || 'contact@remembrancesupper.org';
    
    const result = await emailService.sendEmail({
      to: testEmail,
      subject: 'Test Email from Remembrance Supper Website',
      html: `
        <h1>This is a test email</h1>
        <p>If you're seeing this, the email service is working correctly!</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      `
    });
    
    if (result.success) {
      console.log('Email sent successfully!', result.data);
    } else {
      console.error('Failed to send email:', result.error);
    }
  } catch (error) {
    console.error('Error testing email service:', error);
  }
}

// Run the test
testEmailService(); 