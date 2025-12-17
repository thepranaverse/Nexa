import React, { useContext, useState, useEffect } from "react";
import Chat from "../componenets/Chat.jsx";
import "../styles/chatWindow.css";
import { MyContext } from "../context/myContext.jsx";
import { ScaleLoader } from "react-spinners";

const ChatWindow = () => {
  const API_BASE = import.meta.env.VITE_API_URL;

  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);

    if (!prompt.trim()) return;

    console.log("message ", prompt, " threadId ", currThreadId);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch(`${API_BASE}/api/thread/chat`, options);
      const res = await response.json();
      console.log(res);
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  // append new chats to prev chats
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }

    setPrompt("");
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatWindow">
      {/* Navbar */}
      <div className="navbar">
        <span className="SigmaGPT">
          <h3>
            Nexa <i className="fa-solid fa-chevron-down"></i>{" "}
          </h3>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <i className="fa-solid fa-user"></i>
        </div>
      </div>

      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i class="fa-solid fa-gear"></i> Settings
          </div>
          <div className="dropDownItem">
            <i class="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
          </div>
          <div className="dropDownItem">
            <i class="fa-solid fa-arrow-right-from-bracket"></i> Log out
          </div>
        </div>
      )}

      {/* Chat Display Area */}
      <Chat></Chat>

      <ScaleLoader color="fff" loading={loading}></ScaleLoader>

      {/* Chat Input Area */}
      <div className="chatInput">
        <div className="inputBox">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
            placeholder="Ask me anything..."
          />
          <button onClick={getReply} id="submit">
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>

      {/* Info */}
      <p className="info">
        Nexa – an AI assistant for contextual conversations
      </p>
    </div>
  );
};

export default ChatWindow;
