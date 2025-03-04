import React from "react";
import { useParams } from "react-router";

const ChiTietDatVe = () => {
  const { bId } = useParams();

  return (
    <div>
      <h1>Chi tiết đặt vé</h1>
      <p>Booking ID: {bId}</p>
    </div>
  );
};

export default ChiTietDatVe;
