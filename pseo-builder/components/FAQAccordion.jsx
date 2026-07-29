'use client';

import { useState } from 'react';

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 py-[10px] first:border-t">
      <div 
        className="text-[12px] font-medium text-slate-900 flex justify-between items-center cursor-pointer gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <i className={`ti ti-chevron-down text-slate-300 text-[12px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
      </div>
      {isOpen && (
        <div className="text-[12px] text-slate-500 leading-[1.5] mt-[6px]">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQAccordion({ faqs, isChildPage }) {
  return (
    <section className={isChildPage ? "mb-[14px]" : "px-6 py-5 border-t border-slate-100"}>
      <h2 className={isChildPage ? "text-[13px] font-medium text-slate-900 mb-0" : "text-[15px] font-medium text-slate-900 mb-[14px]"}>
        Frequently asked questions
      </h2>
      <div className="flex flex-col gap-0">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.q} answer={faq.a} />
        ))}
      </div>
    </section>
  );
}
