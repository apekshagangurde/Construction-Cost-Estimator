import { Link, useLocation } from "wouter";
import { Ruler, Building, LayoutDashboard } from "lucide-react";

const Header = () => {
  const [location] = useLocation();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <Ruler className="h-8 w-8 text-primary" />
            <h1 className="ml-2 text-xl font-semibold text-gray-800">BuildCost Estimator</h1>
          </div>
        </Link>
        <div>
          <Link href="/dashboard">
            <button className={`${
              location === "/dashboard" ? "bg-primary text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            } rounded-md px-3 py-1.5 text-sm font-medium mr-3`}>
              <LayoutDashboard className="h-4 w-4 inline mr-1" />
              Dashboard
            </button>
          </Link>
          <Link href="/project-history">
            <button className={`${
              location === "/project-history" ? "bg-primary text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            } rounded-md px-3 py-1.5 text-sm font-medium mr-3`}>
              <Building className="h-4 w-4 inline mr-1" />
              Project History
            </button>
          </Link>
          <Link href="/">
            <button className={`${
              location === "/" ? "bg-primary text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            } rounded-md px-3 py-1.5 text-sm font-medium`}>
              Home
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
