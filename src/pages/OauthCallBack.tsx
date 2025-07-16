import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const user = params.get("user"); // Không cần dùng nếu đã có refreshUser

    if (accessToken && user) {
      const testUser = JSON.parse(user);
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("user", JSON.stringify(testUser));
      refreshUser().then(() => {
        navigate("/");
      });
    } else {
      navigate("/login");
    }
  }, [refreshUser, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <span className="text-lg font-semibold">Đang đăng nhập...</span>
    </div>
  );
};

export default OAuthCallback;
