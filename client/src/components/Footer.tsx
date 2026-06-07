export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold font-['Poppins']">
              <span>NEXT</span>
              <span className="text-[#0073b1]">STEP</span>
            </h2>
            <p className="mt-4 text-gray-400">
              Connecting talent with opportunities in the IT industry.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold font-['Poppins']">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#leadership" className="text-gray-400 hover:text-white transition-colors">Leadership</a></li>
              <li><a href="#submit" className="text-gray-400 hover:text-white transition-colors">Submit Resume</a></li>
              <li><a href="#vacancies" className="text-gray-400 hover:text-white transition-colors">Vacancies</a></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold font-['Poppins']">Services</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">IT Recruitment</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Career Counseling</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Skill Assessment</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resume Building</a></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold font-['Poppins']">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-2 text-gray-400"></i>
                <a href="mailto:nextstep.tup@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                  nextstep.tup@gmail.com
                </a>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone mt-1 mr-2 text-gray-400"></i>
                <a href="tel:+911234567890" className="text-gray-400 hover:text-white transition-colors">
                  +91 1234 567 890
                </a>
              </li>
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-2 text-gray-400"></i>
                <span className="text-gray-400">Bangalore, Karnataka, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {new Date().getFullYear()} NEXT STEP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
