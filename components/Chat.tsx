"use client";

import { db } from "@/firebase";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { collection, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";

type Props = {
  chatId: string;
};
const Chat = ({ chatId }: Props) => {
  const { data: session } = useSession();
  const [messages, loading] = useCollection(
    session &&
      query(
        collection(
          db,
          "users",
          session.user?.email!,
          "chats",
          chatId,
          "messages"
        ),
        orderBy("createdAt", "asc")
      )
  );
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      {loading && (
        <div className="text-white text-center animate-pulse mt-10">
          <p>Loading Chat...</p>
        </div>
      )}
      {messages?.empty && (
        <>
          <p className="mt-10 text-center text-white">
            Type a prompt to get started 😊
          </p>
          <ArrowDownCircleIcon className="h-10 w-10 text-white mt-5 mx-auto animate-bounce" />
        </>
      )}
      {messages?.docs.map((message) => (
        <Message key={message.id} message={message.data()} />
      ))}
    </div>
  );
};

export default Chat;
