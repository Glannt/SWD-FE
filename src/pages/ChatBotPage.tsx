import React, { useState, useRef, useEffect } from "react";
import Header from "../components/layout/Header";

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
  const [selectedChat, setSelectedChat] = useState<number>(chatHistory[0].id);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Xin chào! Mình là chatbot tư vấn của FPT University. Bạn cần hỗ trợ gì?",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  return (
    <>
      <Header />
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar lịch sử chat */}
        <aside className="w-72 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Đoạn chat</h2>
          <ul>
            {chatHistory.map((chat) => (
              <li
                key={chat.id}
                className={`p-2 rounded cursor-pointer mb-1 transition font-medium ${
                  selectedChat === chat.id
                    ? "bg-orange-100 text-orange-700"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedChat(chat.id)}
              >
                {chat.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main chat area */}
        <main className="flex-1 flex flex-col h-full">
          {/* Header chat */}
          <header className="h-16 flex items-center px-6 border-b bg-white shadow-sm">
            <span className="text-xl font-semibold text-gray-800">
              {chatHistory.find((c) => c.id === selectedChat)?.name}
            </span>
          </header>
          {/* Nội dung chat */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-2">
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
          </div>
          {/* Ô nhập chat (tùy chọn, có thể thêm sau) */}
          <div className="flex items-center gap-2 mt-4">
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
        </main>
      </div>
    </>
  );
};

export default ChatBotPage;
