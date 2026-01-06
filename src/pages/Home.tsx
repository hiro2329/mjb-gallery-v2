export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 min-h-[50vh]">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        📸 MJB Photo Gallery
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl text-center">
        여행의 순간들을 기록하는 공간입니다.
        <br />
        상단 메뉴를 눌러 갤러리를 구경해보세요.
      </p>
    </div>
  );
}
