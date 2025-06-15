import { Link } from "react-router-dom";

const Header = () => (
  <header className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-900">FPTCareer</h1>
      </div>
      {/* Navigation */}
      <nav className="flex items-center space-x-8">
        <Link to="/" className="text-gray-600 hover:text-gray-900">
          Trang chủ
        </Link>
        <Link to="/chat" className="text-gray-600 hover:text-gray-900">
          Chat với AI
        </Link>
        <Link
          to="/login"
          className="inline-flex items-center px-4 py-2 border border-brand-500 text-brand-500 bg-white hover:bg-brand-50 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition"
        >
          Đăng nhập
        </Link>
        <Link
          to="/register"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition"
        >
          Đăng ký
        </Link>
      </nav>
    </div>
  </header>
);

export default Header;
