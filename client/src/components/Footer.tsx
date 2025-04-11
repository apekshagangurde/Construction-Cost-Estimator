import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex items-center">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} BuildCost Estimator. All rights reserved.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-6">
              <Link href="#">
                <span className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer">Help Center</span>
              </Link>
              <Link href="#">
                <span className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer">Privacy</span>
              </Link>
              <Link href="#">
                <span className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer">Terms</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
