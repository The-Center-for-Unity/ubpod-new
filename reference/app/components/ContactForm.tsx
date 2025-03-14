'use client';

import { useState, useEffect } from 'react';

export default function ContactForm() {
  const [showForm, setShowForm] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [question, setQuestion] = useState({ num1: 0, num2: 0 });

  useEffect(() => {
    setQuestion({
      num1: Math.floor(Math.random() * 10) + 1,
      num2: Math.floor(Math.random() * 10) + 1
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(answer) === question.num1 + question.num2) {
      setShowForm(true);
      setError('');
    } else {
      setError('Incorrect answer. Please try again.');
    }
  };

  if (showForm) {
    return (
      <div>
        <h3 className="text-xl font-fira-sans font-bold mb-2">Contact us</h3>
        <p>Please email us at: contact@thecenterforunity.org</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-fira-sans font-bold mb-2">Contact us</h3>
      <p className="mb-2">To access support, please answer this question:</p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <label>
          What is {question.num1} + {question.num2}?
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="ml-2 p-1 border rounded"
          />
        </label>
        <button type="submit" className="block bg-primary text-white px-4 py-2 rounded">
          Submit
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}