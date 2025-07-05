import { Outlet } from "react-router-dom";
import ProfileSidebar from "../components/profile/ProfileSidebar";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <ProfileSidebar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
