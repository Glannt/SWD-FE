import { Outlet } from "react-router-dom";
import AppSidebar from "../../layout/AppSidebar";

const SIDEBAR_WIDTH = 290; // px, đồng bộ với AppSidebar

const AdminPage = () => (
  <div className="min-h-screen flex bg-gray-50">
    {/* Sidebar cố định */}
    <div
      className="h-screen fixed left-0 top-0 z-30"
      style={{ width: SIDEBAR_WIDTH }}
    >
      <AppSidebar />
    </div>
    {/* Nội dung chính */}
    <main
      className="flex-1 ml-0 md:ml-[290px] min-h-screen transition-all"
      style={{ marginLeft: SIDEBAR_WIDTH }}
    >
      <Outlet />
    </main>
  </div>
);

export default AdminPage;
