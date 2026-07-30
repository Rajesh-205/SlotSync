import { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I'm KineticAge AI. How can I help you today?",
    },
  ]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
    ]);

    setMessage("");

    try {
      const res = await axios.post("/api/chatbot", {
        message: userMessage,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, AI is currently unavailable.",
        },
      ]);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          background: "#2563eb",
          color: "#fff",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        💬
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "320px",
            height: "420px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 0 12px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              padding: "12px",
              background: "#2563eb",
              color: "#fff",
              borderRadius: "12px 12px 0 0",
              fontWeight: "bold",
            }}
          >
            KineticAge AI
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px",
            }}
          >
            {messages.map((msg, i) => (
              <p
                key={i}
                style={{
                  textAlign:
                    msg.sender === "user" ? "right" : "left",
                }}
              >
                <strong>
                  {msg.sender === "user" ? "You" : "AI"}:
                </strong>{" "}
                {msg.text}
              </p>
            ))}
          </div>

          <div style={{ display: "flex", padding: "10px" }}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask something..."
              style={{ flex: 1 }}
            />

            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}