import React from 'react';
import Link from 'next/link';

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">IMPORTANT DISCLAIMER</h1>
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">PLEASE READ BEFORE LISTENING</h2>
      
      <div className="prose prose-lg max-w-none">
        <p className="mb-4">
          UrantiaBookPod.com provides AI-generated audio podcast episodes based on the papers contained in The Urantia Book. 
          Each episode corresponds to a specific paper from the original text.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">Copyright and Attribution</h2>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">The original text of The Urantia Book is the copyrighted property of Urantia Foundation.</li>
          <li className="mb-2">The audio content provided on this site is derived from the text using AI technology and is intended for educational and accessibility purposes.</li>
          <li className="mb-2">This service is not affiliated with, endorsed by, or officially connected to Urantia Foundation or any official Urantia Book publishing organization.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-4">Important Notice About AI-Generated Content</h2>
        <p className="mb-4"><strong>PLEASE BE AWARE</strong>: This content is generated using the NotebookLM AI technology (based on Google's Gemini LLM) which has inherent limitations.</p>
        <p className="mb-4">The AI can and does make errors of both omission and commission - meaning it may:</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Leave out important details or contextual information</li>
          <li className="mb-2">Misinterpret philosophical concepts</li>
          <li className="mb-2">Oversimplify complex spiritual narratives</li>
          <li className="mb-2">Occasionally generate inaccurate statements</li>
        </ul>
        <p className="mb-4">These podcast episodes should be viewed as an <strong>imperfect introduction</strong> only and NOT as an authoritative representation of The Urantia Book's teachings.</p>
        <p className="mb-4">For serious study, users MUST refer to the official published version of The Urantia Book.</p>
        <p className="mb-4">The episodes are provided despite their imperfections because we believe they offer value as a supplementary resource.</p>

        <h2 className="text-xl font-bold mt-8 mb-4">Fair Use Statement</h2>
        <p className="mb-4">
          The content on UrantiaBookPod.com is provided under the principles of fair use for purposes of commentary, criticism, 
          research, teaching, and improving accessibility to the ideas contained in The Urantia Book.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">Technical Limitations of AI Technology</h2>
        <p className="mb-4">The audio content has been created using AI technology that has significant limitations when handling complex spiritual and philosophical concepts.</p>
        <p className="mb-4">Feedback from long-time students of The Urantia Book has identified that these AI-generated episodes:</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Can miss important nuances and meanings</li>
          <li className="mb-2">May not adequately convey the depth of spiritual concepts</li>
          <li className="mb-2">Sometimes present simplified versions of complex narratives</li>
          <li className="mb-2">Are particularly challenged when addressing profound topics like The Lucifer Rebellion</li>
        </ul>
        <p className="mb-4">These limitations are inherent to current AI systems, including the Gemini LLMs used to generate this content.</p>
        <p className="mb-4">We acknowledge these shortcomings while still providing these episodes as an optional resource.</p>

        <h2 className="text-xl font-bold mt-8 mb-4">User Responsibility and Acknowledgment</h2>
        <p className="mb-4">By accessing this content, users explicitly acknowledge they understand these podcast episodes contain errors, omissions, and simplifications.</p>
        <p className="mb-4">Users accept full responsibility for verifying ALL information against the original text of The Urantia Book.</p>
        <p className="mb-4">These AI-generated interpretations should NEVER be:</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Used as the sole source for understanding Urantia Book concepts</li>
          <li className="mb-2">Quoted or referenced as authoritative</li>
          <li className="mb-2">Relied upon for spiritual, philosophical, or religious understanding without verification</li>
        </ul>
        <p className="mb-4">We strongly recommend reading the original text for serious study of these profound teachings.</p>

        <h2 className="text-xl font-bold mt-8 mb-4">Contact Information</h2>
        <p className="mb-4">
          For questions, concerns, or requests regarding this content, please contact us at{' '}
          <a href="mailto:contact@thecenterforunity.org" className="text-primary hover:underline">
            contact@thecenterforunity.org
          </a>.
        </p>

        <p className="text-sm text-gray-600 mt-8 italic">Last updated: March 13, 2025</p>
      </div>
      
      <div className="mt-10 text-center">
        <Link 
          href="/"
          className="inline-block bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary-dark transition duration-300"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
} 