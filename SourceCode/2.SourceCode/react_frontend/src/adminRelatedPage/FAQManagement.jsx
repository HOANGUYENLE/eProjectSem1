import "../css/faqTable.css"
import "../css/searchBar.css"
import { useEffect, useState } from "react";
import { AuthContext } from "../context/UserContext";
import { useContext } from "react";
import { fetchFAQ } from "../apiComponent/apiService";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { fetchSubmitFAQ, fetchDestroyFAQ } from "../apiComponent/apiService";

export default function FAQManagement(){
    const queryClient = useQueryClient();
    const {formatTime, formatDate} = useContext(AuthContext);
    const [FAQData, SetFAQData] = useState(null);
    const [formData, setFormData] = useState({
        "question": "",
        "answer": "",
        "type": "",
        "resolved_status": "",
    });
    const [formDataClean, setFormDataClean] = useState({
        "question": "",
        "answer": "",
        "type": "",
        "resolved_status": "",
    });
    const [Author, setAuthor] = useState("");
    const [currentPost, setCurrentPost] = useState(null);

    const queriesResults = useQueries({
      queries:[
        { queryKey: ["FAQ"],
          queryFn: fetchFAQ,
          refetchInterval: 1000 * 60,
        },
      ]
    });
    const FAQResults = queriesResults[0];
    useEffect(()=>{
      if(FAQResults?.data){
        SetFAQData(FAQResults?.data);
      }
    }, [FAQResults.data]);

    const handleEdit = (faq)=>{
      let temp = {
        "question": "",
        "answer": "",
        "type": "",
        "resolved_status": "",
      }
      setAuthor(faq.user_tb.name);
      setCurrentPost(faq.id);
      temp["question"] = faq.question;
      temp["answer"] = faq.answer;
      temp["type"] = faq.type;
      temp["resolved_status"] = faq.resolved_status;
      setFormData(temp);
    }

    const handleClean = ()=>{
      setAuthor("");
      setCurrentPost(null);
      setFormData(formDataClean)
    }

    const handleSubmit = async () =>{
      if(Author !== "" && currentPost !== null){
        let response = await fetchSubmitFAQ(currentPost, formData);
        response &&  queryClient.invalidateQueries(["FAQ"]);
      }
      handleClean();
    }

    const handleDestroy = async(id)=>{
      if(window.confirm(`Do you want to delete this FAQ record ID: ${id}?`)){
        let response = await fetchDestroyFAQ(id);
        response &&  queryClient.invalidateQueries(["FAQ"]);   
      }
      handleClean();
    }
    
  return (
    <div className="faq-dashboard">
      
      <div className="faq-detail">
        <div className="faq-detail-header">
          <h1 className="fs-1 fw-bolder">FAQ Detail</h1>
        </div>
        <form>
            <p className="fs-2"><strong>Author: </strong>{Author}</p>
            
            <p><strong className="form-label">Question:</strong>
            <textarea className="form-control" id="FaqQuestion" rows={2} value={formData.question} readOnly/></p>
            <p><strong>Type:</strong> 
            <select className="form-select mt-1 fs-3" value={formData.type === ""?"default": formData.type} onChange={(e)=>setFormData({...formData, type:e.target.value})}>
                <option value="default">Choose FAQ type: </option>
                <option value="system">System type</option>
                <option value="customer">For Customer type</option>
                <option value="lawyer">For Lawyer type</option></select></p>

            <p className="fs-3"> <strong> Resolved Status: </strong> </p>
            <input className="form-check-input px-2" type="checkbox"
                  checked={formData.resolved_status === 1}
                  onChange={(e) => setFormData({...formData, resolved_status: e.target.checked ? 1 : 0})}
                  id="flexCheckDefault"/>

            <textarea placeholder="Your Answer" value={formData.answer} onChange={(e)=>{
              setFormData({...formData, answer:e.target.value})
            }} rows={4} className="fs-2"></textarea>
            <div className="faq-actions fs-1 d-flex justify-content-center">
                <button type="button" onClick={()=>handleSubmit()}>Submit</button>
                <button type="button" onClick={()=>handleClean()}>Cancel</button>
            </div>
        </form>
      </div>

      <div className="faq-table">
        <h3 className="fs-1 fw-bolder">All FAQs</h3>
        <div className="SearchBar">
          <div className="SearchBar d-flex align-items-center gap-3">
              <div className="input-group" style={{ maxWidth: "250px" }}>
                  <select className="form-select" id="dropdownCity" name="dropdownCity">
                      <option defaultValue>Choose type FAQ</option>
                      <option value="1">Admin</option>
                      <option value="2">Lawyer</option>
                      <option value="3">Customer</option>
                  </select>
              </div>

              <div className="dropdown">
                  <button
                  className="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  id="filterDropdown"
                  data-bs-toggle="dropdown"> Filter </button>
                  <ul className="dropdown-menu p-3 mt-1 fs-2">
                      <li>
                          <div className="form-check">
                          <input className="form-check-input" type="radio" name="sortOption" id="sortNameAsc" />
                          <label className="form-check-label" htmlFor="sortName">Sort by Date(ASC)</label>
                          </div>
                          <div className="form-check">
                          <input className="form-check-input" type="radio" name="sortOption" id="sortNameDesc" />
                          <label className="form-check-label" htmlFor="sortName">Sort by Date (DESC)</label>
                          </div>
                      </li>
                  </ul>
              </div>
            </div>
      </div>
       {!FAQResults.isLoading? 
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Question</th>
              <th>Resolved Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          
        <tbody className="fs-3">
          {FAQData?.map(faq => (
            <tr key={faq.id}>
              <td>{faq.id}</td>
              <td>{faq.question}</td>
              <td>
                {faq.resolved_status === 1 ? (
                  <span className="badge bg-success">Completed</span>
                ) : (
                  <span className="badge bg-warning">Pending</span>
                )}
              </td>
              <td>{formatDate(faq.created_at)}</td>
              <td>
                <div className="arrangeBtn">
                  <button className="view-btn" onClick={()=>{handleEdit(faq)}}>Edit</button>
                  <button className="delete-btn" onClick={()=>handleDestroy(faq.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
       : <div className="spinner-border"></div>}
      </div>
    </div>
  );
}