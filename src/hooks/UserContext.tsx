import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserInfo } from "../types/APITypes";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {auth} from "./../../firebaseConfig.ts"

// Tipo para el contexto de usuario
interface UserContextType {
  currentUser: UserInfo | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// Crear el contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }:{children:ReactNode}) => {
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          //@ts-ignore
          userEmail: user.email,
          userPassword: '', // Do not store password here, this is just for example
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email:string, password:string) => {
    return signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      if (userCredential.user) {
        setCurrentUser({
          //@ts-ignore
          userEmail: userCredential.user.email,
          userPassword: "",
        });
      }
    });
  };

  const logout = () => {
    return signOut(auth).then(() => {
      setCurrentUser(null);
    });
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout }}>
      {!loading && children}
    </UserContext.Provider>
  );
};
