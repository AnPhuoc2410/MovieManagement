import React from "react";

const Register = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-xl font-semibold text-center mb-6 bg-gray-400 p-3 rounded-t-lg">
          Đăng ký tài khoản
        </h1>
        <form>
          <div className="grid grid-cols-2 gap-4">
            {/* Tài khoản */}
            <div className="col-span-2">
              <label className="block mb-2 font-semibold">Tài khoản *</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Mật khẩu */}
            <div className="col-span-2">
              <label className="block mb-2 font-semibold">Mật khẩu *</label>
              <input
                type="password"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Họ tên */}
            <div className="col-span-2">
              <label className="block mb-2 font-semibold">Họ tên *</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Ngày sinh */}
            <div className="col-span-2">
              <label className="block mb-2 font-semibold">Ngày sinh *</label>
              <input
                type="date"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Giới tính */}
            <div className="col-span-2">
              <label className="block mb-2 font-semibold">Giới tính *</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="Nam"
                    className="mr-2"
                  />
                  <label htmlFor="male">Nam</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="Nữ"
                    className="mr-2"
                  />
                  <label htmlFor="female">Nữ</label>
                </div>
              </div>
            </div>

            {/* CMND */}
            <div className="col-span-2">
              <label className="block mb-2 font-semibold">CMND *</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div className="col-span-2">
              <label className="block mb-2 font-semibold">Email *</label>
              <input
                type="email"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Địa chỉ */}
            <div className="col-span-2">
              <label className="block mb-2 font-semibold">Địa chỉ *</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* SDT */}
            <div className="col-span-2">
              <label className="block mb-2 font-semibold">
                Số điện thoại *
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

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
              Đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
