import React from 'react';
import Layout from '../components/layout/Layout';

export default function DisclaimerPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="title-main text-4xl mb-8 text-center">Disclaimer</h1>
        
        <div className="bg-navy-light/30 rounded-lg p-8 border border-white/5 space-y-6">
          <p className="body-lg">
            The UrantiaBookPod is an AI-generated audio podcast that summarizes and discusses the Urantia Book papers. 
            These summaries are not official interpretations of the Urantia Book and should not be considered as such.
          </p>
          
          <p className="body-lg">
            The Urantia Book is published by the Urantia Foundation, which holds the copyright to the English text. 
            The UrantiaBookPod is not affiliated with, endorsed by, or sponsored by the Urantia Foundation.
          </p>
          
          <p className="body-lg">
            The audio content provided on this platform is generated using artificial intelligence technology. 
            While we strive for accuracy, AI-generated content may contain errors, misinterpretations, or omissions. 
            We encourage listeners to refer to the original Urantia Book text for the most accurate information.
          </p>
          
          <p className="body-lg">
            The UrantiaBookPod is provided "as is" without any warranties, expressed or implied. 
            We do not guarantee the accuracy, completeness, or usefulness of any information presented. 
            Users are encouraged to exercise their own judgment when interpreting the content.
          </p>
          
          <p className="body-lg">
            The UrantiaBookPod is a project of The Center for Unity, a non-profit organization dedicated to 
            supporting spiritual seekers through technology, human connection, and timeless wisdom.
          </p>
        </div>
      </div>
    </Layout>
  );
} 