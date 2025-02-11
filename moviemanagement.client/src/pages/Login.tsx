import React from "react";
import { useNavigate } from "react-router";

const data = {
  username: "admin",
  password: "admin",
};

const Login = () => {
  const navigate = useNavigate();

  const switchToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="bg-gray-500 text-lg font-semibold mb-4">Đăng nhập</h2>
        <form>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={data.username}
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
              Đăng nhập
            </button>
            <button
              type="button"
              className="bg-gray-200 text-black px-4 py-2 rounded-md flex items-center hover:bg-gray-300 transition"
              onClick={switchToRegister}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
              Đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
