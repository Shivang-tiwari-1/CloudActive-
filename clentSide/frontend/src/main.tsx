import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AuthState from "./context/Auth/AuthState.tsx";
import AlertState from "./context/Alert/AlertState.tsx";
import { BrowserRouter } from "react-router-dom";
import UserState from "./context/User/UserState.tsx";
import EventContext, { EventProvider } from "./context/Event/eventState.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthState>
        <AlertState>
          <UserState>
            <EventProvider>
              {" "}
              {/* ✅ wrap App with UserState */}
              <App />
            </EventProvider>
          </UserState>
        </AlertState>
      </AuthState>
    </BrowserRouter>
  </StrictMode>
);
