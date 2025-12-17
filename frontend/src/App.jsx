import React from "react";
import "./styles/App.css";
import Sidebar from "./componenets/Sidebar.jsx";
import ChatWindow from "./componenets/ChatWindow.jsx";
import { MyContext } from "./context/myContext.jsx";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); // stores all  chats of curr thread
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads,
  };
  return (
    <>
      <div className="app">
        <MyContext.Provider value={providerValues}>
          <Sidebar></Sidebar>
          <ChatWindow></ChatWindow>
        </MyContext.Provider>
      </div>
    </>
  );
};

export default App;
