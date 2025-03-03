import React from "react";
import { useParams } from "react-router-dom";

const ChiTietPhongChieu = () => {
  const { roomId } = useParams(); // Extract roomId from the URL

  return <div>Chi Tiết Phòng Chiếu: {roomId}</div>;
};

export default ChiTietPhongChieu;
