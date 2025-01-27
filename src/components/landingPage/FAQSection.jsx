import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import faqImage from '../../assets/landingPageAssets/Images/faqImage.png';

const FAQSection = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'What are the costs involved in listing on Xcellify?',
      answer:
        'Registration and listing your services on Xcellify is free of cost.',
    },
    {
      question: 'What kind of products or services can I list?',
      answer:
        'You can list a wide range of student-focused products and services, including educational tools, resources, lifestyle merchandise, wellness programs, and more.',
    },
    {
      question: 'How does Xcellify help me promote my products?',
      answer:
        'We offer marketing support through platform promotions, social media posts, and email campaigns targeting our student audience.',
    },
    {
      question:
        'Is there a limit on the number of products or services I can list?',
      answer: 'There’s no limit on the number of listings.',
    },
    {
      question: 'How do I manage my orders and track performance?',
      answer:
        'Our vendor dashboard allows you to track orders, manage listings, and view performance metrics seamlessly.',
    },
  ];

  return (
    <section id="faqs" className="bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold font-dmsans text-blue-primary mb-12 text-center">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* FAQ Image */}
          <div className="lg:w-1/2 flex justify-center">
            <img
              src={faqImage}
              alt="FAQ Illustration"
              className="w-full max-w-sm lg:max-w-md h-auto"
            />
          </div>

          {/* Accordion */}
          <div className="lg:w-1/2 space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg shadow-md p-4"
              >
                <button
                  className="w-full flex justify-between items-center text-left text-lg font-semibold text-blue-primary focus:outline-none"
                  onClick={() => toggleAccordion(index)}
                >
                  {faq.question}
                  <span>
                    {activeIndex === index ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                      >
                        <path d="M6 15l6-6 6 6" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    )}
                  </span>
                </button>
                {activeIndex === index && (
                  <p className="mt-4 text-gray-700 text-sm">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 text-lg mb-6">
            Ready to grow your business? Sign up today and let’s make student
            life easier together!
          </p>
          <button
            style={{
              background: 'linear-gradient(to right, #876FFD, #6C59CA)',
            }}
            className="text-[#F3F1FF] px-8 py-4 rounded-lg font-semibold text-lg font-dmsans hover:bg-[#957EE0] transition-all duration-300"
            onClick={() => navigate('/login')}
          >
            Earn with Xcellify Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
