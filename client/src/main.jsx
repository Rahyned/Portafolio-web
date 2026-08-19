import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { DataProvider } from "./context/DataContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SoundProvider } from "./context/SoundContext";
import { UiProvider } from "./context/UiContext";

import "./styles/variables.css";
import "./styles/global.css";
import "./styles/pixel.css";
import "./styles/header.css";
import "./styles/hero.css";
import "./styles/breadcrumb.css";
import "./styles/trainer-card.css";
import "./styles/pc-storage.css";
import "./styles/blog.css";
import "./styles/contact.css";
import "./styles/terminal.css";
import "./styles/footer.css";
import "./styles/animations.css";
import "./styles/boot.css";
import "./styles/crt.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <SoundProvider>
        <UiProvider>
          <DataProvider>
            <App />
          </DataProvider>
        </UiProvider>
      </SoundProvider>
    </ThemeProvider>
  </StrictMode>
);
