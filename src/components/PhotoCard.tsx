// src/components/PhotoCard.tsx

// TypeScript라서 "어떤 데이터를 받을지" 미리 약속해야 합니다.
interface PhotoCardProps {
  imageUrl: string;
  title: string;
  location: string;
}

export default function PhotoCard({
  imageUrl,
  title,
  location,
}: PhotoCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer">
      {/* 1. 이미지 영역 */}
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
      />

      {/* 2. 텍스트 오버레이 (마우스 올리면 어둡게 변하면서 글자 나옴) */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex flex-col justify-end p-4">
        <h3 className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          {title}
        </h3>
        <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
          📍 {location}
        </p>
      </div>
    </div>
  );
}
