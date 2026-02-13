import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants, PanInfo } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const sampleImages: string[] = [
  "/IMG_0722.jpeg",
  "/IMG_0745.jpeg",
  "/IMG_1026.JPG",
];

const variants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number): number => {
  return Math.abs(offset) * velocity;
};

export default function Home() {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const imageIndex: number = Math.abs(page % sampleImages.length);

  const paginate = (newDirection: number): void => {
    setPage([page + newDirection, newDirection]);
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const { offset, velocity } = info;
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  return (
    // 1. 전체 컨테이너: 불필요한 배경색 제거, 위아래 여백만 줌
    <div className="flex flex-col items-center justify-center w-full min-h-[80vh] bg-white">
      {/* 2. 캐러셀 영역: 그림자 제거, 심플한 비율 유지 */}
      <div className="relative w-full max-w-7xl h-[60vh] sm:h-[600px] overflow-hidden group">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={sampleImages[imageIndex]}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute w-full h-full object-cover" // object-fit: cover로 꽉 차게
            alt="Gallery preview"
          />
        </AnimatePresence>

        {/* 화살표: 평소엔 숨겼다가(opacity-0) 마우스 올리면(group-hover) 나타나게 -> 더 깔끔함 */}
        <div
          className="absolute top-1/2 left-4 transform -translate-y-1/2 p-4 text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          onClick={() => paginate(-1)}
        >
          <FiChevronLeft size={40} className="drop-shadow-lg" />
        </div>
        <div
          className="absolute top-1/2 right-4 transform -translate-y-1/2 p-4 text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          onClick={() => paginate(1)}
        >
          <FiChevronRight size={40} className="drop-shadow-lg" />
        </div>
      </div>

      {/* 3. 텍스트 영역: 여백을 많이 주고(mt-16), 폰트는 얇고 세련되게 */}
      <div className="mt-16 text-center space-y-4 px-4">
        <h1 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-wide">
          MJB Photo Gallery
        </h1>
        <p className="text-gray-500 font-light text-sm sm:text-base tracking-wider leading-relaxed">
          여행의 순간들을 기록하는 공간입니다.
          <br />
          상단 메뉴를 눌러 갤러리를 구경해보세요.
        </p>
      </div>
    </div>
  );
}
