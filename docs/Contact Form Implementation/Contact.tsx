import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMessageCircle } from 'react-icons/fi';
import { PhotoSharing } from '../components/remembrance/PhotoSharing';
import { emailService } from '../utils/emailService.js';

// Flag to control whether to show the Photo Sharing section
const SHOW_PHOTO_SHARING_SECTION = false;

// Form field interface
interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'file';
  placeholder: string;
  required: boolean;
  options?: string[];
}

// Additional state for file handling
interface PhotoData {
  name: string;
  data: string;
}

// Submit status interface
interface SubmitStatus {
  success: boolean;
  message: string;
  error?: string;
}

export default function Contact() {
  // Form ref
  const form = useRef<HTMLFormElement>(null);

  // Form fields
  const formFields: FormField[] = [
    {
      id: 'name',
      label: 'Your Name',
      type: 'text',
      placeholder: 'Enter your full name',
      required: true
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter your email address',
      required: true
    },
    {
      id: 'inquiryType',
      label: 'Inquiry Type',
      type: 'select',
      placeholder: 'Select an inquiry type',
      required: true,
      options: [
        'General Question',
        'Hosting Assistance',
        'Resource Request',
        'Share Your Experience',
        'April 6 Event',
        'Other'
      ]
    },
    {
      id: 'message',
      label: 'Your Message',
      type: 'textarea',
      placeholder: 'Enter your message or question here...',
      required: true
    },
    {
      id: 'photos',
      label: 'Share Photos (Optional)',
      type: 'file',
      placeholder: 'Upload photos from your Remembrance Supper gathering',
      required: false
    }
  ];

  // Form state
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    inquiryType: '',
    message: '',
    photos: null as FileList | null
  });

  // Additional state for file handling
  const [photoBase64, setPhotoBase64] = useState<PhotoData[]>([]);
  const [photoNames, setPhotoNames] = useState<string[]>([]);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('==== Photo Upload Started ====');
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      console.log('No files selected for upload');
      return;
    }
    
    console.log(`${files.length} files selected for upload`);
    
    // Check that total size doesn't exceed 10MB
    const totalSizeBytes = Array.from(files).reduce((sum, file) => sum + file.size, 0);
    const totalSizeMB = totalSizeBytes / (1024 * 1024);
    
    console.log('Total file size:', totalSizeMB.toFixed(2), 'MB');
    
    if (totalSizeMB > 10) {
      console.warn('Files exceed the 10MB limit, not processing');
      setSubmitStatus({
        success: false,
        message: 'Total photo size exceeds 10MB. Please choose smaller photos.'
      });
      return;
    }
    
    // Update file input display
    setFormState(prev => ({
      ...prev,
      photos: files
    }));
    
    // Store file names for UI display
    const fileNames = Array.from(files).map(file => file.name);
    setPhotoNames(fileNames);
    console.log('Photo names for display:', fileNames);
    
    // Convert files to base64
    console.log('Starting conversion of photos to base64...');
    const readers = Array.from(files).map((file, index) => {
      return new Promise<{name: string, data: string}>((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onloadend = () => {
          console.log(`File ${index + 1} read complete, result type:`, typeof reader.result);
          if (reader.result && typeof reader.result === 'string') {
            console.log(`File ${index + 1} converted to base64 string of length:`, reader.result.length);
            resolve({
              name: file.name,
              data: reader.result
            });
          } else {
            console.error(`File ${index + 1} failed to convert to string, result:`, reader.result);
            reject(new Error('Failed to convert file to base64'));
          }
        };
        
        reader.onerror = () => {
          console.error(`Error reading file ${index + 1}:`, reader.error);
          reject(reader.error);
        };
        
        console.log(`Starting to read file ${index + 1}: ${file.name} (${file.type}, ${file.size} bytes)`);
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(readers)
      .then(results => {
        console.log(`Successfully converted ${results.length} files to base64`);
        // Log first few characters of each base64 string to check format
        results.forEach((result, i) => {
          console.log(`Base64 prefix for file ${i + 1}:`, result.data.substring(0, 50) + '...');
        });
        setPhotoBase64(results);
        console.log('==== Photo Upload Complete ====');
      })
      .catch(error => {
        console.error('Error converting files to base64:', error);
        setSubmitStatus({
          success: false,
          message: 'Error processing photos. Please try again.'
        });
      });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log('==== Form Submission Started ====');
    
    try {
      setIsSubmitting(true);
      setSubmitStatus(null);
      
      // First, validate form data
      console.log('Validating form data:', {
        name: !!formState.name,
        email: !!formState.email,
        inquiryType: !!formState.inquiryType,
        message: !!formState.message,
      });
      
      if (!formState.name || !formState.email || !formState.inquiryType || !formState.message) {
        console.warn('Form validation failed: Missing required fields');
        setSubmitStatus({
          success: false,
          message: 'Please fill out all required fields.'
        });
        setIsSubmitting(false);
        return;
      }
      
      // Check if total size of attachments exceeds 10MB
      const totalSize = photoBase64.reduce((size, photo) => {
        return size + (photo.data.length * 0.75); // base64 is ~33% larger than binary
      }, 0);
      
      console.log('Total attachment size:', Math.round(totalSize / 1024), 'KB');
      
      if (totalSize > 10 * 1024 * 1024) { // 10MB in bytes
        console.warn('Form validation failed: Attachments too large');
        setSubmitStatus({
          success: false,
          message: 'Total attachment size exceeds 10MB limit'
        });
        setIsSubmitting(false);
        return;
      }
      
      // Log form data for debugging
      console.log('Form validation passed, submitting form:', {
        name: formState.name,
        email: formState.email,
        inquiryType: formState.inquiryType,
        messageLength: formState.message.length,
        photoCount: photoBase64.length
      });
      
      if (import.meta.env.DEV) {
        console.log('DEV MODE: Will only log email without sending');
        // In development, use the emailService which logs but doesn't send
        console.log('DEV MODE: Email would be sent with form data');
        
        // Simulate network delay
        console.log('Simulating network delay...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setFormState({
          name: '',
          email: '',
          inquiryType: 'General Inquiry',
          message: '',
          photos: null
        });
        setPhotoBase64([]);
        setPhotoNames([]);
        setSubmitStatus({
          success: true,
          message: 'Your message has been logged (development mode). No actual email was sent.'
        });
        console.log('DEV MODE: Form submission completed successfully');
      } else {
        console.log('PROD MODE: Will send data to API');
        
        // Process attachments if any
        let attachments: any[] = [];
        try {
          if (photoBase64.length > 0) {
            console.log('Processing', photoBase64.length, 'attachments');
            attachments = photoBase64.map((photo, index) => ({
              filename: photo.name || `attachment-${index + 1}.jpg`,
              content: photo.data.split(',')[1]
            }));
            console.log('Attachments processed successfully:', attachments.length);
          } else {
            console.log('No attachments to process');
          }
        } catch (attachmentError) {
          console.error('Failed to process attachments:', attachmentError);
          attachments = []; // Continue without attachments
        }
        
        // Prepare request payload
        const payload = {
          name: formState.name,
          email: formState.email,
          inquiryType: formState.inquiryType,
          message: formState.message,
          attachments
        };
        
        console.log('Sending payload to API:', {
          ...payload,
          messagePreview: payload.message.substring(0, 50) + '...',
          attachmentCount: payload.attachments.length
        });
        
        // Send directly to our API endpoint
        try {
          console.log('Fetching API endpoint...');
          const timestamp = Date.now();
          const apiUrl = `/api/send?t=${timestamp}`;
          console.log(`Calling API endpoint: ${apiUrl}`);
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload),
          });
          
          console.log('API response received');
          console.log('API response status:', response.status);
          
          // Read the response as text
          const responseText = await response.text();
          console.log('API raw response:', responseText || 'EMPTY RESPONSE');
          
          // Check if we have a response at all
          if (!responseText || !responseText.trim()) {
            console.error('Empty response received from server');
            throw new Error('Server returned an empty response');
          }
          
          // Parse the response as JSON
          const responseData = JSON.parse(responseText);
          console.log('API parsed response:', responseData);
          
          // Check if the request was successful
          if (responseData.success) {
            console.log('Email sent successfully');
            // Reset form on success
            setFormState({
              name: '',
              email: '',
              inquiryType: 'General Inquiry',
              message: '',
              photos: null
            });
            setPhotoBase64([]);
            setPhotoNames([]);
            setSubmitStatus({
              success: true,
              message: 'Your message has been sent! We will get back to you soon.'
            });
          } else {
            // Handle API error response
            const errorMessage = responseData.error || 'Unknown error occurred';
            console.error('API returned error:', errorMessage);
            throw new Error(errorMessage);
          }
        } catch (error) {
          console.error('API call failed:', error);
          throw error instanceof Error ? error : new Error('Failed to communicate with the server');
        }
      }
    } catch (error: any) {
      console.error('Contact form submission error:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      setSubmitStatus({
        success: false,
        message: error.message || 'An unexpected error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
      console.log('==== Form Submission Completed ====');
    }
  };

  return (
    <main className="flex flex-col bg-navy text-white">
      {/* Hero Section */}
      <section 
        className="relative min-h-[40vh] bg-navy pt-16"
        style={{
          backgroundImage: 'url("/images/remembrance/event-bloodless-passover.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-navy/70" />

        {/* Content */}
        <div className="relative pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="max-w-3xl mx-auto text-center space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="title-main">Connect With Us</h1>
              <p className="section-subtitle">
                Share your experience, ask questions, or request resources
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-navy scroll-mt-20" id="get-in-touch">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="space-y-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center max-w-3xl mx-auto pt-4 sm:pt-0">
              <h2 className="section-title mb-4">Get in Touch</h2>
              <p className="body-lg">
                Whether you have questions about hosting a Remembrance Supper, need additional resources, 
                or want to share your experience, we're here to help.
              </p>
            </div>
            
            <div className="bg-navy-light/30 p-8 rounded-lg border border-gold/20">
              {/* Environment notice */}
              {import.meta.env.DEV && (
                <div className="mb-6 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-200">
                    <span className="font-semibold">Development Mode:</span> In this environment, emails will be sent to the development team for testing. In production, emails will be sent to the official contact address.
                  </p>
                </div>
              )}
              
              {/* Status message */}
              {submitStatus && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 mb-6 rounded-lg ${
                    submitStatus.success ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {submitStatus.success ? (
                        <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{submitStatus?.message}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                {formFields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label htmlFor={field.id} className="block text-gold font-cinzel">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>
                    
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.id}
                        name={field.id}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={formState[field.id as keyof typeof formState] as string}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-navy border border-gold/30 rounded-lg focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold text-white"
                        rows={5}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        id={field.id}
                        name={field.id}
                        required={field.required}
                        value={formState[field.id as keyof typeof formState] as string}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-navy border border-gold/30 rounded-lg focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold text-white"
                      >
                        <option value="">{field.placeholder}</option>
                        {field.options?.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : field.type === 'file' ? (
                      <div className="flex flex-col space-y-4 w-full">
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor={field.id}
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gold/30 border-dashed rounded-lg cursor-pointer bg-navy hover:bg-navy-light/20 transition-colors"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-8 h-8 mb-3 text-gold/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <p className="mb-2 text-sm text-white/70">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-white/50">
                                PNG, JPG or JPEG (MAX. 5MB per file, 3 files max)
                              </p>
                            </div>
                            <input
                              id={field.id}
                              name={field.id}
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                        
                        {/* Display uploaded files */}
                        {photoNames.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-gold text-sm mb-2">Uploaded Photos ({photoNames.length}/3)</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                              {photoBase64.map((photo, index) => (
                                <div key={index} className="relative group">
                                  <div className="aspect-w-1 aspect-h-1 bg-navy-light/30 rounded-lg overflow-hidden">
                                    <img 
                                      src={photo.data} 
                                      alt={`Uploaded photo ${index + 1}`} 
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => {
                                      // Remove the file from the arrays
                                      const newPhotoBase64 = [...photoBase64];
                                      const newPhotoNames = [...photoNames];
                                      newPhotoBase64.splice(index, 1);
                                      newPhotoNames.splice(index, 1);
                                      setPhotoBase64(newPhotoBase64);
                                      setPhotoNames(newPhotoNames);
                                      
                                      // Update the FileList in formState (this is tricky since FileList is immutable)
                                      // In a real implementation, you might want to use a different approach
                                      if (formState.photos) {
                                        const dt = new DataTransfer();
                                        const files = Array.from(formState.photos);
                                        files.splice(index, 1);
                                        files.forEach(file => dt.items.add(file));
                                        setFormState(prev => ({
                                          ...prev,
                                          photos: dt.files
                                        }));
                                      }
                                    }}
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                  <p className="text-xs text-white/70 truncate mt-1">{photo.name}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="text-xs text-white/50 mt-1">
                          <p className="mb-2">By uploading photos, you consent to their use on our website and social media channels to promote the Remembrance Supper practice. We may edit or crop images as needed.</p>
                          <p>Note: Maximum 3 photos, 5MB each.</p>
                        </div>
                      </div>
                    ) : (
                      <input
                        id={field.id}
                        name={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={formState[field.id as keyof typeof formState] as string}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-navy border border-gold/30 rounded-lg focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold text-white"
                      />
                    )}
                  </div>
                ))}
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 bg-gold text-navy font-semibold rounded-lg hover:bg-gold/90 transition-colors ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </div>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Photo Sharing Section - conditionally rendered based on flag */}
      {SHOW_PHOTO_SHARING_SECTION && (
        <section className="py-16 bg-navy-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="space-y-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <PhotoSharing 
                allowUploads={false} 
                title="Share Your Experience"
                subtitle="We invite you to share photos and stories from your Remembrance Supper gatherings using the form above. Your experiences can inspire others and help build our global community."
              />
              
              <div className="text-center">
                <Link 
                  to="/photo-sharing" 
                  className="px-6 py-3 bg-gold text-navy hover:bg-gold/80 transition-colors duration-300 rounded-full"
                >
                  View Full Gallery
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-16 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="space-y-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="section-title mb-4">Frequently Asked Questions</h2>
              <p className="body-lg">
                Find answers to common questions about the Remembrance Supper and the April 6, 2025 global event.
              </p>
            </div>
            
            <div className="space-y-6">
              <motion.div 
                className="bg-navy-light/30 p-6 rounded-lg border border-gold/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3 className="title-subtitle text-gold mb-2">When should I host a Remembrance Supper?</h3>
                <p className="body">
                  The Remembrance Supper is traditionally held annually on April 6th after sundown. 
                  This date commemorates the original Last Supper that Jesus shared with his disciples. 
                  In 2025, we're organizing a special global event on April 6th, but you can host a 
                  Remembrance Supper any time that works for your community.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-navy-light/30 p-6 rounded-lg border border-gold/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="title-subtitle text-gold mb-2">What do I need to prepare?</h3>
                <p className="body">
                  The Remembrance Supper is intentionally simple. You'll need bread and a drink (traditionally 
                  unleavened bread and wine, but any bread and drink will do). The meaning behind the symbols 
                  is more important than the specific items. Visit our <Link to="/hosting-guide" className="text-gold hover:underline">Hosting Guide</Link> for 
                  detailed preparation instructions.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-navy-light/30 p-6 rounded-lg border border-gold/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="title-subtitle text-gold mb-2">How can I participate in the April 6, 2025 global event?</h3>
                <p className="body">
                  You can participate by hosting your own Remembrance Supper or joining one in your community. 
                  The global event will begin at sundown in Jerusalem (7:07 PM local time) and continue as the 
                  sun sets around the world. Visit our <Link to="/april-6-event" className="text-gold hover:underline">April 6 Event</Link> page for more details.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-navy-light/30 p-6 rounded-lg border border-gold/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="title-subtitle text-gold mb-2">Where can I find resources for hosting?</h3>
                <p className="body">
                  Our <Link to="/hosting-guide" className="text-gold hover:underline">Hosting Guide</Link> page offers detailed instructions for hosting a Remembrance Supper. 
                  If you need custom resources for a larger gathering, please contact us using the form above.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-navy-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-navy/50 p-8 rounded-lg border border-gold/20 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="title-subtitle mb-4">Join the Global Event</h2>
            <p className="body-lg max-w-3xl mx-auto mb-8">
              Be part of the global Remembrance Supper movement. Together, we can revive this 
              meaningful practice and strengthen our spiritual connections.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link 
                to="/hosting-guide" 
                className="px-6 py-3 bg-navy border border-gold text-gold hover:bg-gold hover:text-navy transition-colors duration-300 rounded-full"
              >
                Hosting Guide
              </Link>
              <Link 
                to="/april-6-event" 
                className="px-6 py-3 bg-gold text-navy hover:bg-gold/80 transition-colors duration-300 rounded-full"
              >
                April 6 Global Event
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 