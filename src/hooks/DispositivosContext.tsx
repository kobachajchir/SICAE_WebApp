import React, { useEffect, useState, useContext, createContext, ReactNode } from "react";
import { ref, onValue, off } from "firebase/database";
import { database } from "../../firebaseConfig";
import { Dispositivo, DispositivosContextProps } from "../types/DispositivoTypes";

const DispositivosContext = createContext<DispositivosContextProps | undefined>(undefined);

export const DispositivosProvider = ({ children }:{children:ReactNode}) => {
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);

  useEffect(() => {
    const dispositivosRef = ref(database, 'dispositivos');

    const handleValueChange = (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        const dispositivosArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setDispositivos(dispositivosArray);
      } else {
        setDispositivos([]);
      }
    };

    onValue(dispositivosRef, handleValueChange);

    return () => {
      off(dispositivosRef, 'value', handleValueChange);
    };
  }, []);

  return (
    <DispositivosContext.Provider value={{ dispositivos, setDispositivos }}>
      {children}
    </DispositivosContext.Provider>
  );
};

export const useDispositivos = () => {
  const context = useContext(DispositivosContext);
  if (!context) {
    throw new Error("useDispositivos must be used within a DispositivosProvider");
  }
  return context;
};
