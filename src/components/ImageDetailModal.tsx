import React from "react";

// 사진 데이터 타입 정의 (Supabase 테이블 구조에 맞게 수정 가능)
interface PhotoData {
  id: number | string;
  url: string;
  title?: string;
  location?: string;
  category?: string;
}

// 부모에게 받을 Props 타입 정의
interface ImageDetailModalProps {
  photo: PhotoData | null;
  onClose: () => void;
}

export default function ImageDetailModal({
  photo,
  onClose,
}: ImageDetailModalProps) {
  // 데이터가 없으면 렌더링 안 함
  if (!photo) return null;

  return (
    // 1. 배경 (Backdrop): 전체 화면 덮기 + 반투명 검정 + Flex 중앙 정렬
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      {/* 2. 모달 컨텐츠 (Content): 흰색 박스 + Flex 가로 배치 */}
      <div
        className="flex h-[600px] w-[900px] max-h-[90vh] max-w-[95vw] overflow-hidden rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()} // 클릭 전파 방지
      >
        {/* [A] 왼쪽: 이미지 영역 (너비 60% = w-3/5) */}
        <div className="flex w-3/5 items-center justify-center bg-black">
          <img
            src={photo.url}
            alt={photo.title || "Photo"}
            className="h-full w-full object-contain"
          />
        </div>

        {/* [B] 오른쪽: 정보 영역 (너비 40% = w-2/5) */}
        <div className="flex w-2/5 flex-col p-6 relative">
          {/* 헤더: 제목 + 닫기 버튼 */}
          <div className="mb-4 flex items-start justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {photo.title || "제목 없음"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition-colors"
            >
              {/* X 아이콘 (SVG) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 본문 정보 */}
          <div className="flex-1 overflow-y-auto">
            <p className="mb-2 text-sm font-medium text-gray-500 flex items-center">
              📍 {photo.location || "장소 정보 없음"}
            </p>

            <div className="mb-4">
              <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                #{photo.category || "카테고리"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
