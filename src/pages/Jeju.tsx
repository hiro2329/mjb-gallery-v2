// src/pages/Jeju.tsx
import PhotoCard from "../components/PhotoCard";
import { supabase } from "../supabase";
import { useEffect, useState } from "react";

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

  // 3. 화면이 켜지자마자 실행되는 함수 (useEffect)
  useEffect(() => {
    // 데이터 로드 함수 (컴포넌트 마운트 시 실행)
    async function fetchPhotos() {
      setLoading(true);

      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .eq("category", "JEJU") // 카테고리 필터링
        .order("created_at", { ascending: false }); // 최신순 정렬

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
    <div className="py-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🍊 Jeju Island
      </h2>

      {/* 로딩 중일 때 보여줄 화면 */}
      {loading ? (
        <div className="text-center text-gray-500 py-20">
          로딩 중입니다... ⏳
        </div>
      ) : (
        /* 데이터가 로딩되면 보여줄 화면 */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {/* 가져온 데이터(photos)가 없으면 안내 문구 */}
          {photos.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">
              아직 등록된 사진이 없어요 🥲
            </div>
          ) : (
            photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                imageUrl={photo.url}
                title={photo.title}
                location={photo.location}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
