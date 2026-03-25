import { FaFacebookF, FaGooglePlusG, FaInstagram, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigation = useNavigate();
  return (
    <footer className="bg-gray-100 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Logo + About */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="Peak Global Partners" className="h-10 w-auto" />
            <span className="text-lg font-semibold text-[#0d1f35] leading-tight">
              Peak Global<br />Partners
            </span>
          </div>

          <p className="text-sm mb-6 text-gray-600">
            Building systems that last
          </p>

          <div className="flex gap-3">
            <div className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-gray-200 cursor-pointer">
              <FaFacebookF />
            </div>
            <div className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-gray-200 cursor-pointer">
              <FaGooglePlusG />
            </div>
            <div className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-gray-200 cursor-pointer">
              <FaInstagram />
            </div>
            <div className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-gray-200 cursor-pointer">
              <FaYoutube />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li onClick={()=>navigation('/')} className="hover:text-black cursor-pointer">Home</li>
            <li className="hover:text-black cursor-pointer">Our Solutions</li>
            <li className="hover:text-black cursor-pointer">Capabilities</li>
            <li className="hover:text-black cursor-pointer">Partnership Model</li>
            <li onClick={()=>navigation('/contact')} className="hover:text-black cursor-pointer">Contact Us</li>
          </ul>
        </div>

        {/* Sectors */}
        <div>
          <h3 className="font-semibold text-lg mb-4">The Sectors</h3>
          <ul className="space-y-3 text-sm">
            <li className="hover:text-black cursor-pointer">Energy & Water</li>
            <li className="hover:text-black cursor-pointer">Infrastructure & Waste</li>
            <li className="hover:text-black cursor-pointer">Healthcare & Real Estate</li>
            <li className="hover:text-black cursor-pointer">Technology & Digital</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Contact Us</h3>

          <div className="space-y-4 text-sm">

            <div className="flex gap-3">
              <FaMapMarkerAlt className="mt-1 text-gray-500" />
              <p>
                724 W. Lancaster Ave Suite 210
                <br />
                Wayne, PA 19087
              </p>
            </div>

            <div className="flex gap-3 items-center">
              <FaEnvelope className="text-gray-500" />
              <p>info@peakgobalpartner.com</p>
            </div>

            <div className="flex gap-3 items-center">
              <FaPhone className="text-gray-500" />
              <p>610-602-4200</p>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom section */}
      <div className=" py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-col items-center justify-between text-sm text-[#7B7E86]">

          <div className="flex gap-6 mb-3 md:mb-0">
            <span className="hover:text-black cursor-pointer">Privacy Policy</span>
            <span className="hover:text-black cursor-pointer">Terms of Use</span>
            <span className="hover:text-black cursor-pointer">Legal</span>
            <span className="hover:text-black cursor-pointer">Site Map</span>
          </div>

          <p>© 2026 Peak Global Partners. All Rights Reserved.</p>

        </div>
      </div>
    </footer>
  );
}