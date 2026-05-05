import FAQSection from "./FAQSection";
import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
export default function HomepageFAQ(){
  const {user, navigate} = useContext(AuthContext);
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
    <div className="container my-4 mt-5">
      <h2 className="mb-4 h1 text-center">FAQ Dashboard</h2>
      <div className="accordion min-vh-100" id="faqAccordion">
        <FAQSection title="Lawyer FAQ" faqs={lawyerFaqs} parentId="faqAccordion" sectionId="lawyerFaq" />
        <FAQSection title="Customer FAQ" faqs={customerFaqs} parentId="faqAccordion" sectionId="customerFaq" />
        <FAQSection title="System FAQ" faqs={systemFaqs} parentId="faqAccordion" sectionId="systemFaq" />
        <div className="m-5 d-flex justify-content-center">
          <button type="button" className="btn btn-primary fs-1" data-bs-toggle="modal" data-bs-target="#askModal">
        Have a question? Ask anyway
      </button>
      <div className="modal fade" id="askModal" tabIndex="-1" aria-labelledby="askModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title text-center" id="askModalLabel">Ask your Question</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <textarea className="form-control" rows="5" placeholder="Type your question here..."></textarea>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" className="btn btn-primary">Submit</button>
      </div>
    </div>
  </div>
</div>
        </div>
      </div>
      
    </div>
  );
}