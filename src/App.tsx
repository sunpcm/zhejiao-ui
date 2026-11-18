import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./theme";
import { StoreProvider } from "./store";
import { Shell } from "./shell";
import { HomePage } from "./pages/home";
import { GalleryPage } from "./pages/gallery";
import { BoardPage } from "./pages/board";
import { ReadingPage } from "./pages/reading";
import { InfraPage } from "./pages/infra";

export function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Shell />}>
              <Route index element={<HomePage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="reading" element={<ReadingPage />} />
              <Route path="product" element={<BoardPage />} />
              <Route path="board" element={<Navigate to="/product" replace />} />
              <Route path="infra" element={<InfraPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </ThemeProvider>
  );
}
