import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSignalR } from "../contexts/SignalRContext";

const TicketWrapper: React.FC = () => {
  const { connection, joinGroup, isConnected } = useSignalR();

  // Get showTimeId from sessionStorage
  const showTimeId = sessionStorage.getItem("currentShowTimeId") || "";

  useEffect(() => {
    if (isConnected && showTimeId) {
      joinGroup(showTimeId);
      console.log(`TicketWrapper joined group: ${showTimeId}`);
    }
    // Do not leave the group on unmount here so that the group remains active
    // until the entire /ticket section is exited.
  }, [isConnected, showTimeId, joinGroup]);

  return <Outlet />;
};

export default TicketWrapper;
