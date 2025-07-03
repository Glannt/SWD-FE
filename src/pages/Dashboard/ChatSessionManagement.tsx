import React, { useEffect, useState } from "react";
import { chatService } from "../../services/chat.service";
import { AdminChatSession } from "../../types/api";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/ui/table/index";
import { SidebarProvider } from "../../context/SidebarContext";
import AppSidebar from "../../layout/AppSidebar";

const ChatSessionManagement: React.FC = () => {
  const [sessions, setSessions] = useState<AdminChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    chatService
      .getAdminSessions()
      .then(setSessions)
      .catch(() => setError("Không thể tải danh sách chat session"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar cố định bên trái */}
        <div
          className="h-screen fixed left-0 top-0 z-30"
          style={{ width: 270 }}
        >
          <AppSidebar />
        </div>
        {/* Nội dung bên phải sidebar */}
        <div
          className="flex-1 flex flex-col ml-0 md:ml-[270px] min-h-screen"
          style={{ marginLeft: 270 }}
        >
          <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Quản lý Chat Sessions</h1>
            {loading ? (
              <div>Đang tải...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <div className="rounded-xl shadow bg-white p-4">
                  <Table className="min-w-full divide-y divide-gray-200">
                    <TableHeader>
                      <TableRow>
                        <TableCell
                          isHeader
                          className="py-3 px-4 text-left bg-gray-100 font-bold text-gray-700 rounded-tl-xl"
                        >
                          User ID
                        </TableCell>
                        <TableCell
                          isHeader
                          className="py-3 px-4 text-left bg-gray-100 font-bold text-gray-700"
                        >
                          Email
                        </TableCell>
                        <TableCell
                          isHeader
                          className="py-3 px-4 text-left bg-gray-100 font-bold text-gray-700"
                        >
                          Họ tên
                        </TableCell>
                        <TableCell
                          isHeader
                          className="py-3 px-4 text-left bg-gray-100 font-bold text-gray-700"
                        >
                          Session ID
                        </TableCell>
                        <TableCell
                          isHeader
                          className="py-3 px-4 text-left bg-gray-100 font-bold text-gray-700"
                        >
                          Created At
                        </TableCell>
                        <TableCell
                          isHeader
                          className="py-3 px-4 text-left bg-gray-100 font-bold text-gray-700 rounded-tr-xl"
                        >
                          Tag
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessions.length === 0 && (
                        <TableRow>
                          <TableCell
                            className="py-4 px-4 text-center"
                            colSpan={6}
                          >
                            Không có chat session nào.
                          </TableCell>
                        </TableRow>
                      )}
                      {sessions.map((user) =>
                        user.sessions.map((session) => (
                          <TableRow key={session.sessionId}>
                            <TableCell className="align-middle border-b border-gray-200 py-3 px-4">
                              {user.user_id}
                            </TableCell>
                            <TableCell className="align-middle border-b border-gray-200 py-3 px-4">
                              {user.email}
                            </TableCell>
                            <TableCell className="align-middle border-b border-gray-200 py-3 px-4">
                              {user.fullName}
                            </TableCell>
                            <TableCell className="align-middle border-b border-gray-200 font-mono text-xs py-3 px-4">
                              {session.sessionId}
                            </TableCell>
                            <TableCell className="align-middle border-b border-gray-200 text-sm py-3 px-4">
                              {session.createdAt}
                            </TableCell>
                            <TableCell className="align-middle border-b border-gray-200 py-3 px-4">
                              {session.tag == null ? (
                                <span className="italic text-gray-400">
                                  Không xác định
                                </span>
                              ) : (
                                session.tag
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ChatSessionManagement;
