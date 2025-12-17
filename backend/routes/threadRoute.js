import express from "express";
import {
  testThread,
  getThreads,
  singleThread,
  deleteThread,
  chat,
} from "../controllers/threadsController.js";

const router = express.Router();

router.post("/test", testThread);
router.get("/allThreads", getThreads);
router.get("/allThreads/:threadId", singleThread);
router.delete("/allThreads/:threadId", deleteThread);
router.post("/chat", chat);


export default router;
