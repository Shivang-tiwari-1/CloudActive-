import { createContext } from "react";

export interface AlertType {
  message: string;
  type: "success" | "danger" | "warning" | "info";
}

export interface AlertContextType {
  alert: AlertType | null;
  showAlert: (message: string, type: AlertType["type"]) => void;
}

const AlertContext = createContext<AlertContextType>({
  alert: null,
  showAlert: () => {},
});

export default AlertContext;
