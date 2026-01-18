// src/pages/Admin.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import imageCompression from "browser-image-compression";
import { CATEGORIES } from "../constants";
import AdminEditModal from "../components/AdminEditModal"; // 모달 불러오기

interface Photo {
  id: number;
  url: string;
  title: string;
  location: string;
  category: string;
}

export default function Admin() {
  const navigate = useNavigate();

  // 입력 폼 상태
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("JEJU");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // 사진 목록 상태
  const [photos, setPhotos] = useState<Photo[]>([]);

  // 수정 모달 상태 (현재 수정 중인 사진 데이터 저장)
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  // 초기 데이터 로딩
  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("데이터 로딩 실패:", error);
    else setPhotos(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("로그아웃 되었습니다 👋");
    navigate("/");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // 이미지 업로드 및 압축
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("사진을 선택해주세요!");

    try {
      setUploading(true);

      // (1) 압축 옵션 설정
      const options = {
        maxSizeMB: 1, // 최대 1MB를 넘지 않게 줄여라!
        maxWidthOrHeight: 1920, // FHD(1920px)보다 크면 줄여라!
        useWebWorker: true, // 컴퓨터가 버벅이지 않게 따로 일해라!
        fileType: "image/webp", // webp 포맷으로 바꿔라!
      };

      // (2) 압축 수행 및 결과 확인
      console.log(` 원본 용량: ${(file.size / 1024 / 1024).toFixed(2)} MB`);

      const compressedFile = await imageCompression(file, options);

      console.log(
        ` 압축 후: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`
      );

      // (3) 파일명 생성
      // 압축된 파일(compressedFile)을 기반으로 업로드

      const fileName = `${Date.now()}.webp`;
      const filePath = `${fileName}`;

      // (4) Supabase 업로드
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      // (5) URL 가져오기
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      // (6) DB 저장
      const { error: dbError } = await supabase
        .from("photos")
        .insert([{ url: publicUrl, title, location, category }]);

      if (dbError) throw dbError;

      // 성공 메시지에 줄어든 용량 알려주기
      alert(
        `업로드 성공! 🎉\n(용량이 ${(compressedFile.size / 1024 / 1024).toFixed(
          2
        )} MB로 최적화되었습니다)`
      );

      // 초기화
      setTitle("");
      setLocation("");
      setFile(null);
      fetchPhotos();
    } catch (error) {
      console.error(error);
      alert("업로드 실패... 😭");
    } finally {
      setUploading(false);
    }
  };

  // 삭제 함수
  const handleDelete = async (id: number, url: string) => {
    if (!window.confirm("정말 이 사진을 삭제하시겠습니까?")) return;

    try {
      const fileName = url.split("/").pop();
      if (fileName) {
        await supabase.storage.from("images").remove([fileName]);
      }

      const { error } = await supabase.from("photos").delete().eq("id", id);
      if (error) throw error;

      alert("삭제되었습니다! 🗑️");
      setPhotos(photos.filter((photo) => photo.id !== id));
    } catch (error) {
      console.error(error);
      alert("삭제 실패");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 font-bold underline cursor-pointer"
        >
          로그아웃
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center">
        📸 관리자 대시보드
      </h2>

      {/* 업로드 폼 */}
      <div className="bg-white p-6 rounded-lg shadow-md border mb-12">
        <h3 className="text-xl font-bold mb-4">새 사진 등록 (자동 압축 ⚡)</h3>
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="" disabled>
                  -- 카테고리를 선택하세요 --
                </option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">장소</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                사진 파일
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400 mt-2 transition-colors"
          >
            {uploading ? "압축 및 업로드 중... ⏳" : "등록하기"}
          </button>
        </form>
      </div>

      <hr className="my-10 border-gray-300" />

      {/* 사진 목록 */}
      <div>
        <h3 className="text-xl font-bold mb-6">
          📂 등록된 사진 목록 ({photos.length}장)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-lg shadow border overflow-hidden relative group"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg truncate">{photo.title}</h4>
                  <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">
                    {photo.category}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-4">{photo.location}</p>

                {/* [수정] 버튼 영역: 기존 우측상단 삭제버튼을 아래쪽 버튼 목록으로 변경 */}
                <div className="flex gap-2 pt-3 border-t">
                  <button
                    onClick={() => setEditingPhoto(photo)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded text-sm font-bold hover:bg-gray-200 transition-colors"
                  >
                    ✏️ 수정
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id, photo.url)}
                    className="flex-1 bg-red-50 text-red-600 py-2 rounded text-sm font-bold hover:bg-red-100 transition-colors"
                  >
                    🗑️ 삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* [추가] 수정 모달 연결 */}
      {/* editingPhoto에 데이터가 있을 때만 모달이 뜸 */}
      {editingPhoto && (
        <AdminEditModal
          photo={editingPhoto}
          onClose={() => setEditingPhoto(null)} // 모달 닫기 버튼 누르면 state 초기화
          onUpdate={fetchPhotos} // 수정 완료되면 목록 새로고침
        />
      )}
    </div>
  );
}
