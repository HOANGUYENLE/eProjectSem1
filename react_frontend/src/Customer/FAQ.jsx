import FAQSection from "./FAQSection";

import { useEffect, useState } from "react";
import { fetchFAQ, fetchPostFAQ} from "../apiComponent/apiService";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../context/UserContext";

export default function HomepageFAQ(){
  useEffect(()=>{window.scrollTo(0, 0)},[]);
  const {user, navigate} = useContext(AuthContext);
  const [formFAQ, setFormFAQ] = useState({ "question": "" });
  const queryClient = useQueryClient();
  const queriesResults = useQueries({
      queries:[
      { 
        queryKey: ["FAQ"],
        queryFn: fetchFAQ,
        refetchInterval: 1000 * 60,
      }]
    });
  const FAQResults = queriesResults[0];
  useEffect(()=>{
    if(FAQResults?.data){
    }
  },[FAQResults.data]);
  
  const handleSubmit = async () => {
    let response = await fetchPostFAQ(formFAQ);
    if (response){
      alert("Your post an FAQ sucessfully, please wait for respond from admin side")
      setFormFAQ({ "question": "" });
      queryClient.invalidateQueries(["FAQ"]);
    }
  }

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
        {FAQResults.isLoading? 
          <div className="spinner-border"></div> :
          <>
            <FAQSection title="Customer FAQ" faqs={FAQResults.data.filter((each, index)=>{ return each.type === "customer" && each.resolved_status === 1})} parentId="faqAccordion" sectionId="customerFaq" />
            <FAQSection title="Lawyer FAQ" faqs={FAQResults.data.filter((each, index)=>{ return each.type === "lawyer" && each.resolved_status === 1})} parentId="faqAccordion" sectionId="lawyerFaq" />
            <FAQSection title="System FAQ" faqs={FAQResults.data.filter((each, index)=>{ return each.type === "system" && each.resolved_status === 1})} parentId="faqAccordion" sectionId="systemFaq" />
          </> 
        }
        {user.token&&
        <div className="m-5 d-flex justify-content-center">
          <button type="button" className="btn btn-warning fs-1" data-bs-toggle="modal" data-bs-target="#askModal">
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
                  <textarea className="form-control" rows="5" placeholder="Type your question here..." value={formFAQ.question} onChange={(e)=>{setFormFAQ({...formFAQ, question: e.target.value})}}></textarea>
                </div>
                <div className="modal-footer d-flex justify-content-center gap-5">
                  <button type="button" className="btn btn-secondary fs-2" data-bs-dismiss="modal">Cancel</button>
                  <button type="button" className="btn btn-primary fs-2" data-bs-dismiss="modal" onClick={handleSubmit}>Submit</button>
                </div>
              </div>
            </div>
        </div>
        </div>
        }
        
      </div>
      
    </div>
  );
}