import { useAuth } from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

const ProfileSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = location.pathname.endsWith("/settings")
    ? "settings"
    : "profile";

  const getUserInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-100 bg-white border-r border-gray-200 min-h-screen">
      {/* User Info Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-lg font-medium">
            {user ? getUserInitials(user.fullName) : "U"}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {user?.fullName || "User"}
            </h3>
            <p className="text-sm text-gray-500">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => navigate("/profile")}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === "profile"
                  ? "bg-orange-50 text-orange-700 border border-orange-200"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Hồ sơ
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/profile/settings")}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === "settings"
                  ? "bg-orange-50 text-orange-700 border border-orange-200"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Cài đặt
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ProfileSidebar;
