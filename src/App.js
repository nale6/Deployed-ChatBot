import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import key from "./Key.js";
import Typewriter from "typewriter-effect";
import ScrollToBottom from "react-scroll-to-bottom";

const App = () => {
  var [input, setInput] = useState("");
  const [responses, setResponses] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  let bottomRef = useRef();
  let scrollRef = useRef();

  const grabResponse = (storedValue) => {
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
              content: storedValue,
            },
          ],
          web_access: false,
        }),
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        console.log(storedValue);
        console.log(input);
        setResponses((prevResponses) => [
          ...prevResponses,
          { question: storedValue, answer: result },
        ]);
      } catch (error) {
        const errorMessage = "An error has occurred, please try again." + error;
        console.error(error);
        console.log(storedValue);
        setResponses((prevResponses) => [
          ...prevResponses,
          { question: storedValue, answer: errorMessage },
        ]);
      } finally {
        setInput(""); // Clear the input field after submission
        setSubmitted(false); // Reset submitted state
        autoScroll();
      }
    };

    fetchMe();
  };

  const autoScroll = (e) => {
    setTimeout(() => {
      bottomRef.current.scrollIntoView();
    }, 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      setSubmitted(true);
      const storedInput = input.trim();
      setInput("Fetching response..."); // Clear the input field after submission
      grabResponse(storedInput);
    }
  };

  return (
    <>
      <div className="app-container">
        <h1>ChatBot With OpenAI API</h1>
        <div className="responses-container" ref={scrollRef}>
          {responses.map((response, index) => (
            <>
              <div className="container-input">
                <div key={index} className="response-box">
                  <p>{response.question}</p>
                </div>
              </div>
              <div className="container-response">
                <div key={index} className="response-box2">
                  <img className="img" src={require("./aiphoto4.png")}></img>
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter.changeDelay(0.1);
                      if (typeof response.answer === "string") {
                        typewriter
                          .typeString(response.answer)
                          .callFunction(() => autoScroll())
                          .start();
                      } else if (response.answer.result) {
                        typewriter.typeString(response.answer.result).start();
                      }
                    }}
                  />
                </div>
              </div>
            </>
          ))}
          <div ref={bottomRef} className="scrollToBottom" />
        </div>
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="input-box"
          />
          <button
            type="submit"
            className={"greyed-out" + (input != 0 ? " submit-button" : "")}
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
};

export default App;

// "x-rapidapi-key": "a19ff8e0d4mshc242df1707a9e69p1444eajsn1f3a0794cafe",
