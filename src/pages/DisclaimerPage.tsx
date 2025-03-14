import React from 'react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';

export default function DisclaimerPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="title-main text-4xl mb-8 text-center">IMPORTANT DISCLAIMER</h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center text-gold">PLEASE READ BEFORE LISTENING</h2>
        
        <div className="bg-navy-light/30 rounded-lg p-8 border border-white/5 space-y-6">
          <p className="body-lg">
            UrantiaBookPod.com provides AI-generated audio podcast episodes based on the papers contained in The Urantia Book. 
            Each episode corresponds to a specific paper from the original text.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-gold">Copyright and Attribution</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li className="body-lg">The original text of The Urantia Book is the copyrighted property of Urantia Foundation.</li>
            <li className="body-lg">The audio content provided on this site is derived from the text using AI technology and is intended for educational and accessibility purposes.</li>
            <li className="body-lg">This service is not affiliated with, endorsed by, or officially connected to Urantia Foundation or any official Urantia Book publishing organization.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4 text-gold">Important Notice About AI-Generated Content</h2>
          <p className="body-lg"><strong>PLEASE BE AWARE</strong>: This content is generated using AI technology which has inherent limitations.</p>
          <p className="body-lg">The AI can and does make errors of both omission and commission - meaning it may:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li className="body-lg">Leave out important details or contextual information</li>
            <li className="body-lg">Misinterpret philosophical concepts</li>
            <li className="body-lg">Oversimplify complex spiritual narratives</li>
            <li className="body-lg">Occasionally generate inaccurate statements</li>
          </ul>
          <p className="body-lg">These podcast episodes should be viewed as an <strong>imperfect introduction</strong> only and NOT as an authoritative representation of The Urantia Book's teachings.</p>
          <p className="body-lg">For serious study, users MUST refer to the official published version of The Urantia Book.</p>
          <p className="body-lg">The episodes are provided despite their imperfections because we believe they offer value as a supplementary resource.</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-gold">Fair Use Statement</h2>
          <p className="body-lg">
            The content on UrantiaBookPod.com is provided under the principles of fair use for purposes of commentary, criticism, 
            research, teaching, and improving accessibility to the ideas contained in The Urantia Book.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-gold">Technical Limitations of AI Technology</h2>
          <p className="body-lg">The audio content has been created using AI technology that has significant limitations when handling complex spiritual and philosophical concepts.</p>
          <p className="body-lg">Feedback from long-time students of The Urantia Book has identified that these AI-generated episodes:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li className="body-lg">Can miss important nuances and meanings</li>
            <li className="body-lg">May not adequately convey the depth of spiritual concepts</li>
            <li className="body-lg">Sometimes present simplified versions of complex narratives</li>
            <li className="body-lg">Are particularly challenged when addressing profound topics like The Lucifer Rebellion</li>
          </ul>
          <p className="body-lg">These limitations are inherent to current AI systems.</p>
          <p className="body-lg">We acknowledge these shortcomings while still providing these episodes as an optional resource.</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-gold">User Responsibility and Acknowledgment</h2>
          <p className="body-lg">By accessing this content, users explicitly acknowledge they understand these podcast episodes contain errors, omissions, and simplifications.</p>
          <p className="body-lg">Users accept full responsibility for verifying ALL information against the original text of The Urantia Book.</p>
          <p className="body-lg">These AI-generated interpretations should NEVER be:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li className="body-lg">Used as the sole source for understanding Urantia Book concepts</li>
            <li className="body-lg">Quoted or referenced as authoritative</li>
            <li className="body-lg">Relied upon for spiritual, philosophical, or religious understanding without verification</li>
          </ul>
          <p className="body-lg">We strongly recommend reading the original text for serious study of these profound teachings.</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-gold">Contact Information</h2>
          <p className="body-lg">
            For questions, concerns, or requests regarding this content, please contact us at{' '}
            <a href="mailto:contact@thecenterforunity.org" className="text-gold hover:text-gold-light">
              contact@thecenterforunity.org
            </a>.
          </p>

          <p className="text-sm text-white/60 mt-8 italic">Last updated: March 14, 2024</p>
        </div>
        
        <div className="mt-10 text-center">
          <Link 
            to="/"
            className="inline-flex items-center px-8 py-4 bg-gold text-navy-dark rounded-full 
                      hover:bg-gold-light transition-all duration-300 font-bold text-lg shadow-lg shadow-gold/20"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
} 