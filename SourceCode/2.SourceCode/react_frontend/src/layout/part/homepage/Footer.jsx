
export default function Footer(){
    return (
        <section className="footer p-4 bg-dark text-white mt-4">
        <div className="row">
          <div className="col-md-4">
            <h5>LegalEase</h5>
            <p>Your trusted platform to find the best lawyers.</p>
          </div>
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <p>Email: 5t4mI@example.com</p> {/* Updated email */}
            <p>Phone: +1 (555) 123-4567</p>
          </div>
          <div className="col-md-4">
            <h5>Follow Us</h5>
            <div className="social-icons">
              <a href="#"><i className='bx bxl-facebook'></i></a>
              <a href="#"><i className='bx bxl-twitter'></i></a>
              <a href="#"><i className='bx bxl-linkedin'></i></a>
              <a href="#"><i className='bx bxl-instagram'></i></a>
            </div>
          </div>
        </div>
        <div className="text-center mt-3">
          &copy; {new Date().getFullYear()} LegalEase. All rights reserved.
        </div>
      </section>
    )
}