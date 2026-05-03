import FAQSection from "./FAQSection";
export default function HomepageFAQ(){
  const lawyerFaqs = [
    { id: 1, question: "How do I prepare documents for a lawyer?", answer: "Gather contracts, IDs, and relevant case files." },
    { id: 2, question: "What should I ask during consultation?", answer: "Ask about fees, experience, and case strategy." }
  ];

  const customerFaqs = [
    { id: 1, question: "How do I book an appointment?", answer: "Use the booking form or call our hotline." },
    { id: 2, question: "Can I reschedule?", answer: "Yes, rescheduling is allowed up to 24 hours before." }
  ];

  const systemFaqs = [
    { id: 1, question: "How do I reset my password?", answer: "Click 'Forgot password' on login screen." },
    { id: 2, question: "Where can I find system updates?", answer: "Updates are posted in the announcements section." }
  ];

  return (
    <div className="container my-4">
      <h2 className="mb-4">FAQ Dashboard</h2>
      <div className="accordion" id="faqAccordion">
        <FAQSection title="Lawyer FAQ" faqs={lawyerFaqs} parentId="faqAccordion" sectionId="lawyerFaq" />
        <FAQSection title="Customer FAQ" faqs={customerFaqs} parentId="faqAccordion" sectionId="customerFaq" />
        <FAQSection title="System FAQ" faqs={systemFaqs} parentId="faqAccordion" sectionId="systemFaq" />
      </div>
    </div>
  );
}