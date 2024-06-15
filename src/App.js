import "./App.css";
import React, { useState, useEffect } from "react";
import key from "./Key.js";

const App = () => {
  var [input, setInput] = useState("");
  const [responses, setResponses] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      const fetchMe = async () => {
        const url = "https://open-ai21.p.rapidapi.com/chatgpt";
        const options = {
          method: "POST",
          headers: {
            "x-rapidapi-key": `${key}`,
            "x-rapidapi-host": "open-ai21.p.rapidapi.com",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: input,
              },
            ],
            web_access: false,
          }),
        };

        try {
          const response = await fetch(url, options);
          const result = await response.json();
          console.log(input);
          console.log(result);
          setResponses((prevResponses) => [
            ...prevResponses,
            { question: input, answer: result },
          ]);
        } catch (error) {
          console.error(error);
        } finally {
          setSubmitted(false); // Reset submitted state
          setInput(""); // Clear the input field after submission
        }
      };

      fetchMe();
    }
  }, [submitted, input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      setSubmitted(true);
      input = input.trim();
    } else {
      alert("Empty input");
    }
  };

  return (
    <div className="app-container">
      <h1>ChatBot With OpenAI API</h1>
      <div className="responses-container">
        {responses.map((response, index) => (
          <div key={index} className="response-box">
            <h3>Question:</h3>
            <p>{response.question}</p>
            <h3>Response from AI:</h3>
            <pre>{response.answer.result}</pre>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here"
          className="input-box"
        />
        <button type="submit" className="submit-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default App;

// "x-rapidapi-key": "a19ff8e0d4mshc242df1707a9e69p1444eajsn1f3a0794cafe",
