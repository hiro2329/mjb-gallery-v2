// src/pages/Admin.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

// 데이터 타입 정의
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

  // 사진 목록 상태 (삭제 기능을 위해 필요!)
  const [photos, setPhotos] = useState<Photo[]>([]);

  // 1. 페이지 켜지면 사진 목록 가져오기
  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false }); // 최신순

    if (error) console.error("데이터 로딩 실패:", error);
    else setPhotos(data || []);
  };

  // 로그아웃
  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("로그아웃 되었습니다 👋");
    navigate("/");
  };

  // 파일 선택
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // 업로드 기능
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("사진을 선택해주세요!");

    try {
      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 스토리지 업로드
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      // DB 저장
      const { error: dbError } = await supabase
        .from("photos")
        .insert([{ url: publicUrl, title, location, category }]);

      if (dbError) throw dbError;

      alert("업로드 성공! 🎉");

      // 초기화 및 목록 새로고침
      setTitle("");
      setLocation("");
      setFile(null);
      fetchPhotos(); // 리스트 즉시 갱신!
    } catch (error) {
      console.error(error);
      alert("업로드 실패... 😭");
    } finally {
      setUploading(false);
    }
  };

  // 👇 2. 삭제 기능 (핵심!)
  const handleDelete = async (id: number, url: string) => {
    if (!window.confirm("정말 이 사진을 삭제하시겠습니까? (되돌릴 수 없어요!)"))
      return;

    try {
      // (1) 스토리지에서 파일 삭제
      // URL에서 파일명만 발라내기 (예: .../images/1234.jpg -> 1234.jpg)
      const fileName = url.split("/").pop();

      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from("images")
          .remove([fileName]); // 배열로 넣어야 함

        if (storageError) {
          console.error("이미지 삭제 에러:", storageError);
        }
      }

      // (2) DB에서 데이터 삭제
      const { error: dbError } = await supabase
        .from("photos")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      alert("삭제되었습니다! 🗑️");

      // (3) 화면 목록에서 바로 지우기 (새로고침 안 해도 되게)
      setPhotos(photos.filter((photo) => photo.id !== id));
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 font-bold underline"
        >
          로그아웃
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center">
        📸 관리자 대시보드
      </h2>

      {/* 업로드 폼 영역 */}
      <div className="bg-white p-6 rounded-lg shadow-md border mb-12">
        <h3 className="text-xl font-bold mb-4">새 사진 등록</h3>
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="JEJU">JEJU (제주)</option>
                <option value="SAPPORO">SAPPORO (삿포로)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">장소</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border p-2 rounded"
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
                className="w-full"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400 mt-2"
          >
            {uploading ? "업로드 중..." : "등록하기"}
          </button>
        </form>
      </div>

      <hr className="my-10 border-gray-300" />

      {/* 사진 목록 및 삭제 영역 */}
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
              {/* 이미지 */}
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-48 object-cover"
              />

              {/* 정보 */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg">{photo.title}</h4>
                  <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">
                    {photo.category}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">{photo.location}</p>
              </div>

              {/* 삭제 버튼 (마우스 올리면 나옴 or 항상 표시) */}
              <button
                onClick={() => handleDelete(photo.id, photo.url)}
                className="absolute top-2 right-2 bg-gray-100 text-white p-2 rounded-full shadow-lg opacity-90 hover:opacity-100 hover:bg-red-600 transition-all"
                title="삭제하기"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
