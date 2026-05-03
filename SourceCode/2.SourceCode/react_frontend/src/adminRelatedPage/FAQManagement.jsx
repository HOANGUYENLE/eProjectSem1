import "../css/faqTable.css"
import "../css/searchBar.css"

export default function FAQManagement(){
    const faqs = [
    {
      id: 1,
      author_name: "Alice Nguyen",
      question: "What information should I prepare before meeting a lawyer?",
      answer: "",
      type: "customer",
      resolved_status: 0,
      created_at: "2026-05-01 09:30:00"
    },
    {
      id: 2,
      author_name: "Bob Tran",
      question: "How do I know if my case needs a lawyer?",
      answer: "You should consult if your case involves contracts or disputes.",
      type: "lawyer",
      resolved_status: 1,
      created_at: "2026-05-01 08:45:00"
    }
  ];

  return (
    <div className="faq-dashboard">
      
      <div className="faq-detail">
        <div className="faq-detail-header">
          <h3>FAQ Detail</h3>
          <button className="close-btn">×</button>
        </div>
        <form>
            <p><strong>Author:</strong> Alice Nguyen</p>
            
            <p><strong class="form-label">Question:</strong>
            <textarea className="form-control" id="FaqQuestion" rows={2} value={faqs[0].question}/></p>
            <p><strong>Type:</strong> <select class="form-select mt-1" aria-label="Default select example">
                <option selected>Choose FAQ type: </option>
                <option value="system">System type</option>
                <option value="customer">For Customer type</option>
                <option value="lawyer">For Lawyer type</option></select></p>
            <p><strong>Resolved Status: <input className="form-check-input" type="checkbox" value={()=>"1"} id="flexCheckDefault" /></strong></p>
            <textarea placeholder="Your Answer" rows={4}></textarea>
            <div className="faq-actions">
                <button type="submit">Submit</button>
                <button>Cancel</button>
            </div>
        </form>
      </div>


      <div className="faq-table">
        <h3>All FAQs</h3>
        <div className="SearchBar">
          <div className="SearchBar d-flex align-items-center gap-3">
              <div className="input-group" style={{ maxWidth: "250px" }}>
                  <select className="form-select" id="dropdownCity" name="dropdownCity">
                      <option defaultValue>Choose type Appointment</option>
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
                  <ul className="dropdown-menu p-3 mt-1">
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
                      <li>
                          <div className="form-check">
                          <input className="form-check-input" type="radio" name="sortOption" id="sortExpAsc" />
                          <label className="form-check-label" htmlFor="sortExpAsc">Sort by Name Customers </label>
                          </div>
                      </li>
                      <li>
                          <div className="form-check">
                          <input className="form-check-input" type="radio" name="sortOption" id="sortExpDesc" />
                          <label className="form-check-label" htmlFor="sortExpDesc">Sort by Name Lawyers</label>
                          </div>
                      </li>
                  </ul>
              </div>
            </div>
      </div>
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
          <tbody>
            {faqs.map(faq => (
              <tr key={faq.id}>
                <td>{faq.id}</td>
                <td>{faq.question}</td>
                <td>{faq.resolved_status?"Completed":"Pending"}</td>
                <td>{faq.created_at}</td>
                <td>
                  <div className="arrangeBtn">
                    <button className="view-btn">View</button>
                  <button className="delete-btn">Delete</button>
                  </div>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-center"><button className="ask-btn">Have Question? Ask anyway</button></div>
      </div>
    </div>
  );
}