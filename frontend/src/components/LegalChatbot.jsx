import { useState, useEffect, useRef } from 'react';
import './LegalChatbot.css';
import ReactMarkdown from 'react-markdown';

function LegalChatbot({onClose}) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('legal-ai-chat');
    return saved ? JSON.parse(saved) : [];
  });
  const chatBoxRef = useRef(null);


  useEffect(() => {
      const storedMessages = localStorage.getItem('legal-ai-chat');
      if(storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
  }, []);

  useEffect(() => {
      localStorage.setItem('legal-ai-chat', JSON.stringify(messages));
      scrollBottom();
  }, [messages]);

  const scrollBottom = () => {
      if(chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
      }
  };

  const sendMessage = async () => {
    const question = input.trim();
    if (!question) return;

    setMessages((prev) => [...prev, { text: question, sender: 'user' }]);
    setInput('');

    try {
      const response = await fetch('https://localhost:7125/api/legal/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: question }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lỗi API: ${errorText}`);
      }

      const data = await response.json();

      // 🔍 Trích xuất phần trả lời từ cấu trúc phức tạp của Gemini
      const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!botReply) {
        setMessages((prev) => [...prev, { text: 'Không có câu trả lời từ AI.', sender: 'bot' }]);
      } else {
        setMessages((prev) => [...prev, { text: botReply, sender: 'bot' }]);
      }
    } catch (error) {
      console.error('Lỗi fetch:', error);
      setMessages((prev) => [...prev, { text: 'Lỗi server: ' + error.message, sender: 'bot' }]);
    }
  };

  return (
    <div className="chat-container">
        <div className="chat-header">
            <span>Luật sư AI</span>
            <div className="header-btns">
                <button className="clear-btn" onClick={() => {
                    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa tất cả tin nhắn?');
                    if (confirmDelete) {
                        localStorage.removeItem('legal-ai-chat');
                        setMessages([]);
                    }
                }}
                >
                    🗑
                </button>
                <button className="close-btn" onClick={onClose} aria-label="Đóng chatbox">✖</button>
            </div>
        </div>
        <div className="chat-box" ref={chatBoxRef}>
            {messages.map((msg, index) => (
            <div
                key={index}
                className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
            >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
        </div>

        <div className="chat-input">
            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Nhập câu hỏi..."
            />
            <button onClick={sendMessage}>Gửi</button>
        </div>
    </div>
  );
}

export default LegalChatbot;
