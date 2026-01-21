// src/components/ImageDetailModal.tsx
import { useEffect } from "react";

interface PhotoData {
  id: number | string;
  url: string;
  title: string;
  location: string;
  category: string;
}

interface ImageDetailModalProps {
  photo: PhotoData | null;
  onClose: () => void;
}

export default function ImageDetailModal({
  photo,
  onClose,
}: ImageDetailModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      {/* 모달 컨테이너 (relative 필수 - 닫기 버튼 위치 기준점) */}
      <div
        className="relative flex flex-col md:flex-row w-full max-w-5xl h-[85vh] md:h-[600px] overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼: 모달 전체 기준 우측 상단 고정 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* [A] 왼쪽: 이미지 영역 */}
        <div className="relative w-full h-[70%] md:w-3/5 md:h-full flex items-center justify-center bg-black">
          <img
            src={photo.url}
            alt={photo.title || "Photo"}
            className="w-full h-full object-contain"
          />
        </div>

        {/* [B] 오른쪽: 정보 영역 */}
        <div className="w-full h-[30%] md:w-2/5 md:h-full flex flex-col p-4 md:p-6 bg-white relative">
          {/* 헤더: 제목 (닫기 버튼 제거됨) */}
          <div className="mb-2 md:mb-4 flex items-start justify-between shrink-0">
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 line-clamp-1 md:line-clamp-2 pr-8">
              {/* pr-8: 제목이 길어도 닫기 버튼과 겹치지 않게 여백 줌 */}
              {photo.title || "제목 없음"}
            </h2>
          </div>

          {/* 본문 정보 */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <p className="mb-2 md:mb-4 text-sm font-medium text-gray-500 flex items-center">
              <svg
                className="w-4 h-4 mr-1 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="truncate">
                {photo.location || "장소 정보 없음"}
              </span>
            </p>

            <div>
              <span className="inline-block rounded-full bg-blue-50 px-2 py-1 md:px-3 md:py-1 text-xs font-bold text-blue-600 tracking-wide">
                {photo.category || "CATEGORY"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
