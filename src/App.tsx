import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Jeju from "./pages/Jeju";
import Sapporo from "./pages/Sapporo";

function App() {
  return (
    <BrowserRouter>
      <Header /> {/* 상단 메뉴 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jeju" element={<Jeju />} />
          <Route path="/sapporo" element={<Sapporo />} />
        </Routes>
      </main>
      <footer className="text-center py-8 text-gray-400 text-sm border-t">
        © 2026 MJB Photo Gallery.
      </footer>
    </BrowserRouter>
  );
}

export default App;
