import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "../context/myContext.jsx";
import "../styles/chat.css";
import ReactMarkdown from "react-markdown"; // to format gpt reply
import rehypeHighlight from "rehype-highlight"; // to highlight code snippets given by gpt
import "highlight.js/styles/github-dark.css"; // to gave extra format to the code

const Chat = () => {
  const { prevChats, setPrevChats, newChat, setNewChat, reply } =
    useContext(MyContext);

  const [latestReply, setLatestReply] = useState(null); // to gave typing eff. to new latest chat & prev. remains as it is

  // giving typing effect....
  useEffect(() => {
    if (!reply) {
      setLatestReply(null);
      return;
    }

    const words = reply.split(" ");
    let idx = 0;

    setLatestReply(""); // reset before typing

    const interval = setInterval(() => {
      setLatestReply(words.slice(0, idx + 1).join(" "));
      idx++;

      if (idx === words.length) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, [reply]);

  useEffect(() => {
    const chat = document.querySelector(".chats");
    chat?.scrollTo(0, chat.scrollHeight);
  }, [prevChats, latestReply]);


  return (
    <>
      <div>
        {/* ----------------new chat----------------  */}
        {newChat && <h1>What can I help with?</h1>}

        {/* ----------------continued chat------------- */}
        <div className="chats">
          {prevChats?.slice(0, -1).map((chat, idx) => (
            <div
              className={chat.role === "user" ? "userDiv" : "gptDiv"}
              key={idx}
            >
              {chat.role === "user" ? (
                <p className="userMessage">{chat.content}</p>
              ) : (
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {chat.content}
                </ReactMarkdown>
              )}
            </div>
          ))}

          {prevChats.length > 0 && (
            <>
              {latestReply === null ? (
                <div className="gptDiv" key={"non-typing"}>
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {prevChats[prevChats.length - 1].content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="gptDiv" key={"typing"}>
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {latestReply}
                  </ReactMarkdown>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
