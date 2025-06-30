import React, { useState, useRef, useEffect } from "react";

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
    <div className="h-[calc(100vh-80px)] flex bg-gray-50">
      {/* Sidebar lịch sử chat */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
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
              >
                <span className="truncate block">{chat.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.from === "user"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBotPage;
