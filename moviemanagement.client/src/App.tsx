import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Promotion from "./pages/promotion/Promotion";
import PromotionDetail from "./pages/promotion/PromotionDetail";
import Ticket from "./pages/ticket/Ticket";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/promotions" element={<Promotion />} />
        <Route path="/promotions/:id" element={<PromotionDetail />} />
        <Route path="/ticket/:id" element={<Ticket />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
