import React, { createContext, useState, useEffect, useContext } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

interface SignalRContextType {
  connection: HubConnection | null;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  isConnected: boolean;
}

const SignalRContext = createContext<SignalRContextType>({
  connection: null,
  joinGroup: async () => {},
  leaveGroup: async () => {},
  isConnected: false,
});

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7119/seatHub")
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await newConnection.start();
        console.log("Connected to SignalR");
        setConnection(newConnection);
        setIsConnected(true);
      } catch (err) {
        console.error("Connection error:", err);
      }
    };

    startConnection();

    // Handle reconnection events
    newConnection.onclose(() => {
      console.log("Connection lost. Attempting to reconnect...");
      setIsConnected(false);
    });

    newConnection.onreconnected(() => {
      console.log("Reconnected to SignalR");
      setIsConnected(true);
    });

    return () => {
      if (newConnection) {
        newConnection.stop().then(() => console.log("SignalR Disconnected"));
      }
    };
  }, []);

  const joinGroup = async (groupId: string) => {
    if (connection && isConnected) {
      try {
        await connection.invoke("JoinShowTime", groupId);
      } catch (err) {
        console.error("Error joining ShowTime group:", err);
      }
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (connection && isConnected && groupId) {
      try {
        await connection.invoke("LeaveShowTime", groupId);
        console.log(`Left ShowTime group: ${groupId}`);
      } catch (err) {
        console.error("Error leaving ShowTime group:", err);
      }
    }
  };

  return (
    <SignalRContext.Provider value={{ connection, joinGroup, leaveGroup, isConnected }}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => useContext(SignalRContext);
