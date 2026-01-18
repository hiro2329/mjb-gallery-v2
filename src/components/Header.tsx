import { useState } from "react"; // [추가] 상태 관리용
import { Link } from "react-router-dom";
import { CATEGORIES } from "../constants";

export default function Header() {
  // 모바일 메뉴가 열렸는지 닫혔는지 체크하는 상태
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 메뉴 토글 함수
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 링크 클릭 시 메뉴 닫기 (모바일에서 이동 후 메뉴가 계속 열려있으면 불편하니까)
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 1. 로고 */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              onClick={closeMenu}
              className="text-2xl font-bold text-gray-900"
            >
              MJB Photo
            </Link>
          </div>

          {/* 2. 데스크탑 메뉴 (화면 크면 보임, 작으면 숨김) */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-black font-medium">
              Home
            </Link>
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to={`/gallery/${category.toLowerCase()}`}
                className="text-gray-600 hover:text-black font-medium"
              >
                {category.charAt(0).toUpperCase() +
                  category.slice(1).toLowerCase()}
              </Link>
            ))}
          </nav>

          {/* 3. 모바일 햄버거 버튼 (화면 작으면 보임, 크면 숨김) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
            >
              {/* 아이콘: 메뉴가 열려있으면 X, 닫혀있으면 햄버거(☰) */}
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4. 모바일 드롭다운 메뉴 (isMenuOpen이 true일 때만 보임) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={closeMenu} // 클릭하면 메뉴 닫힘
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Home
            </Link>

            {/* 카테고리 자동 생성 */}
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to={`/gallery/${category.toLowerCase()}`}
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {category.charAt(0).toUpperCase() +
                  category.slice(1).toLowerCase()}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
