import { ReactNode, useEffect, useState } from "react";
import "./App.css";
import { useUser } from "./hooks/UserContext";
import { ThemeProvider } from "./hooks/ThemeContext";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Settings from "./screens/Settings";
import Footer from "./components/Footer";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { DispositivosProvider } from "./hooks/DispositivosContext";

function App() {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <ThemeProvider>
      <DispositivosProvider>
        <div className="w-full min-h-full">
          <Routes>
            {!currentUser ? (
              <>
                <Route path="/" element={<Login />} />
                <Route path="/*" element={<Login />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/*" element={<Home />} />
              </>
            )}
          </Routes>
          <Footer />
        </div>
      </DispositivosProvider>
    </ThemeProvider>
  );
}

export default App;
