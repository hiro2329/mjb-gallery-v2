// src/pages/Jeju.tsx
import PhotoCard from "../components/PhotoCard";
import { supabase } from "../supabase";
import { useEffect, useState } from "react";
import ImageDetailModal from "../components/ImageDetailModal";

// 1. 가져올 데이터의 모양을 정의 (타입스크립트 interface)
interface Photo {
  id: number;
  url: string;
  title: string;
  location: string;
  category: string;
}

export default function Jeju() {
  // 2. 상태 관리 (데이터를 담을 그릇)
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  // 선택된 사진을 저장할 State (null이면 모달 닫힘)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // 3. 화면이 켜지자마자 실행되는 함수 (useEffect)
  useEffect(() => {
    async function fetchPhotos() {
      setLoading(true);

      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .eq("category", "JEJU")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase Error:", error);
      } else {
        setPhotos(data || []);
      }
      setLoading(false);
    }

    fetchPhotos();
  }, []);

  return (
    <div className="py-10 relative">
      {" "}
      {/* relative 추가 (모달 위치 기준 잡기 위해 안전장치) */}
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🍊 Jeju Island
      </h2>
      {loading ? (
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
              // 클릭 이벤트를 위해 div로 감싸기
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)} // 클릭 시 해당 사진 정보를 State에 담음
                className="cursor-pointer transition-transform hover:scale-105" // 살짝 커지는 효과 추가
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
      {/* 모달 컴포넌트 연결 */}
      {/* selectedPhoto에 값이 있을 때만 모달이 뜸 */}
      {selectedPhoto && (
        <ImageDetailModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
}
