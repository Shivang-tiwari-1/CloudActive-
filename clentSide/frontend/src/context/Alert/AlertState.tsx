import React, { useContext, useState, type ReactNode, useEffect } from "react";
import type { AlertType } from "./AlertContext";
import AlertContext from "./AlertContext";

interface AlertStateProps {
  children: ReactNode;
}

const AlertState: React.FC<AlertStateProps> = ({ children }) => {
  const [alert, setAlert] = useState<AlertType | null>(null);

  const showAlert = (message: string, type: AlertType["type"]) => {
    setAlert({ message, type });

    setTimeout(() => {
      setAlert(null);
    }, 2000); // alert visible for 2 seconds
  };

  // Tailwind styled alert component
  const Alert = () => {
    const { alert } = useContext(AlertContext);

    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        {alert && (
          <div
            className={`flex items-center px-4 py-3 rounded-lg shadow-md transition-all duration-300
              ${alert.type === "success" ? "bg-green-500 text-white" : ""}
              ${alert.type === "danger" ? "bg-red-500 text-white" : ""}
              ${alert.type === "warning" ? "bg-yellow-400 text-gray-900" : ""}
            `}
          >
            <span className="font-medium">{alert.message}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      {children}
      <Alert />
    </AlertContext.Provider>
  );
};

export default AlertState;
