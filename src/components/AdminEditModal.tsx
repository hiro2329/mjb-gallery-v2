// src/components/AdminEditModal.tsx
import { useState } from "react";
import { supabase } from "../supabase";
import { CATEGORIES } from "../constants";

interface Photo {
  id: number;
  url: string;
  title: string;
  location: string;
  category: string;
  description?: string;
}

interface AdminEditModalProps {
  photo: Photo;
  onClose: () => void;
  onUpdate: () => void; // 수정 완료 후 목록 새로고침용
}

export default function AdminEditModal({
  photo,
  onClose,
  onUpdate,
}: AdminEditModalProps) {
  const [title, setTitle] = useState(photo.title);
  const [location, setLocation] = useState(photo.location);
  const [category, setCategory] = useState(photo.category);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("photos")
        .update({
          title,
          location,
          category,
        })
        .eq("id", photo.id); // [중요] 해당 ID의 사진만 수정

      if (error) throw error;

      alert("수정 완료! ✨");
      onUpdate(); // 부모 컴포넌트(Admin)에게 "목록 다시 불러와!" 신호 보냄
      onClose(); // 모달 닫기
    } catch (error) {
      console.error(error);
      alert("수정 실패 🥲");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative animate-fadeIn">
        {/* 모달 헤더 */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg">정보 수정</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            &times;
          </button>
        </div>

        {/* 수정 폼 */}
        <div className="p-6 space-y-4">
          {/* 이미지 미리보기 (수정 불가, 확인용) */}
          <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={photo.url}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              카테고리
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              장소
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="p-4 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
          >
            취소
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex-1 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400"
          >
            {loading ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
