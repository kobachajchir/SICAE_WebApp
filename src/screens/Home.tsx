//@ts-nocheck
import { useEffect, useState } from "react";
import { useTheme } from "../hooks/ThemeContext";
import { ConnectionInfo } from "../types/APITypes";
import { useNavigate } from "react-router-dom";
import GoToButton from "../components/GoToButton";
import { MdArrowCircleDown, MdArrowCircleUp, MdExitToApp, MdLight, MdLightMode, MdLogout, MdPower, MdPowerOff, MdRestore, MdSave, MdSettings, MdToggleOff, MdToggleOn, MdWifi, MdWifiTethering } from "react-icons/md";
import { fetchConnectionInfo, updateConnectionData } from "../tools/api";
import { useUser } from "../hooks/UserContext";
import { useDispositivos } from "../hooks/DispositivosContext";
import { DataEntry } from "../types/DispositivoTypes";
import { database } from "../../firebaseConfig";
import { ref, set } from "firebase/database";

function Home() {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const { selectThemeClass } = useTheme();
  const navigate = useNavigate();
  const { currentUser, logout } = useUser();
  const { dispositivos, setDispositivos } = useDispositivos();
  const [openDispositivo, setOpenDispositivo] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenDispositivo(openDispositivo === id ? null : id);
  };

  const handleClick = (data: DataEntry, dispositivoId: string, dataId: string) => {
    const updatedState = !data.state;
  
    // Update the local state
    const updatedDispositivos = dispositivos.map((dispositivo) => {
      if (dispositivo.id === dispositivoId) {
        return {
          ...dispositivo,
          data: {
            ...dispositivo.data,
            [dataId]: {
              ...dispositivo.data[dataId],
              state: updatedState,
            },
          },
        };
      }
      return dispositivo;
    });
  
    setDispositivos(updatedDispositivos);
  
    // Update the state in Firebase
    const dataRef = ref(database, `dispositivos/${dispositivoId}/data/${dataId}/state`);
    set(dataRef, updatedState)
      .then(() => {
        console.log("State updated successfully");
      })
      .catch((error) => {
        console.error("Error updating state:", error);
      });
  };
  

  useEffect(() => {
    const dispElegido = dispositivos.find((item)=>item.id == openDispositivo)
    console.log(dispElegido)
  }, [openDispositivo]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser]);

  function handleGoToSettings() {
    navigate("/settings");
  }

  function handleLogout() {
    logout();
  }

  return (
    <div
      className={`${selectThemeClass(
        "bg-white",
        "bg-gray-900"
      )} flex flex-col items-center justify-items-center w-full h-full`}
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
          goToSectionTitle={"Cerrar sesion"}
          fnGoTo={handleLogout}
          icon={<MdLogout
            fill={selectThemeClass("#000", "#fff")}
            size={35}
          ></MdLogout>}
          classnames="ml-2"
          classnamesContainer={`absolute left-0 ml-4 ${selectThemeClass(
            "bg-gray-200 text-black",
            "bg-gray-700 text-white"
          )} flex-row align-center items-center justify-center`}
        ></GoToButton>
        <span
          className={`${selectThemeClass(
            "text-black",
            "text-white"
          )} text-6xl font-bold text-center`}
        >
          SICAE Web App
        </span>
        <span
          className={`${selectThemeClass(
            "text-black",
            "text-white"
          )} text-xl font-bold text-center absolute right-10 mr-4`}
        >
          {`Sesion de: ${currentUser?.userEmail}`}
        </span>
      </div>
      <div
        className={`flex flex-col w-full h-5/6 ${selectThemeClass(
          "bg-gray-200 text-black",
          "bg-gray-800 text-white"
        )} justify-center items-center`}
      >
        <div
          className={`flex w-full flex-col h-3/4 justify-center items-center`}
        >
          <div
            className={`flex w-1/2 rounded-2xl flex-col h-5/6 align-center justify-center items-center ${selectThemeClass(
              "bg-gray-100",
              "bg-gray-900"
            )}`}
          >
            {dispositivos.length > 0 && dispositivos.map((dispositivo) => (
              <div key={dispositivo.id} className={`${selectThemeClass(
                "bg-gray-200 text-black",
                "bg-gray-700 text-white"
              )} mb-4 rounded-lg p-4 flex flex-col w-3/4`}>
                <button
                  onClick={() => {
                    if (dispositivo.online) {
                      handleToggle(dispositivo.id)
                  }}}
                  className="flex justify-between items-center w-full text-left"
                >
                  <span className={`text-md font-bold ${dispositivo.online ? "text-green-400" : "text-red-400"}`}>{`Placa ${dispositivo.id}`}</span>
                  {openDispositivo === dispositivo.id ? <MdArrowCircleUp
                      fill={selectThemeClass("#000", "#fff")}
                      size={30}
                    ></MdArrowCircleUp> : <MdArrowCircleDown
                    fill={selectThemeClass("#000", "#fff")}
                    size={30}
                  ></MdArrowCircleDown> }
                </button>
                {openDispositivo === dispositivo.id && dispositivo.data && (
                  <div className="flex flex-col mt-4">
                    <div className="flex flex-col items-center align-center justify-center my-2">
                      <p
                      className={`${selectThemeClass(
                        "text-black",
                        "text-white"
                      )} text-xl font-bold text-center`}
                    >
                      Ubicado en: {dispositivo.salaName}
                    </p>
                    </div>
                    <div className="flex flex-col items-center align-center justify-center my-2">
                      <MdWifi
                        fill={selectThemeClass("#000", "#fff")}
                        size={30}
                      ></MdWifi>
                      <p
                      className={`${selectThemeClass(
                        "text-black",
                        "text-white"
                      )} text-xl font-bold text-center`}
                    >
                      Conectado a la red: {dispositivo.wifiName}
                    </p>
                      <p
                      className={`${selectThemeClass(
                        "text-black",
                        "text-white"
                      )} text-md font-bold text-center`}
                    >
                      IP local: {dispositivo.currentIp}
                    </p>
                    </div>
                    <div className="flex flex-col items-center align-center justify-center my-2">
                      <p
                      className={`${selectThemeClass(
                        "text-black",
                        "text-white"
                      )} text-md font-bold text-center`}
                    >
                      Dispositivos conectados
                    </p>
                    {Object.keys(dispositivo.data).map((dataId) => (
                      <div
                        key={dataId}
                        className={`${selectThemeClass(
                          "bg-gray-300",
                          "bg-gray-800"
                        )} text-md font-bold text-center flex flex-col p-4 m-2 rounded-lg items-center align-center justify-center`}
                        onClick={() => handleClick(dispositivo.data[dataId], dispositivo.id, dataId)}
                      >
                        {dispositivo.data[dataId].state ?                         <MdToggleOn
                          fill={"#04F804"}
                          size={30}
                        ></MdToggleOn> :                         <MdToggleOff
                          fill={selectThemeClass("#000", "#fff")}
                          size={30}
                        ></MdToggleOff>}
                        <p><strong>Nombre:</strong> {dispositivo.data[dataId].name}</p>
                        <p><strong>Estado:</strong> {dispositivo.data[dataId].state ? 'On' : 'Off'}</p>
                      </div>
                    ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="h-1/6 flex items-center justify-center align-center">
          <GoToButton
            fnGoTo={handleGoToSettings}
            goToSectionTitle="Configuracion"
            icon={<MdSettings
              fill={selectThemeClass("#000", "#fff")}
              size={30}
            ></MdSettings>}
            classnames="text-2xl ml-2 font-bold"
            classnamesContainer={`${selectThemeClass(
              "bg-gray-100 text-black",
              "bg-gray-900 text-white"
            )} px-5 flex-row`}
          ></GoToButton>
        </div>
      </div>
    </div>
  );
}

export default Home;
