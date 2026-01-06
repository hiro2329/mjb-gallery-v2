import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              MJB Photo
            </Link>
          </div>

          {/* 메뉴 */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-black font-medium">
              Home
            </Link>
            <Link
              to="/jeju"
              className="text-gray-600 hover:text-black font-medium"
            >
              Jeju
            </Link>
            <Link
              to="/sapporo"
              className="text-gray-600 hover:text-black font-medium"
            >
              Sapporo
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
