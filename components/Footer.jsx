import Font from "../styles/Font.module.css";

const Footer = () => {
  return (
    <footer className="bg-cool-gray-50" id="footer">
      <div id="footer_content" className="max-w-5xl mx-auto px-4 py-4">
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <h2 className="font-semibold text-cool-gray-700 text-lg mb-1">
              # Features
            </h2>
            <ul className="text-cool-gray-600">
              <li className="mb-1">Realtime</li>
              <li className="mb-1">Premium & free account</li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-cool-gray-700 text-lg mb-1">
              # FAQ
            </h2>
            <ul className="text-cool-gray-600">
              <li className="mb-1">Is it safe ?</li>
              <li className="mb-1">Can i use it for free ?</li>
              <li className="mb-1">Should i trust to this website ?</li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-cool-gray-700 text-lg mb-1">
              # Contact & Support
            </h2>
            <ul className="text-cool-gray-600">
              <li className="mb-1">sysafarila.official@gmail.com</li>
              <li className="mb-1">0821-1*69-4*3*</li>
              <li className="mb-1">Social media : @sysafarila</li>
            </ul>
          </div>
        </div>
        <div className="max-w-5xl md:mt-10 mt-3">
          <div className={`text-cool-gray-600 text-center ${Font.caveat}`}>
            &copy; 2021 |{" "}
            <a
              href="http://sysafarila.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-light-blue-500 hover:underline"
            >
              Syahrul Safarila
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
