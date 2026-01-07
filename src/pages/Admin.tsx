// src/pages/Admin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동 훅
import { supabase } from "../supabase";

export default function Admin() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("JEJU");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate(); // 이동 도구

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("로그아웃 에러:", error);

    alert("로그아웃 되었습니다 👋");
    navigate("/"); // 홈으로 이동
  };

  // 업로드 핸들러
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("사진을 선택해주세요!");

    try {
      setUploading(true);

      // 1. 파일명 생성 (한글 깨짐 방지 & 중복 방지)
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. Storage 업로드
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. 이미지 URL 가져오기
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      // 4. Database 저장
      const { error: dbError } = await supabase.from("photos").insert([
        {
          url: publicUrl,
          title: title,
          location: location,
          category: category,
        },
      ]);

      if (dbError) throw dbError;

      alert("업로드 성공! 🎉");

      // 입력창 초기화
      setTitle("");
      setLocation("");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("업로드 실패... 😭 (콘솔 확인)");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      {/* 상단 로그아웃 버튼 */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700 font-bold underline cursor-pointer"
        >
          로그아웃
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center">📸 사진 업로드</h2>

      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        {/* 카테고리 선택 */}
        <div>
          <label className="block text-sm font-medium mb-1">카테고리</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="JEJU">JEJU (제주)</option>
            <option value="SAPPORO">SAPPORO (삿포로)</option>
          </select>
        </div>

        {/* 제목 입력 */}
        <div>
          <label className="block text-sm font-medium mb-1">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 푸른 바다"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* 장소 입력 */}
        <div>
          <label className="block text-sm font-medium mb-1">장소</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="예: 함덕 해수욕장"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* 파일 선택 */}
        <div>
          <label className="block text-sm font-medium mb-1">사진 파일</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
        </div>

        {/* 업로드 버튼 */}
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400 mt-2 transition-colors"
        >
          {uploading ? "업로드 중... ⏳" : "등록하기"}
        </button>
      </form>
    </div>
  );
}
