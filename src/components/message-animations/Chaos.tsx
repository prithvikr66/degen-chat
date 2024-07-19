import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageComponent } from "../MessageSpare";

interface Message {
  _id: any;
  message: string;
  username: string;
  profilePic: string;
  position: {
    x: number;
    y: number;
  };
}

const Chaos = ({
  newMessage,
  width,
  height,
}: {
  newMessage: any;
  width: number;
  height: number;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (newMessage && containerRef.current) {
      const messageHeight = 100;
      const messageWidth = 200;
      const chatAreaHeight = height * 0.7;
      const chatAreaTop = height * 0.1;

      let latestMessage: Message;

      if (Array.isArray(newMessage)) {
        latestMessage = newMessage[newMessage.length - 1];
      } else {
        latestMessage = newMessage;
      }

      if (latestMessage) {
        const messageWithPosition = {
          ...latestMessage,
          position: {
            x: Math.random() * (width - messageWidth),
            y: chatAreaTop + Math.random() * (chatAreaHeight - messageHeight),
          },
        };

        setMessages((prevMessages) => [...prevMessages, messageWithPosition]);

        setTimeout(() => {
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg._id !== latestMessage._id)
          );
        }, 30000 + Math.random() * 1000);
      }
    }
  }, [newMessage, width, height]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message._id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className="absolute text-white p-2 rounded-lg max-w-xs"
            style={{
              left: message.position.x,
              top: message.position.y,
            }}
          >
            <MessageComponent
              message={message.message}
              profilePic={message.profilePic}
              username={message.username}
              key={message._id}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Chaos;
