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
  MdClose,
  MdSupervisedUserCircle,
  MdAccountCircle,
  MdArrowBack,
  MdSettingsRemote,
  MdSignalCellular4Bar,
  MdSignalCellular3Bar,
  MdSignalCellular2Bar,
  MdSignalCellular1Bar,
  MdSignalCellular0Bar,
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
  const [openDispositivo, setOpenDispositivo] = useState<boolean>(false);
  const [selectedDispositivo, setSelectedDispositivo] =
    useState<Dispositivo | null>(null);

  const handleToggle = (id: string) => {
    setOpenDispositivo(!openDispositivo);
    setSelectedDispositivo(dispositivos.find((item) => item.id == id));
  };

  const handleClick = useCallback(
    async (device: DeviceDataEntry, dispositivoId: string) => {
      const updatedState = !device.status;

      // Construct the path for the update request
      const newDataRef = ref(database, `events/${dispositivoId}/newData`);

      try {
        // Write the update command to the `newData` section in Firebase
        await set(newDataRef, {
          section: `set/devices/${device.id}/status/${updatedState}`, // The URL with the updated state
          status: true, // Indicates that there is new data to be processed
        });

        console.log("Change request written to newData section");

        // Optionally refetch the data to ensure UI stays in sync
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
        console.error(
          "Error writing change request to newData section:",
          error
        );
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

  function signalStrengthIcon(signal) {
    if (signal >= -50) {
      return (
        <MdSignalCellular4Bar
          className="ml-2"
          size={22}
          fill={`${selectThemeClass("#000", "#fff")}`}
        />
      );
    } else if (signal >= -60) {
      return (
        <MdSignalCellular3Bar
          className="ml-2"
          size={22}
          fill={`${selectThemeClass("#000", "#fff")}`}
        />
      );
    } else if (signal >= -70) {
      return (
        <MdSignalCellular2Bar
          className="ml-2"
          size={22}
          fill={`${selectThemeClass("#000", "#fff")}`}
        />
      );
    } else if (signal >= -80) {
      return (
        <MdSignalCellular1Bar
          className="ml-2"
          size={22}
          fill={`${selectThemeClass("#000", "#fff")}`}
        />
      );
    } else {
      return (
        <MdSignalCellular0Bar
          className="ml-2"
          size={22}
          fill={`${selectThemeClass("#000", "#fff")}`}
        />
      );
    }
  }

  function renderDeviceCard(device: DeviceDataEntry, index: number) {
    return (
      <div
        key={index} // Use index as key or a unique identifier if available
        className={`${selectThemeClass(
          "bg-gray-300",
          "bg-gray-800"
        )} text-md font-bold text-center flex flex-col p-4 m-2 w-full rounded-lg items-center align-center justify-center`}
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
          <>
            <MdElectricalServices
              fill={
                device.status ? "#04F804" : selectThemeClass("#000", "#fff")
              }
              size={50}
              className="mb-2"
            />
            {device.status && (
              <p
                className={`${selectThemeClass(
                  "text-black",
                  "text-white"
                )} text-sm mb-2 -mt-3`}
              >
                Corriente: {Math.abs(device.currentConsumed)}A
              </p>
            )}
          </>
        )}
        <p>
          <strong>ID:</strong> {device.id}
        </p>
        <p>
          <strong>Nombre:</strong> {device.name}
        </p>
        {device.deviceType == "relay" && (
          <p>
            <strong>Estado:</strong> {device.status ? "ON" : "OFF"}
          </p>
        )}
        {device.deviceType == "relay" ? (
          device.status ? (
            <MdToggleOn fill={"#04F804"} size={30} />
          ) : (
            <MdToggleOff fill={selectThemeClass("#000", "#fff")} size={30} />
          )
        ) : (
          <MdSettingsRemote
            className="mt-2"
            fill={selectThemeClass("#000", "#fff")}
            size={30}
          />
        )}
      </div>
    );
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
        )} text-3xl font-bold text-center w-full flex flex-row justify-center items-center p-6`}
        style={{
          position: "relative",
        }}
      >
        <GoToButton
          goToSectionTitle={"Cerrar sesion"}
          fnGoTo={handleLogout}
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
          SICAE Control Web
        </span>
        <div
          className={`absolute right-10 mr-4 flex flex-row p-4 rounded-full align-center items-center justify-center ${selectThemeClass(
            "bg-gray-200 text-black",
            "bg-gray-800 text-white"
          )} `}
        >
          <MdAccountCircle
            size={35}
            fill={selectThemeClass("#000", "#fff")}
          ></MdAccountCircle>
          <p className={`text-xl font-bold text-center ml-1`}>
            {currentUser?.userEmail}
          </p>
        </div>
      </div>
      <div
        className={`flex flex-col w-full ${selectThemeClass(
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
            )} my-5`}
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
                            <div className="flex flex-row items-center align-center justify-center">
                              <p
                                className={`${selectThemeClass(
                                  "text-black",
                                  "text-white"
                                )} text-xl font-bold text-center flex flex-row`}
                              >
                                Conectado a la red: {dispositivo.data.info.ssid}
                              </p>
                              {signalStrengthIcon(
                                Math.abs(Number(dispositivo.data.info.connDBI))
                              )}
                            </div>
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
              className={`flex w-5/6 rounded-2xl mt-4 flex-col align-center justify-center items-center relative ${selectThemeClass(
                "bg-gray-100",
                "bg-gray-900"
              )}`}
            >
              <button
                onClick={() => {
                  setShowDispositivos(false);
                }}
                className="flex absolute right-5 top-5"
              >
                <MdClose
                  size={25}
                  fill={selectThemeClass("#000", "#fff")}
                ></MdClose>
              </button>
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
              <div className="flex flex-row my-2 w-full justify-evenly">
                <div className="flex flex-col items-center align-center justify-center w-1/2">
                  <p
                    className={`${selectThemeClass(
                      "text-black",
                      "text-white"
                    )} text-lg font-bold text-center w-full`}
                  >
                    Controlados por IR
                  </p>
                  <div className="flex flex-row items-center align-center justify-center">
                    {selectedDispositivo?.data.devices
                      .filter((el) => el.deviceType === "ir")
                      .map((device: DeviceDataEntry, index: number) =>
                        renderDeviceCard(device, index)
                      )}
                  </div>
                </div>
                <div className="flex flex-col items-center align-center justify-center w-1/2">
                  <p
                    className={`${selectThemeClass(
                      "text-black",
                      "text-white"
                    )} text-lg font-bold text-center w-full`}
                  >
                    Controlados por Rele
                  </p>
                  <div className="flex flex-row items-center align-center justify-center">
                    {selectedDispositivo?.data.devices
                      .filter((el) => el.deviceType === "relay")
                      .map((device: DeviceDataEntry, index: number) =>
                        renderDeviceCard(device, index)
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="h-1/6 flex items-center justify-center align-center my-5">
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
            )} p-4 flex-row rounded-full align-center items-center`}
          ></GoToButton>
        </div>
      </div>
    </div>
  );
}

export default Home;
