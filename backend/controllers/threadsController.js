import express from "express";
import Thread from "../models/threadsModel.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const testThread = async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "abc",
      title: "testing thread 1",
    });

    const savedThread = await thread.save();
    res.send(savedThread);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating thread");
  }
};

// get all threads (in DSC order , sorted by updatedAt time)
const getThreads = async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 }); // -1 => DSC order
    res.json(threads);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch the threads" });
  }
};

// get particular thread
const singleThread = async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId });
    if (!thread) res.status(404).json({ error: "Thread not found" });
    res.send(thread.messages);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch the chat" });
  }
};

// delete the thread
const deleteThread = async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });
    if (!deletedThread) res.status(404).json({ error: "Thread not found" });
    res.status(200).json({ success: "Thread deleted succesfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch the chat" });
  }
};

// chat handling in single thread
const chat = async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message)
    res.status(404).json({ error: "misssing required fields" });
  try {
    let thread = await Thread.findOne({ threadId });
    // if !thread means "New Chat" => save that new thread in DB
    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getOpenAIAPIResponse(message);
    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date(); // to show most recent chat on top

    await thread.save();
    res.json({ reply: assistantReply });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to get response from openAi" });
  }
};

export { testThread, getThreads, singleThread, deleteThread, chat };
