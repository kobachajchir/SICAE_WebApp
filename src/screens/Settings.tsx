import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/ThemeContext";
import GoToButton from "../components/GoToButton";
import { BoardInfo, SystemInfo } from "../types/APITypes";
import { fetchSystemInfo } from "../tools/api";
import ToggleButton from "../components/toggleButton";
import {
  MdArrowBack,
  MdArrowCircleDown,
  MdArrowCircleUp,
  MdBugReport,
  MdCloudDownload,
  MdDarkMode,
  MdDownload,
  MdHome,
  MdLightMode,
  MdList,
  MdResetTv,
  MdRestartAlt,
} from "react-icons/md";
import { useDispositivos } from "../hooks/DispositivosContext";
import { Dispositivo } from "../types/DispositivoTypes";

function Settings() {
  const [boardList, setBoardList] = useState<BoardInfo[] | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const { isDarkMode, selectThemeClass, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [selectedDispositivo, setSelectedDispositivo] =
    useState<Dispositivo | null>(null);
  const { dispositivos, setDispositivos } = useDispositivos();
  const [openDispositivo, setOpenDispositivo] = useState<boolean>(false);
  const [showDispositivos, setShowDispositivos] = useState<boolean>(false);
  const [aliveTest, setAliveTest] = useState<boolean>(false);
  const [alivePck, setAlivePck] = useState<string>("test");

  function sendAliveTest() {
    console.log("send alive fn");
  }

  function handleGoToHome() {
    navigate("/");
  }

  const handleToggle = (id: string) => {
    setOpenDispositivo(!openDispositivo);
    //@ts-ignore
    setSelectedDispositivo(dispositivos.find((item) => item.id === id));
  };

  useEffect(() => {}, [dispositivos]);

  return (
    <div
      className={`${selectThemeClass(
        "bg-white",
        "bg-gray-900"
      )} flex flex-col items-center justify-items-center w-screen h-screen`}
      style={{
        position: "relative",
      }}
    >
      <div
        className={`${selectThemeClass(
          "text-black",
          "text-white"
        )} text-3xl font-bold h-1/6 text-center w-full flex flex-row justify-center items-center`}
        style={{
          position: "relative",
        }}
      >
        <GoToButton
          goToSectionTitle={"Ir a inicio"}
          fnGoTo={handleGoToHome}
          icon={
            <MdArrowBack
              fill={selectThemeClass("#000", "#fff")}
              size={30}
            ></MdArrowBack>
          }
          classnames="ml-2 text-2xl"
          classnamesContainer={`absolute left-5 ml-4 ${selectThemeClass(
            "bg-gray-200 text-black",
            "bg-gray-700 text-white"
          )} flex-row align-center items-center justify-center p-4 rounded-full`}
        ></GoToButton>
        <span
          className={`${selectThemeClass(
            "text-black",
            "text-white"
          )} text-6xl font-bold text-center`}
        >
          Configuracion
        </span>
        <div className="flex flex-row justify-center items-center h-min absolute right-0 mr-10  ">
          <button
            onClick={() => toggleTheme()}
            className={`flex justify-between items-center w-full text-left p-4 rounded-full ${selectThemeClass(
              "bg-gray-200 text-black",
              "bg-gray-800 text-white"
            )}`}
          >
            {isDarkMode ? (
              <MdDarkMode
                size={30}
                fill={selectThemeClass("#000", "#fff")}
              ></MdDarkMode>
            ) : (
              <MdLightMode
                size={30}
                fill={selectThemeClass("#000", "#fff")}
              ></MdLightMode>
            )}
            <span
              className={`text-2xl font-bold ml-2
              `}
            >
              {isDarkMode ? "Tema oscuro" : "Tema claro"}
            </span>
          </button>
        </div>
      </div>
      <div
        className={`flex flex-col w-full h-5/6 ${selectThemeClass(
          "bg-gray-200 text-black",
          "bg-gray-800 text-white"
        )} items-center`}
      >
        <div
          className={`flex w-full flex-col ${selectThemeClass(
            "bg-gray-200",
            "bg-gray-800"
          )} items-center justify-center my-4`}
        >
          <button
            onClick={() => setShowDispositivos(!showDispositivos)}
            className={`flex flex-row items-center justify-center bg-green-400 h-min rounded-full p-3 px-6`}
          >
            <MdList fill={selectThemeClass("#000", "#fff")} size={25}></MdList>
            <p
              className={`text-2xl ml-2 ${selectThemeClass(
                "text-black",
                "text-white"
              )}`}
            >
              {!showDispositivos
                ? "Listar placas online"
                : "Ocultar placas online"}
            </p>
          </button>
        </div>
        {showDispositivos && (
          <div
            className={`flex w-full flex-col h-3/4 justify-center items-center`}
          >
            <div
              className={`flex w-5/6 rounded-2xl flex-col py-4 align-center justify-center items-center ${selectThemeClass(
                "bg-gray-100",
                "bg-gray-900"
              )}`}
            >
              {dispositivos.length > 0 &&
                dispositivos
                  .filter((el) => el.data.info.status === true)
                  .map((dispositivo) => (
                    <div
                      key={dispositivo.id}
                      className={`${selectThemeClass(
                        "bg-gray-200 text-black",
                        "bg-gray-700 text-white"
                      )} my-2 rounded-lg p-4 flex flex-col w-3/4`}
                    >
                      <button
                        onClick={() => {
                          handleToggle(dispositivo.id);
                        }}
                        className="flex justify-between items-center w-full text-left"
                      >
                        <span
                          className={`text-md font-bold ${
                            dispositivo.data.info.status
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >{`Placa ${dispositivo.id}`}</span>
                        {dispositivo.data.info.status &&
                          (openDispositivo ? (
                            <MdArrowCircleUp
                              fill={selectThemeClass("#000", "#fff")}
                              size={30}
                            ></MdArrowCircleUp>
                          ) : (
                            <MdArrowCircleDown
                              fill={selectThemeClass("#000", "#fff")}
                              size={30}
                            ></MdArrowCircleDown>
                          ))}
                      </button>
                      {selectedDispositivo?.id == dispositivo.id &&
                        openDispositivo &&
                        dispositivo.data && (
                          <div className="flex flex-col w-full">
                            <div className="flex flex-col">
                              <p
                                className={`${selectThemeClass(
                                  "text-black",
                                  "text-white"
                                )} mt-1 text-lg font-bold ml-4`}
                              >
                                Firmware
                              </p>
                              <div className="flex flex-row mt-1 justify-center align-center items-center">
                                <input
                                  type="text"
                                  name="firmware"
                                  id="firmware"
                                  readOnly
                                  className={`${selectThemeClass(
                                    "bg-gray-400 text-black",
                                    "bg-gray-600 text-white"
                                  )} p-2 px-4 rounded-full mr-2 w-3/4`}
                                />
                                <button
                                  className={`${selectThemeClass(
                                    "bg-sky-300 text-black",
                                    "bg-sky-600 text-white"
                                  )} p-2 px-4 rounded-full `}
                                  onClick={() => {
                                    console.log("solicitar firm");
                                  }}
                                >
                                  Solicitar
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <p
                                className={`${selectThemeClass(
                                  "text-black",
                                  "text-white"
                                )} mt-3 text-lg font-bold ml-4`}
                              >
                                Fecha y hora en ESP
                              </p>
                              <div className="flex flex-row mt-1 justify-center align-center items-center">
                                <input
                                  type="text"
                                  name="espTime"
                                  id="espTime"
                                  readOnly
                                  className={`${selectThemeClass(
                                    "bg-gray-400 text-black",
                                    "bg-gray-600 text-white"
                                  )} p-2 px-4 rounded-full mr-2 w-3/4`}
                                />
                                <button
                                  className={`${selectThemeClass(
                                    "bg-sky-300 text-black",
                                    "bg-sky-600 text-white"
                                  )} p-2 px-4 rounded-full `}
                                  onClick={() => {
                                    console.log("solicitar time");
                                  }}
                                >
                                  Solicitar
                                </button>
                              </div>
                            </div>
                            {aliveTest && (
                              <div className="flex flex-row mt-4 justify-evenly align-center items-center">
                                <p
                                  className={`${selectThemeClass(
                                    "text-black",
                                    "text-white"
                                  )} my-1 text-lg font-bold`}
                                >
                                  Ultimo alive: {alivePck}
                                </p>
                              </div>
                            )}
                            <div className="flex flex-row mt-4 justify-evenly align-center items-center">
                              <button
                                className={`${selectThemeClass(
                                  "bg-rose-300 text-black",
                                  "bg-rose-600 text-white"
                                )} p-2 px-4 rounded-full flex flex-row align-center items-center mx-1`}
                              >
                                <MdRestartAlt size={30}></MdRestartAlt>
                                Reiniciar placa
                              </button>
                              <button
                                className={`${selectThemeClass(
                                  "bg-lime-300 text-black",
                                  "bg-lime-600 text-white"
                                )} p-2 px-4 rounded-full flex flex-row align-center items-center mx-1`}
                                onClick={sendAliveTest}
                              >
                                <MdBugReport size={30}></MdBugReport>
                                Test Alive
                              </button>
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
