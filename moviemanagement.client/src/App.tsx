import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import AuthContainer from "./pages/auth/AuthContainer";
import Home from "./pages/Home";
import Promotion from "./pages/promotion/Promotion";
import PromotionDetail from "./pages/promotion/PromotionDetail";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthContainer />} />
          <Route path="/promotions" element={<Promotion />} />
          <Route path="/promotions/:id" element={<PromotionDetail />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
