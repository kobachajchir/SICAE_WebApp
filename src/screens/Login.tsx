import { useEffect, useState } from "react";
import { Router, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/ThemeContext";
import { useUser } from "../hooks/UserContext";
import { MdAccountCircle, MdLogin, MdWarning } from "react-icons/md";

function Login() {
  const { selectThemeClass } = useTheme();
  const navigate = useNavigate();
  //@ts-ignore
  const { currentUser, login, logout } = useUser();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  function handleLogin() {
    login(email, pass)
      .then(() => {
        navigate("/home");
      })
      .catch((error) => {
        console.log("Login error:", error);
        setError(true);
      });
  }

  return (
    <div
      className={`${selectThemeClass(
        "bg-white",
        "bg-gray-900"
      )} flex flex-col items-center justify-items-center w-full h-full`}
      style={{
        position: "relative",
      }}
    >
      <div
        className={`${selectThemeClass(
          "text-black",
          "text-white"
        )} text-3xl font-bold h-1/6 text-center w-full flex flex-row justify-center items-center`}
      >
        <span
          className={`${selectThemeClass(
            "text-black",
            "text-white"
          )} text-6xl font-bold text-center`}
        >
          Login
        </span>
      </div>
      <div
        className={`flex flex-col w-full h-5/6 ${selectThemeClass(
          "bg-gray-200 text-black",
          "bg-gray-800 text-white"
        )} justify-center items-center`}
      >
        <div
          className={`flex w-full flex-col h-3/4 ${selectThemeClass(
            "bg-gray-200",
            "bg-gray-800"
          )} justify-center items-center`}
        >
          <div
            className={`flex w-1/2 rounded-2xl flex-col h-5/6 align-center justify-center items-center ${selectThemeClass(
              "bg-gray-100",
              "bg-gray-900"
            )}`}
          >
            <MdAccountCircle
              fill={selectThemeClass("#000", "#fff")}
              size={120}
              style={{ margin: 30 }}
            ></MdAccountCircle>
            <p
              className={`${selectThemeClass(
                "text-black",
                "text-white"
              )} text-2xl font-bold text-center -mt-10 mb-4`}
            >
              Inicie sesion para entrar al sistema
            </p>
            <div className="flex flex-col items-center justify-center my-2">
              <div className="flex flex-row items-center justify-center my-1">
                <label
                  className={`${selectThemeClass(
                    "text-black",
                    "text-white"
                  )} text-2xl font-bold text-center`}
                >
                  Email:
                </label>
                <input
                  className={`${selectThemeClass(
                    "bg-gray-400 text-black",
                    "bg-gray-600 text-white"
                  )} p-2 px-4 rounded-full ml-2 w-3/4`}
                  type="text"
                  name="wifiSsid"
                  id="wifiSsid"
                  onChange={(e) => {
                    setEmail(e.currentTarget.value);
                  }}
                  onFocus={() => {
                    if (error) {
                      setError(false);
                    }
                  }}
                />
              </div>
              <div className="flex flex-row items-center justify-center my-1">
                <label
                  className={`${selectThemeClass(
                    "text-black",
                    "text-white"
                  )} text-2xl font-bold text-center`}
                >
                  Contraseña:
                </label>
                <input
                  className={`${selectThemeClass(
                    "bg-gray-400 text-black",
                    "bg-gray-600 text-white"
                  )} p-2 px-4 rounded-full ml-2 w-3/4`}
                  type="password"
                  name="userPassword"
                  id="userPassword"
                  onChange={(e) => {
                    setPass(e.currentTarget.value);
                  }}
                  onFocus={() => {
                    if (error) {
                      setError(false);
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex flex-row justify-around items-center mb-10 mt-5">
              <button
                onClick={handleLogin}
                className={`${selectThemeClass(
                  "bg-lime-300 text-black",
                  "bg-lime-600 text-white"
                )} p-2 px-4 rounded-full flex flex-row align-center items-center mx-1`}
              >
                <p
                  className={`${selectThemeClass(
                    "text-black",
                    "text-white"
                  )} text-lg font-bold text-center mr-2`}
                >
                  Ingresar
                </p>
                <MdLogin
                  fill={selectThemeClass("#000", "#fff")}
                  fontSize={35}
                ></MdLogin>
              </button>
            </div>
          </div>
          {error && (
            <div className="h-auto w-auto flex-col items-center justify-center align-center bg-red-500 my-4 rounded-xl px-4 py-2">
              <MdWarning
                fill={selectThemeClass("#000", "#fff")}
                fontSize={60}
              ></MdWarning>
              <p
                className={`text-lg font-bold ${selectThemeClass(
                  "text-black",
                  "text-white"
                )}`}
              >
                Error de credenciales
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
