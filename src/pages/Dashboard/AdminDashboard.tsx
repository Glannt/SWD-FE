import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
// import { SidebarProvider } from "../../context/SidebarContext";
import { FiSearch } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useAuth } from "../../hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchSummary,
  fetchSessions,
  fetchChatUsers,
} from "../../services/admin-dashboard.service";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [sessions, setSessions] = useState<Record<string, unknown>[]>([]);
  const [chatUsers, setChatUsers] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchSummary()
      .then((data) => setSummary(data))
      .catch((err) => {
        console.error("Không thể tải dữ liệu thống kê", err);
      });
    fetchSessions()
      .then((data) => setSessions(data))
      .catch((err) => {
        console.error("Không thể tải danh sách session chat", err);
      });
    fetchChatUsers()
      .then((data) => setChatUsers(data))
      .catch((err) => {
        console.error("Không thể tải danh sách user đã chat", err);
      });
  }, []);

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-8">
      {/* Topbar cố định phía trên */}
      <div
        className="sticky top-0 z-20 bg-white border-b border-gray-200 flex items-center justify-between px-8"
        style={{ height: 72, minHeight: 72 }}
      >
        <div className="flex items-center gap-3 w-1/2">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FiSearch size={18} />
            </span>
            <input
              type="text"
              placeholder="Search or type command..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
              ⌘ K
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <IoMdNotificationsOutline size={22} className="text-gray-500" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          {/* User info dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${
                isDropdownOpen ? "border-orange-500" : "border-transparent"
              } hover:border-orange-500 transition bg-white`}
            >
              <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center text-lg font-medium">
                {user ? getInitials(user.fullName) : "U"}
              </div>
              <span className="font-medium text-gray-700 whitespace-nowrap">
                {user?.fullName || "User"}
              </span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100">
                <button
                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 gap-2"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/profile");
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Hồ sơ
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 gap-2"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/settings");
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Cài đặt
                </button>
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 gap-2 border-t border-gray-100 mt-1"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Main content nằm dưới topbar */}
      <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
        {/* Thống kê tổng quan dạng card đẹp */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Thống kê tổng quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Card tổng số lượt truy cập */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-xl mb-3">
                <svg
                  className="w-7 h-7 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12a9 9 0 1118 0 9 9 0 01-18 0zm9-4v4l3 3"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {String(summary?.totalVisits ?? "--")}
              </div>
              <div className="mt-2 text-gray-500">Tổng lượt truy cập</div>
            </div>
            {/* Card tổng số user đã chat */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-xl mb-3">
                <svg
                  className="w-7 h-7 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold text-indigo-600">
                {String(summary?.totalUsersChatted ?? "--")}
              </div>
              <div className="mt-2 text-gray-500">User đã chat</div>
            </div>
            {/* Card tổng số session chat */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-xl mb-3">
                <svg
                  className="w-7 h-7 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M9 20H4v-2a3 3 0 015.356-1.857M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold text-purple-600">
                {String(summary?.totalSessions ?? "--")}
              </div>
              <div className="mt-2 text-gray-500">Session chat</div>
            </div>
            {/* Card placeholder hoặc số liệu khác nếu có */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-xl mb-3">
                <svg
                  className="w-7 h-7 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold text-green-600">--</div>
              <div className="mt-2 text-gray-500">Số liệu khác</div>
            </div>
          </div>
        </div>
        {/* Biểu đồ và bảng đẹp như ecommerce */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 flex flex-col gap-6">
            <StatisticsChart />
            <MonthlySalesChart />
          </div>
          <div className="col-span-1 flex flex-col gap-6">
            <MonthlyTarget />
          </div>
        </div>
        {/* Bảng session chat */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">Danh sách session chat</h2>
          <div className="overflow-x-auto rounded-xl shadow bg-white">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 border-b text-left">User</th>
                  <th className="py-2 px-4 border-b text-left">Session ID</th>
                  <th className="py-2 px-4 border-b text-left">Tag</th>
                </tr>
              </thead>
              <tbody>
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4">
                      Không có session nào.
                    </td>
                  </tr>
                ) : (
                  sessions
                    .filter((s) => s && typeof s === "object")
                    .map((s, idx) => {
                      const session = s as Record<string, unknown>;
                      if (!session) return null;
                      return (
                        <tr key={idx}>
                          <td className="py-2 px-4 border-b">
                            {String(session.userName || session.user_id || "-")}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {String(
                              session.sessionId || session.session_id || "-"
                            )}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {String(session.tag || "-")}
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Bảng user đã chat */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">User đã từng chat</h2>
          <div className="overflow-x-auto rounded-xl shadow bg-white">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 border-b text-left">Họ tên</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {chatUsers.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-4">
                      Không có user nào.
                    </td>
                  </tr>
                ) : (
                  chatUsers
                    .filter((u) => u && typeof u === "object")
                    .map((u, idx) => {
                      const user = u as Record<string, unknown>;
                      if (!user) return null;
                      return (
                        <tr key={idx}>
                          <td className="py-2 px-4 border-b">
                            {String(
                              user.fullName || user.name || user.user_id || "-"
                            )}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {String(user.email || "-")}
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
