import "../css/faqTable.css"
import "../css/searchBar.css"
import { useEffect, useState } from "react";
import { AuthContext } from "../context/UserContext";
import { useContext } from "react";
import { fetchFAQ } from "../apiComponent/apiService";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { fetchSubmitFAQ, fetchDestroyFAQ , fetchFAQPaginate} from "../apiComponent/apiService";
import MyPaginate from "../Component/pagination";

export default function FAQManagement(){
    const queryClient = useQueryClient();
    const {formatTime, formatDate} = useContext(AuthContext);
    const [page, setPage] = useState(1);
    const perPage = 6;
    const [showDetail, setShowDetail] = useState(false);

    const [displayFaq, setDisplayFaq] = useState(null);

    const [DropDownType, setDropDownType] = useState("default");
    const [DropDownFilter, setDropDownFilter] = useState("asc");

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
        { queryKey: ["FAQ", page],
          queryFn: ()=>fetchFAQPaginate(page, perPage),
          refetchInterval: 1000 * 60,
          keepPreviousData: true,
        },
      ]
    });
    const FAQResults = queriesResults[0];
    useEffect(() => {
      if (!FAQResults?.data) return;

      let temp = FAQResults.data.data;

      if (DropDownType !== "default") {
        temp = temp.filter(each => each.type === DropDownType);
      }

      temp = [...temp].sort((a, b) =>
        DropDownFilter === "asc"
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at)
      );

      setDisplayFaq(temp);
    }, [DropDownType, DropDownFilter, FAQResults.data]);

    const handleEdit = (faq)=>{
      setShowDetail(true);
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
      setShowDetail(false);
    }

    const handleSubmit = async () =>{
      console.log(formData);
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
      
      {showDetail && 
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
      }
      

      <div className="faq-table">
        <h3 className="fs-1 fw-bolder">All FAQs</h3>
        <div className="SearchBar">
          <div className="SearchBar d-flex align-items-end gap-3">
              <div className="input-group" style={{ maxWidth: "250px" }}>
                  <select className="form-select" id="dropdownFilter" name="dropdownFilter"
                    onChange={e=>setDropDownType(e.target.value)}>
                      <option value="default">Choose type FAQ</option>
                      <option value="system">System</option>
                      <option value="customer">Customer</option>
                      <option value="lawyer">Lawyer</option>
                  </select>
              </div>

              <div className="dropdown">
                  <button
                  className="btn btn-outline-primary dropdown-toggle fs-3 p-3" 
                  type="button"
                  id="filterDropdown"
                  data-bs-toggle="dropdown"> Filter </button>
                  <ul className="dropdown-menu p-3 mt-1 fs-2">
                      <li>
                          <div className="form-check">
                            <input className="form-check-input" type="radio" name="sortOption" id="sortNameAsc" 
                              value="asc" checked={DropDownFilter === "asc"}
                              onChange={e => setDropDownFilter(e.target.value)}/>
                              <label className="form-check-label" htmlFor="sortNameAsc">Sort by Date(ASC)</label>
                          </div>

                          <div className="form-check">
                            <input className="form-check-input" type="radio" name="sortOption" id="sortNameDesc" 
                              checked={DropDownFilter === "desc"}  value="desc"
                              onChange={e => setDropDownFilter(e.target.value)}/>
                            <label className="form-check-label" htmlFor="sortNameDesc">Sort by Date (DESC)</label>
                          </div>
                      </li>
                  </ul>
              </div>
            </div>
      </div>
       {!FAQResults.isLoading? 
        <>
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
          {displayFaq?.map(faq => (
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
        <MyPaginate page={page} setPage={setPage} lastPage={FAQResults.data.last_page}/>
        </>
       : <div className="spinner-border"></div>}
      </div>
    </div>
  );
}