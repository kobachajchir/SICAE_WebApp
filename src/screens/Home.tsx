//@ts-nocheck
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "../hooks/ThemeContext";
import { ConnectionInfo } from "../types/APITypes";
import { useNavigate } from "react-router-dom";
import GoToButton from "../components/GoToButton";
import {
  MdArrowCircleDown,
  MdArrowCircleUp,
  MdExitToApp,
  MdLight,
  MdLightMode,
  MdLogout,
  MdPower,
  MdPowerOff,
  MdRestore,
  MdSave,
  MdSettings,
  MdToggleOff,
  MdToggleOn,
  MdWifi,
  MdWifiTethering,
  MdOutlineWifiTethering,
  MdContactless,
  MdElectricalServices,
} from "react-icons/md";
import { fetchConnectionInfo, updateConnectionData } from "../tools/api";
import { useUser } from "../hooks/UserContext";
import { useDispositivos } from "../hooks/DispositivosContext";
import {
  DataEntry,
  DeviceDataEntry,
  Dispositivo,
} from "../types/DispositivoTypes";
import { database } from "../../firebaseConfig";
import { ref, onValue, off, set, get } from "firebase/database";

function Home() {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(
    null
  );
  const [loaded, setLoaded] = useState<boolean>(false);
  const { selectThemeClass } = useTheme();
  const navigate = useNavigate();
  const { currentUser, logout } = useUser();
  const { dispositivos, setDispositivos } = useDispositivos();
  const [showDispositivos, setShowDispositivos] = useState<boolean>(false);
  const [openDispositivo, setOpenDispositivo] = useState<false>(false);
  const [selectedDispositivo, setSelectedDispositivo] =
    useState<Dispositivo | null>(null);

  const handleToggle = (id: string) => {
    setOpenDispositivo(!openDispositivo);
    setSelectedDispositivo(dispositivos.find((item) => item.id == id));
  };

  const handleClick = useCallback(
    async (
      device: DeviceDataEntry,
      dispositivoId: string,
      deviceId: string
    ) => {
      const updatedState = !device.status;

      // Reference to the specific device state in Firebase
      const deviceStateRef = ref(
        database,
        `dispositivos/${dispositivoId}/data/devices/${deviceId}/status`
      );

      try {
        // Update the state in Firebase
        await set(deviceStateRef, updatedState);
        console.log("Status updated successfully");

        // Explicitly refetch the updated data
        const dispositivosRef = ref(database, "dispositivos");
        const snapshot = await get(dispositivosRef);
        const data = snapshot.val();
        if (data) {
          const dispositivosArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setDispositivos(dispositivosArray); // This will trigger a re-render
        }
      } catch (error) {
        console.error("Error updating status:", error);
      }
    },
    [setDispositivos]
  );

  useEffect(() => {
    const dispositivosRef = ref(database, "dispositivos");
    console.log(dispositivos);

    const handleValueChange = (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        const dispositivosArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setDispositivos(dispositivosArray);
      } else {
        setDispositivos([]);
      }
    };

    onValue(dispositivosRef, handleValueChange);

    return () => {
      off(dispositivosRef, "value", handleValueChange); // Cleanup the listener
    };
  }, [setDispositivos]);

  useEffect(() => {
    if (selectedDispositivo) {
      setSelectedDispositivo(
        dispositivos.find((el) => el.id === selectedDispositivo.id)
      );
    }
  }, [dispositivos]);

  useEffect(() => {
    //console.log(selectedDispositivo);
  }, [selectedDispositivo]);

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
          icon={
            <MdLogout
              fill={selectThemeClass("#000", "#fff")}
              size={35}
            ></MdLogout>
          }
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
            className={`flex w-5/6 rounded-2xl flex-col py-4 align-center justify-center items-center ${selectThemeClass(
              "bg-gray-100",
              "bg-gray-900"
            )}`}
          >
            {dispositivos.length > 0 &&
              dispositivos.map((dispositivo) => (
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
                      <div className="flex flex-col mt-4">
                        <div className="flex flex-col items-center align-center justify-center my-2">
                          <p
                            className={`${selectThemeClass(
                              "text-black",
                              "text-white"
                            )} text-md font-bold text-center`}
                          >
                            {dispositivo.data.info.lastConnectionTime && (
                              <span>
                                Ultima conexion:{" "}
                                {new Date(
                                  dispositivo.data.info.lastConnectionTime
                                ).toLocaleTimeString("es-ES", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: false, // 24-hour format
                                })}
                                {", "}
                                {new Date(
                                  dispositivo.data.info.lastConnectionTime
                                ).toLocaleString("es-ES", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}
                              </span>
                            )}
                          </p>{" "}
                        </div>
                        <div className="flex flex-col items-center align-center justify-center my-2">
                          {dispositivo.data.info.apMode ? (
                            <MdOutlineWifiTethering
                              fill={selectThemeClass("#000", "#fff")}
                              size={30}
                            ></MdOutlineWifiTethering>
                          ) : (
                            <MdWifi
                              fill={selectThemeClass("#000", "#fff")}
                              size={30}
                            ></MdWifi>
                          )}
                          {dispositivo.data.info.apMode ? (
                            <p
                              className={`${selectThemeClass(
                                "text-black",
                                "text-white"
                              )} text-xl font-bold text-center`}
                            >
                              AP creado: {dispositivo.data.info.ssid}
                            </p>
                          ) : (
                            <p
                              className={`${selectThemeClass(
                                "text-black",
                                "text-white"
                              )} text-xl font-bold text-center`}
                            >
                              Conectado a la red: {dispositivo.data.info.ssid}
                            </p>
                          )}
                          <p
                            className={`${selectThemeClass(
                              "text-black",
                              "text-white"
                            )} text-md font-bold text-center`}
                          >
                            IP local: {dispositivo.data.info.ip}
                          </p>
                        </div>
                        <div className="flex flex-col items-center align-center justify-center my-2">
                          <p
                            className={`${selectThemeClass(
                              "text-black",
                              "text-white"
                            )} text-xl font-bold text-center`}
                          >
                            Ubicado en: {dispositivo.data.info.salaName}
                          </p>
                          <p
                            className={`${selectThemeClass(
                              "text-black",
                              "text-white"
                            )} text-md font-bold text-center`}
                          >
                            Con firmware: {dispositivo.data.info.firmware}
                          </p>
                          <button
                            onClick={() => {
                              setShowDispositivos(!showDispositivos);
                              setOpenDispositivo(false);
                            }}
                            className={`${selectThemeClass(
                              "bg-sky-400 text-black",
                              "bg-sky-600 text-white"
                            )} text-md mt-4 font-bold rounded-xl p-2 px-6 text-center flex justify-center items-center`}
                          >
                            {!showDispositivos ? `Ver` : `Ocultar`} dispositivos
                            conectados
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              ))}
          </div>
          {showDispositivos && (
            <div
              className={`flex w-5/6 rounded-2xl mt-4 flex-col align-center justify-center items-center ${selectThemeClass(
                "bg-gray-100",
                "bg-gray-900"
              )}`}
            >
              <div className="flex flex-col items-center align-center justify-center my-2">
                <p
                  className={`${selectThemeClass(
                    "text-black",
                    "text-white"
                  )} text-lg font-bold text-center`}
                >
                  Dispositivos conectados a{" "}
                  <a
                    onClick={() => {
                      !openDispositivo && handleToggle(selectedDispositivo?.id);
                    }}
                    className={`underline`}
                  >
                    Placa {selectedDispositivo?.id}
                  </a>
                </p>
              </div>
              {selectedDispositivo?.data.devices.map(
                (device: DeviceDataEntry, index: number) => (
                  <div
                    key={index} // Use index as key or a unique identifier if available
                    className={`${selectThemeClass(
                      "bg-gray-300",
                      "bg-gray-800"
                    )} text-md font-bold text-center flex flex-col p-4 m-2 rounded-lg items-center align-center justify-center`}
                    onClick={() => {
                      console.log(device);
                      handleClick(device, selectedDispositivo.id, index);
                    }}
                  >
                    {device.deviceType === "ir" && (
                      <MdContactless
                        fill={selectThemeClass("#000", "#fff")}
                        size={50}
                        className="mb-2"
                      />
                    )}
                    {device.deviceType === "relay" && (
                      <MdElectricalServices
                        fill={selectThemeClass("#000", "#fff")}
                        size={50}
                        className="mb-2"
                      />
                    )}
                    <p>
                      <strong>Nombre:</strong> {device.name}
                    </p>
                    <p>
                      <strong>Estado:</strong> {device.status ? "On" : "Off"}
                    </p>
                    {device.status ? (
                      <MdToggleOn fill={"#04F804"} size={30} />
                    ) : (
                      <MdToggleOff
                        fill={selectThemeClass("#000", "#fff")}
                        size={30}
                      />
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
        <div className="h-1/6 flex items-center justify-center align-center">
          <GoToButton
            fnGoTo={handleGoToSettings}
            goToSectionTitle="Configuracion"
            icon={
              <MdSettings
                fill={selectThemeClass("#000", "#fff")}
                size={30}
              ></MdSettings>
            }
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
