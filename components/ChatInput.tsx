"use client";
import { db } from "@/firebase";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import ModelSelection from "./ModelSelection";
type Props = {
  chatId: string;
};
const ChatInput = ({ chatId }: Props) => {
  const [prompt, setprompt] = useState("");
  const { data: session } = useSession();
  //use swr to get the model
  const { data: model } = useSWR("model", {
    fallbackData: "text-davinci-003",
  });

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt) return;
    const input = prompt.trim();
    setprompt("");
    const message: Message = {
      text: input,
      createdAt: serverTimestamp(),
      user: {
        _id: session?.user?.email!,
        name: session?.user?.name!,
        avatar: `https://ui-avatars.com/api/?name=${session?.user?.name}`,
      },
    };
    //add message to firebase db
    await addDoc(
      collection(
        db,
        "users",
        session?.user?.email!,
        "chats",
        chatId,
        "messages"
      ),
      message
    );
    //show notification to loading
    const notification = toast.loading("ChatGpt is thinking...");
    //comunicate with our api
    await fetch("/api/askQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
        chatId,
        model,
        session,
      }),
    }).then(() => {
      //notification to success
      toast.success("ChatGpt has responded", { id: notification });
    });
  };
  return (
    <div className="bg-gray-700/50 text-gray-400 rounded-xl text-sm mx-5 my-2 ">
      <form className="p-5 space-x-5 flex" onSubmit={sendMessage}>
        <input
          disabled={!session}
          type="text"
          placeholder="Type your message here😎"
          value={prompt}
          onChange={(e) => setprompt(e.target.value)}
          className="bg-transparent focus:outline-none flex-1 disabled:cursor-not-allowed disabled:text-gray-300
          drop-shadow-lg"
          title="input"
          aria-label="input"
        />
        <button
          type="submit"
          disabled={!session || !prompt}
          className="bg-[#11a37f] hover:opacity-50 text-white font-bold px-4 py-2 cursor-pointer rounded-full
          disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-red-600 transition-all duration-100 ease-out"
          title="submit"
        >
          <PaperAirplaneIcon className="h-4 w-4 -rotate-45" title="icon" />
        </button>
      </form>
      <div className="md:hidden">
        {/* model select */}
        <ModelSelection />
      </div>
    </div>
  );
};

export default ChatInput;
