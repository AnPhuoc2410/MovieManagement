import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

interface SeatInfo {
  id: string;
  name: string;
  version: string;
  ticketId: string;
}

const TestConnection: React.FC = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [connectionState, setConnectionState] = useState<string>("Disconnected");
  const [messages, setMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [selectedSeats, setSelectedSeats] = useState<Record<string, SeatInfo>>({});

  // Sample seats for testing
  const seatIds = ["A1", "A2", "A3", "B1", "B2", "B3"];

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7119/seatSelectionHub')
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setConnection(newConnection);

    return () => {
    if (connection) {
      connection.stop();
    }
  };
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          setConnectionState("Connected");
          console.log('Connected to SignalR hub');

          // Handler for receiving messages
          connection.on('ReceiveMessage', (message: string) => {
            setMessages(prevMessages => [...prevMessages, `Received: ${message}`]);
          });

          // Handler for seat selection by other users
          connection.on('SeatSelected', (seatInfo: SeatInfo) => {
            setMessages(prevMessages => [...prevMessages, `Seat ${seatInfo.id} selected by ${seatInfo.name}`]);
            setSelectedSeats(prev => ({...prev, [seatInfo.id]: seatInfo}));
          });

          // Handler for seat deselection by other users
          connection.on('SeatDeselected', (seatId: string) => {
            setMessages(prevMessages => [...prevMessages, `Seat ${seatId} deselected`]);
            setSelectedSeats(prev => {
              const updated = {...prev};
              delete updated[seatId];
              return updated;
            });
          });
        })
        .catch(e => {
          setConnectionState("Failed to connect");
          console.log('Connection failed: ', e);
        });

      // Update connection state when it changes
      connection.onclose(() => setConnectionState("Disconnected"));
      connection.onreconnecting(() => setConnectionState("Reconnecting..."));
      connection.onreconnected(() => setConnectionState("Connected"));
    }
  }, [connection]);

  const sendMessage = async () => {
    if (connection && messageInput) {
      try {
        await connection.invoke("SendMessage", messageInput);
        setMessages(prevMessages => [...prevMessages, `Sent: ${messageInput}`]);
        setMessageInput("");
      } catch (e) {
        console.error("Error sending message:", e);
      }
    }
  };

  const toggleSeat = async (seatId: string) => {
    if (!connection) return;

    try {
      if (selectedSeats[seatId]) {
        // Deselect seat
        await connection.invoke("DeselectSeat", seatId);
        setSelectedSeats(prev => {
          const updated = {...prev};
          delete updated[seatId];
          return updated;
        });
        setMessages(prevMessages => [...prevMessages, `You deselected seat ${seatId}`]);
      } else {
        // Select seat
        const seatInfo: SeatInfo = {
          id: seatId,
          name: "Current User",
          version: "1.0",
          ticketId: `ticket-${Date.now()}`
        };

        await connection.invoke("SelectSeat", seatInfo);
        setSelectedSeats(prev => ({...prev, [seatId]: seatInfo}));
        setMessages(prevMessages => [...prevMessages, `You selected seat ${seatId}`]);
      }
    } catch (e) {
      console.error("Error toggling seat:", e);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>SignalR Test Connection</h1>

      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Connection Status: <span style={{
          color: connectionState === 'Connected' ? 'green' :
                 connectionState === 'Reconnecting...' ? 'orange' : 'red'
        }}>{connectionState}</span></h3>
      </div>

      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Send Message</h3>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', color: 'black' }}>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            style={{ flex: 1, padding: '8px', color: 'black' }}
            placeholder="Type a message"
          />
          <button
            onClick={sendMessage}
            disabled={!connection || connectionState !== "Connected"}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Send
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Seat Selection Demo</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
          {seatIds.map((seatId) => (
            <div
              key={seatId}
              onClick={() => toggleSeat(seatId)}
              style={{
                width: '60px',
                height: '60px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: selectedSeats[seatId] ? '#f44336' : '#4caf50',
                color: 'white',
                borderRadius: '5px',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              {seatId}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Messages:</h3>
        <div style={{ maxHeight: '300px', overflowY: 'auto', color: 'black' }}>
          {messages.length === 0 ? (
            <p>No messages yet</p>
          ) : (
            <ul style={{ paddingLeft: '20px' }}>
              {messages.map((message, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>{message}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestConnection;
