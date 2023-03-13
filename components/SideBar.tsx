"use client";
import { db } from "@/firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { signOut, useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import ChatRow from "./ChatRow";
import ModelSelection from "./ModelSelection";
import NewChat from "./NewChat";

const SideBar = () => {
  const { data: session } = useSession();
  const [chats, loading] = useCollection(
    session &&
      query(
        collection(db, "users", session.user?.email!, "chats"),
        orderBy("createdAt", "asc")
      )
  );

  return (
    <div className="p-2 flex flex-col h-screen">
      <div className="flex-1">
        <div className="space-y-2">
          {/* new chat */}
          <NewChat />
          <div className="hidden md:inline">
            {/* model selection */}
            <ModelSelection />
          </div>
          {loading && (
            <div className="text-white text-center animate-pulse">
              <p>Loading Chats...</p>
            </div>
          )}
          {/* old chats  */}
          {chats?.docs.map((chat) => (
            <ChatRow key={chat.id} id={chat.id} />
          ))}
        </div>
      </div>
      {session && (
        <img
          src={`https://ui-avatars.com/api/?name=${session?.user?.name}`}
          alt="profile picture"
          className="w-12 h-12 rounded-full cursor-pointer mx-auto mb-2 hover:opacity-50"
          onClick={() => signOut()}
        />
      )}
    </div>
  );
};

export default SideBar;
