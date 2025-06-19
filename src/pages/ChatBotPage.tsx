import React, { useState, useRef, useEffect } from "react";

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      {/* Header cam */}
      <div className="w-full max-w-2xl rounded-t-xl bg-orange-500 flex items-center px-6 py-3 gap-4 shadow-lg">
        {/* <img src="/public/images/logo/logo.svg" alt="logo" className="h-10" /> */}
        <span className="text-white text-xl font-semibold flex-1">
          FPT Career Chatbot
        </span>
        <span className="text-white text-sm">
          ✉️ Email: daihocfpt@fpt.edu.vn
        </span>
      </div>
      {/* Khung chat */}
      <div className="w-full max-w-2xl bg-white rounded-b-xl shadow-lg flex flex-col flex-1 min-h-[500px] pb-4 px-4 pt-4 overflow-y-auto">
        <div className="flex flex-col gap-4 flex-1">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-xl px-4 py-3 max-w-[80%] whitespace-pre-line text-base shadow-sm ${
                  msg.from === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-100 text-gray-800 self-start"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Input */}
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
      </div>
    </div>
  );
};

export default ChatBotPage;
