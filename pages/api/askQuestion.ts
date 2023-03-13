import { adminDb } from "@/firebaseAdmin";
import query from "@/lib/queryApi";
import admin from "firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";
type Data = {
  answer: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { prompt, chatId, session, model } = req.body;
  if (!prompt) {
    res.status(400).json({ answer: "please provide a prompt" });
    return;
  }
  if (!chatId) {
    res.status(400).json({ answer: "please provide a chat id" });
    return;
  }
  //chatgpt query
  const response = await query(prompt, chatId, model);

  const message: Message = {
    text: response || "ChatGpt unaple to find answer for question!",
    createdAt: admin.firestore.Timestamp.now(),
    user: {
      _id: "ChatGPT",
      name: "ChatGPT",
      avatar: "/images/logo.png",
    },
  };
  await adminDb
    .collection("users")
    .doc(session?.user?.email)
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .add(message);
  res.status(200).json({ answer: message.text });
}
