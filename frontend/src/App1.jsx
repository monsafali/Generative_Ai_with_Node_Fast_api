import { useState } from "react";
import axios from "axios";

function App() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const handleAsk = async () => {
    const res = await axios.post("http://localhost:5000/api/ask", {
      question,
    });
    setResponse(res.data.answer);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask your question..."
        className="w-full max-w-xl p-4 rounded border border-gray-300 mb-4"
      />
      <button
        onClick={handleAsk}
        className="bg-blue-500 text-white px-6 py-2 rounded"
      >
        Ask
      </button>
      {response && (
        <div className="mt-6 bg-white p-4 rounded shadow max-w-xl w-full">
          <h2 className="font-bold mb-2">AI Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;
