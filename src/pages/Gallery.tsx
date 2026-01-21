// src/pages/Gallery.tsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import PhotoCard from "../components/PhotoCard";
import ImageDetailModal from "../components/ImageDetailModal";

// 1. 타입 정의
interface Photo {
  id: number;
  url: string;
  title: string;
  location: string;
  category: string;
}

// 데이터 가져오는 함수를 컴포넌트 밖으로 분리
const fetchPhotos = async (category?: string) => {
  const targetCategory = (category || "").toUpperCase();

  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("category", targetCategory)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Photo[];
};

export default function Gallery() {
  const { category } = useParams<{ category: string }>();

  // 선택된 사진 State (모달용)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // 리액트 쿼리로 데이터 관리
  // isLoading: 로딩 중인지? (true/false)
  // data: 받아온 데이터 (기본값 [])
  // error: 에러 발생 여부
  const {
    data: photos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["photos", category], // 이 키가 다르면 데이터를 새로 가져옴
    queryFn: () => fetchPhotos(category), // 위에서 만든 함수 실행
    staleTime: 1000 * 60 * 5, //  5분 동안 캐싱 (다시 접속하면 로딩 없이 즉시 뜸)
  });

  // 화면 표시용 제목 가공
  const displayTitle = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "Gallery";

  // [Error UI] 에러 났을 때 보여줄 화면
  if (error) {
    return (
      <div className="text-center text-red-500 py-20">
        데이터를 불러오는데 실패했습니다 😢
      </div>
    );
  }

  return (
    <div className="py-10 relative">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {displayTitle}
      </h2>

      {isLoading ? (
        <div className="text-center text-gray-500 py-20">
          로딩 중입니다... ⏳
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {photos.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">
              아직 등록된 사진이 없어요 🥲
            </div>
          ) : (
            photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <PhotoCard
                  imageUrl={photo.url}
                  title={photo.title}
                  location={photo.location}
                />
              </div>
            ))
          )}
        </div>
      )}

      {/* 모달 컴포넌트 연결  */}
      {selectedPhoto && (
        <ImageDetailModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
}
