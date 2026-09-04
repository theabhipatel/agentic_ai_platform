import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* Header */}
      <header className="border-b bg-white p-4">
        <h1 className="text-xl font-semibold">AI Agent</h1>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user"
                  ? "justify-end"
                  : "justify-start"
                }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === "user"
                    ? "bg-black text-white"
                    : "bg-white text-gray-900"
                  }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-gray-500">
              Agent is thinking...
            </div>
          )}
        </div>
      </main>

      {/* Input */}
      <footer className="border-t bg-white p-4">
        <div className="mx-auto flex max-w-3xl gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Ask your AI agent..."
            className="flex-1 rounded-xl border px-4 py-3 outline-none"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="rounded-xl bg-black px-5 py-3 text-white disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;