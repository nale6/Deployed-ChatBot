import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import key from "./Key.js";
import Typewriter from "typewriter-effect";
import useStayScrolled from "react-stay-scrolled";
import { CopyIcon, SpeakerLoudIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import "react-speech";
import Speech from "./Speech.js";

const App = () => {
  var [input, setInput] = useState("");
  const [enteredInput, setEnteredInput] = useState([]);
  const [responses, setResponses] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  let bottomRef = useRef();
  let scrollRef = useRef();
  const { stayScrolled } = useStayScrolled(scrollRef);

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
        setLoading(true);
        setResponses((prevResponses) => [
          ...prevResponses,
          { question: storedValue, answer: null },
        ]);
        const response = await fetch(url, options);
        const result = await response.json();
        updateResponse(responses.length, result);
      } catch (error) {
        const errorMessage =
          "An error has occurred, please try again. " + error;
        console.error(error);
        console.log(storedValue);
        updateResponse(responses.length, errorMessage);
      } finally {
        setInput(""); // Clear the input field after submission
        setSubmitted(false); // Reset submitted state
        setLoading(false);
        autoScroll();
      }
    };

    fetchMe();
  };

  const updateResponse = (index, response) => {
    setResponses((prevResponses) => {
      const updatedResponse = [...prevResponses];
      updatedResponse[index] = { ...updatedResponse[index], answer: response };
      return updatedResponse;
    });
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
      setInput(""); // Clear the input field after submission
      setEnteredInput((prevInput) => [
        ...prevInput,
        { currentInput: storedInput },
      ]);
      grabResponse(storedInput);
    }
  };

  useEffect(() => {
    stayScrolled();
  });

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
                {response.answer ? (
                  <div key={index} className="response-box2">
                    <img className="img" src={require("./aiphoto4.png")}></img>
                    <button
                      className="copy-button"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          typeof response.answer === "string"
                            ? response.answer
                            : response.answer.result
                        )
                      }
                    >
                      <CopyIcon />
                    </button>
                    <button className="text-to-speech">
                      <SpeakerLoudIcon className="speaker" />
                      <Speech
                        text={
                          typeof response.answer === "string"
                            ? response.answer
                            : response.answer.result
                        }
                      />
                    </button>
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
                ) : (
                  <div className="container-response">
                    <div className="response-box2">
                      <img
                        className="img"
                        src={require("./aiphoto4.png")}
                      ></img>
                      <div className="space"></div>
                      <div className="loading ">Loading . . .</div>
                    </div>
                  </div>
                )}
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
            className={"input-box"}
          />
          <button
            type="submit"
            className={
              "greyed-out-submit" + (input != 0 ? " submit-button" : "")
            }
          >
            <ArrowUpIcon />
          </button>
        </form>
      </div>
    </>
  );
};

export default App;
