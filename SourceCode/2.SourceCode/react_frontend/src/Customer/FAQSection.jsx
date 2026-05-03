export default function FAQSection({ title, faqs, parentId, sectionId }) {
  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id={`${sectionId}-header`}>
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#${sectionId}`}
          aria-expanded="false"
          aria-controls={sectionId}
        >
          {title}
        </button>
      </h2>
      <div
        id={sectionId}
        className="accordion-collapse collapse"
        aria-labelledby={`${sectionId}-header`}
        data-bs-parent={`#${parentId}`}
      >
        <div className="accordion-body">
          <div id="accordion2">
            {faqs.map(faq => (
              <div className="card" key={faq.id}>
                <div className="card-header" id={"heading" + faq.id}>
                  <h5 class="mb-0">
                    <button className="btn btn-link" data-bs-toggle="collapse" data-bs-target={"#collapse"+faq.id} aria-expanded="true" aria-controls={"collapse"+faq.id}>
                      {faq.question}
                    </button>
                  </h5>
                </div>

              <div id={"collapse"+faq.id} className="collapse" aria-labelledby={"heading" + faq.id} data-bs-parent="#accordion2">
                <div className="card-body">
                  {faq.answer}
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
