import { Link } from "react-router-dom";
import { CATEGORIES } from "../constants"; // [핵심] 상수 파일 불러오기

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

          {/* 메뉴 영역 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-black font-medium">
              Home
            </Link>

            {/* 카테고리 메뉴 자동 생성 Loop */}
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                // URL은 소문자로 변환 (예: JEJU -> /gallery/jeju)
                to={`/gallery/${category.toLowerCase()}`}
                className="text-gray-600 hover:text-black font-medium"
              >
                {/* 화면에 보이는 글자는 첫 글자만 대문자로 (예: JEJU -> Jeju) */}
                {category.charAt(0).toUpperCase() +
                  category.slice(1).toLowerCase()}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
