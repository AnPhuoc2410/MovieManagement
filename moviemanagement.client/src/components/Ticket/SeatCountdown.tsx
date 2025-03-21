import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventSeatIcon from '@mui/icons-material/EventSeat';

interface SeatCountdownProps {
  seatId: string;
  seatName: string;
  startTime: number; // initial start time in milliseconds
  resetTrigger: number; // changes whenever seats are added/removed
  onTimeout: (seatId: string) => void;
}

const SeatCountdown: React.FC<SeatCountdownProps> = ({ seatId, seatName, startTime, resetTrigger, onTimeout }) => {
  // When seatId or resetTrigger changes, update sessionStorage and reset countdown.
  const [localStartTime, setLocalStartTime] = useState<number>(startTime);
  const totalTime = 60; // total time in seconds (5 minutes)

  useEffect(() => {
    // Reset the countdown whenever resetTrigger changes.
    const newStartTime = Date.now();
    sessionStorage.setItem(`seatCountdown_${seatId}`, newStartTime.toString());
    setLocalStartTime(newStartTime);
  }, [seatId, resetTrigger]);

  // Calculate end time based on the (possibly updated) localStartTime.
  const endTime = localStartTime + 60000; // 5 minutes in milliseconds

  const [timeLeft, setTimeLeft] = useState<number>(Math.max(0, Math.floor((endTime - Date.now()) / 1000)));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        sessionStorage.removeItem(`seatCountdown_${seatId}`);
        onTimeout(seatId);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, seatId, onTimeout]);

  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  // Calculate progress percentage (from 100 to 0)
  const progress = (timeLeft / totalTime) * 100;

  // Determine color based on remaining time
  let color = '#4caf50'; // green
  let textColor = '#4caf50';
  if (timeLeft < 60) {
    color = '#f44336'; // red
    textColor = '#f44336';
  } else if (timeLeft < 120) {
    color = '#ff9800'; // orange/warning
    textColor = '#ff9800';
  }

  // Use a more prominent timer display if seatName suggests multiple seats
  const isMultiSeat = seatName.includes("ghế");

  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: isMultiSeat ? '12px 20px' : '8px 12px',
        borderRadius: '16px',
        backgroundColor: 'rgba(30, 30, 40, 0.8)',
        width: isMultiSeat ? '180px' : 'fit-content',
        border: `1px solid ${color}`,
        transition: 'all 0.3s ease',
        boxShadow: `0 0 12px ${color}30`,
        '&:hover': {
          boxShadow: `0 0 16px ${color}70`,
        }
      }}
    >
      <Box sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mr: 1.5,
        transform: isMultiSeat ? 'scale(1.2)' : 'scale(1)'
      }}>
        <CircularProgress
          variant="determinate"
          value={progress}
          size={isMultiSeat ? 52 : 44}
          thickness={4}
          sx={{ color }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isMultiSeat ? (
            <EventSeatIcon sx={{ fontSize: '1.5rem', color: textColor }} />
          ) : (
            <AccessTimeIcon sx={{ fontSize: '1.3rem', color: textColor }} />
          )}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="caption"
          sx={{ opacity: 0.8, color: 'white', fontSize: isMultiSeat ? '0.9rem' : '0.75rem' }}
        >
          {seatName}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 'bold',
            fontFamily: 'monospace',
            fontSize: isMultiSeat ? '1.4rem' : '1.1rem',
            color: textColor,
            letterSpacing: '0.05em',
            animation: timeLeft < 60 ? 'pulse 1s infinite' : 'none',
            '@keyframes pulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.7 },
              '100%': { opacity: 1 },
            }
          }}
        >
          {timeString}
        </Typography>
      </Box>
    </Paper>
  );
};

export default SeatCountdown;
