import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Upload } from 'lucide-react';
import { emailService } from '../utils/emailService';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useTranslation } from 'react-i18next';
import { LocalizedLink } from '../components/shared/LocalizedLink';

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

export default function ContactPage() {
  const { t } = useTranslation('contact');
  
  // Form ref
  const form = useRef<HTMLFormElement>(null);

  // Form fields with translations
  const formFields: FormField[] = [
    {
      id: 'name',
      label: t('form.fields.name.label'),
      type: 'text',
      placeholder: t('form.fields.name.placeholder'),
      required: true
    },
    {
      id: 'email',
      label: t('form.fields.email.label'),
      type: 'email',
      placeholder: t('form.fields.email.placeholder'),
      required: true
    },
    {
      id: 'inquiryType',
      label: t('form.fields.inquiryType.label'),
      type: 'select',
      placeholder: t('form.fields.inquiryType.placeholder'),
      required: true,
      options: [
        t('form.fields.inquiryType.options.general'),
        t('form.fields.inquiryType.options.technical'),
        t('form.fields.inquiryType.options.content'),
        t('form.fields.inquiryType.options.narration'),
        t('form.fields.inquiryType.options.studyGroup'),
        t('form.fields.inquiryType.options.accessibility'),
        t('form.fields.inquiryType.options.translation'),
        t('form.fields.inquiryType.options.spiritual'),
        t('form.fields.inquiryType.options.resource'),
        t('form.fields.inquiryType.options.experience')
      ]
    },
    {
      id: 'message',
      label: t('form.fields.message.label'),
      type: 'textarea',
      placeholder: t('form.fields.message.placeholder'),
      required: true
    },
    {
      id: 'photos',
      label: t('form.fields.photos.label'),
      type: 'file',
      placeholder: t('form.fields.photos.placeholder'),
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
        message: t('form.validation.photoSize')
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
          message: t('form.validation.required')
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
          message: t('form.validation.photoLimit')
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log('Form validation passed, submitting form');
      
      // Submit form data
      const response = await emailService.sendEmail({
        name: formState.name,
        email: formState.email,
        inquiryType: formState.inquiryType,
        message: formState.message,
        photos: photoBase64
      });
      
      console.log('Email service response:', response);
      
      if (response.success) {
        console.log('Form submission successful');
        
        // Reset form
        setFormState({
          name: '',
          email: '',
          inquiryType: '',
          message: '',
          photos: null
        });
        setPhotoBase64([]);
        setPhotoNames([]);
        
        // Show success message
        setSubmitStatus({
          success: true,
          message: t('form.success')
        });
      } else {
        console.error('Form submission failed:', response.error);
        
        // Show error message
        setSubmitStatus({
          success: false,
          message: response.error || t('form.error')
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Show error message
      setSubmitStatus({
        success: false,
        message: error instanceof Error ? error.message : t('form.error'),
        error: error instanceof Error ? error.message : t('form.error')
      });
    } finally {
      setIsSubmitting(false);
      console.log('==== Form Submission Complete ====');
    }
  };

  return (
    <Layout>
      <main className="flex flex-col bg-navy-darker text-white">
        {/* Hero Section */}
        <section 
          className="relative min-h-[40vh] bg-navy-darker"
          style={{
            backgroundImage: 'url("/images/urantia/paper-background.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-navy-darker/90" />

          {/* Content */}
          <div className="relative pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                className="max-w-3xl mx-auto text-center space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="title-main">{t('hero.title')}</h1>
                <p className="section-subtitle">
                  {t('hero.subtitle')}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 bg-navy-darker scroll-mt-20" id="get-in-touch">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="space-y-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-center max-w-3xl mx-auto pt-4 sm:pt-0">
                <h2 className="section-title mb-4">{t('form.title')}</h2>
                <p className="body-lg">
                  {t('form.description')}
                </p>
              </div>
              
              <div className="bg-navy-dark/50 p-8 rounded-lg border border-primary/20">
                {/* Environment notice */}
                {import.meta.env.DEV && (
                  <div className="mb-6 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <p className="text-sm text-blue-200">
                      <span className="font-semibold">{t('form.devNotice').split(':')[0]}:</span> {t('form.devNotice').split(':')[1]}
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
                      <label htmlFor={field.id} className="block text-primary font-medium">
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
                          className="w-full px-4 py-3 !bg-[#060c1f] border border-primary/30 rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white"
                          rows={5}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          id={field.id}
                          name={field.id}
                          required={field.required}
                          value={formState[field.id as keyof typeof formState] as string}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 !bg-[#060c1f] border border-primary/30 rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white"
                        >
                          <option value="" className="!bg-[#060c1f]">{field.placeholder}</option>
                          {field.options?.map(option => (
                            <option key={option} value={option} className="!bg-[#060c1f] text-white">{option}</option>
                          ))}
                        </select>
                      ) : field.type === 'file' ? (
                        <div className="flex flex-col space-y-4 w-full">
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor={field.id}
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-primary/30 border-dashed rounded-lg cursor-pointer !bg-[#060c1f] hover:bg-navy-light/20 transition-colors"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-primary/70" />
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
                              <h4 className="text-primary text-sm mb-2">Uploaded Photos ({photoNames.length}/3)</h4>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {photoBase64.map((photo, index) => (
                                  <div key={index} className="relative group">
                                    <div className="aspect-w-1 aspect-h-1 bg-navy-dark/50 rounded-lg overflow-hidden">
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
                            <p>{t('form.fields.photos.note')}</p>
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
                          className="w-full px-4 py-3 !bg-[#060c1f] border border-primary/30 rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white"
                        />
                      )}
                    </div>
                  ))}
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-colors ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('form.submit.sending')}
                        </div>
                      ) : (
                        t('form.submit.send')
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-navy-darker">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="space-y-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="section-title mb-4">{t('faq.title')}</h2>
                <p className="body-lg">
                  {t('faq.subtitle')}
                </p>
              </div>
              
              <div className="space-y-6">
                <motion.div 
                  className="bg-navy-light/30 p-6 rounded-lg border border-primary/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h3 className="title-subtitle text-primary mb-2">{t('faq.questions.what.question')}</h3>
                  <p className="body">
                    {t('faq.questions.what.answer')}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-navy-light/30 p-6 rounded-lg border border-primary/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="title-subtitle text-primary mb-2">{t('faq.questions.how.question')}</h3>
                  <p className="body">
                    {t('faq.questions.how.answer')}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-navy-light/30 p-6 rounded-lg border border-primary/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="title-subtitle text-primary mb-2">{t('faq.questions.download.question')}</h3>
                  <p className="body">
                    {t('faq.questions.download.answer')}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-navy-light/30 p-6 rounded-lg border border-primary/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="title-subtitle text-primary mb-2">{t('faq.questions.suggestions.question')}</h3>
                  <p className="body">
                    {t('faq.questions.suggestions.answer')}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-navy-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="bg-navy-darker/70 p-8 rounded-lg border border-primary/20 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="title-subtitle mb-4">{t('cta.title')}</h2>
              <p className="body-lg max-w-3xl mx-auto mb-8">
                {t('cta.description')}
              </p>
              <div className="flex justify-center pt-4">
                <LocalizedLink 
                  to="/urantia-papers" 
                  className="px-6 py-3 bg-primary text-white hover:bg-primary-light transition-colors duration-300 rounded-full"
                >
                  {t('cta.button')}
                </LocalizedLink>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </Layout>
  );
} 