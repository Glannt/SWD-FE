import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

// Mock data cho lịch sử chat
const chatHistory = [
  { id: 1, name: "Lò sấy cao tần" },
  { id: 2, name: "Keo sữa và xúc tác" },
  { id: 3, name: "Các loại vải áo dài" },
  { id: 4, name: "Vải Umi là gì" },
  { id: 5, name: "Tối ưu chính sách bảo mật" },
  { id: 6, name: "Tổng hợp khảo sát du lịch" },
  { id: 7, name: "Trích xuất nội dung web" },
  { id: 8, name: "Du lịch công nghệ và cá nhân hóa" },
  { id: 9, name: "Tính vải may đồng phục" },
];

type ChatMessage = { from: "bot" | "user"; text: string };
const mockChatContent: Record<number, ChatMessage[]> = {
  1: [
    { from: "bot", text: "Xin chào! Bạn cần tư vấn về lò sấy cao tần?" },
    { from: "user", text: "Vâng, cho mình hỏi về nguyên lý hoạt động." },
  ],
  2: [{ from: "bot", text: "Bạn muốn biết về keo sữa hay xúc tác?" }],
  // ... các đoạn chat khác
};

const mockBotReply = (userMsg: string) => {
  // Giả lập trả lời của bot
  if (userMsg.toLowerCase().includes("nước cam")) {
    return (
      "Chào bạn, mình là chatbot tư vấn nghề nghiệp của FPT University. Rất tiếc, thông tin mình có hiện tại tập trung vào các chương trình học, học phí và các ngành đào tạo tại trường. Mình chưa được trang bị kiến thức về cách pha nước cam 🍊.\n\n" +
      "Tuy nhiên, nếu bạn có bất kỳ thắc mắc nào về các ngành học như Công nghệ thông tin, Quản trị kinh doanh, Công nghệ truyền thông hoặc các vấn đề liên quan đến học phí tại FPT University, mình rất sẵn lòng hỗ trợ! 😊\n\n" +
      "Nếu bạn cần thêm thông tin, đừng ngần ngại liên hệ nhé:\n" +
      "📞 Hotline: (024) 7300 1866\n" +
      "✉️ Email: daihocfpt@fpt.edu.vn"
    );
  }
  return "Xin chào! Mình là chatbot tư vấn của FPT University. Bạn cần hỗ trợ gì?";
};

const ChatBotPage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [selectedChat, setSelectedChat] = useState<number>(chatHistory[0].id);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Xin chào! Mình là chatbot tư vấn của FPT University. Bạn cần hỗ trợ gì?",
    },
  ]);
  const [input, setInput] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((msgs) => [...msgs, { from: "user", text: userMsg }]);
    setInput("");
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: mockBotReply(userMsg) },
      ]);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar lịch sử chat - có thể collapse */}
      <aside
        className={`${
          sidebarCollapsed ? "w-16" : "w-72"
        } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* Header sidebar với toggle button */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && (
            <h2 className="text-lg font-bold text-gray-800">Đoạn chat</h2>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={sidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          >
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform ${
                sidebarCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Chat history list */}
        <div className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {chatHistory.map((chat) => (
              <li
                key={chat.id}
                className={`p-2 rounded cursor-pointer transition font-medium ${
                  selectedChat === chat.id
                    ? "bg-orange-100 text-orange-700"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => setSelectedChat(chat.id)}
                title={sidebarCollapsed ? chat.name : undefined}
              >
                {sidebarCollapsed ? (
                  <div className="flex justify-center">
                    <span className="text-lg">💬</span>
                  </div>
                ) : (
                  <span className="truncate block">{chat.name}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* User section at bottom */}
        {isAuthenticated && (
          <div className="border-t border-gray-200 p-4">
            <div className="relative" ref={userDropdownRef}>
              {/* User info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {user ? getUserInitials(user.fullName) : "U"}
                  </div>

                  {/* User name - hidden when collapsed */}
                  {!sidebarCollapsed && (
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {user?.fullName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Settings button */}
                {!sidebarCollapsed && (
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                    title="Cài đặt"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
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
                  </button>
                )}
              </div>

              {/* Dropdown menu - appears above */}
              {isUserDropdownOpen && !sidebarCollapsed && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  {/* Settings */}
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <svg
                      className="w-4 h-4 mr-3"
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

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-1"></div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col">
        {/* Header chat */}
        <header className="h-16 flex items-center px-6 border-b bg-white shadow-sm flex-shrink-0">
          <span className="text-xl font-semibold text-gray-800">
            {chatHistory.find((c) => c.id === selectedChat)?.name}
          </span>
        </header>

        {/* Chat messages area - có max height và scroll */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2 min-h-0">
          {(
            mockChatContent[selectedChat] || [
              { from: "bot", text: "Chưa có nội dung chat cho chủ đề này." },
            ]
          ).map((msg: ChatMessage, idx: number) => (
            <div
              key={idx}
              className={`max-w-[70%] px-4 py-2 rounded-lg shadow text-base font-sans ${
                msg.from === "user"
                  ? "bg-orange-500 text-white self-end"
                  : "bg-gray-200 text-gray-800 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area - fixed at bottom */}
        <div className="p-4 border-t bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Nhập câu hỏi của bạn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full transition"
              onClick={handleSend}
            >
              Gửi
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatBotPage;
