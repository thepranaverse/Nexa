import React, { useContext, useEffect, useState } from "react";
import "../styles/sidebar.css";
import { MyContext } from "../context/myContext";
import { v1 as uuidv1 } from "uuid";
import blackLogo from "../assets/blacklogo.png";

const Sidebar = () => {
  const API_BASE = import.meta.env.VITE_API_URL;

  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setCurrThreadId,
    setPrompt,
    setReply,
    setNewChat,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/thread/allThreads`);
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      //console.log(filteredData);
      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads(); // sa change in any of the thread this useEffect runs..
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1()); // giving new threadid to new thrad
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(
        `${API_BASE}/api/thread/allThreads/${newThreadId}`
      );
      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/thread/allThreads/${threadId}`,
        { method: "DELETE" }
      );
      const res = await response.json();
      console.log(res);

      //updated threads re-render
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img src={blackLogo} alt="logo" />
        <h3>New Chat</h3>
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li
            key={idx}
            onClick={(e) => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : " "}
          >
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation(); //stop event bubbling
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      {/* Signature */}
      <div className="sign">
        <p>By Pranay &#128526;</p>
      </div>
    </section>
  );
};

export default Sidebar;
