import { useRecoilValue } from "recoil";
import { websiteThemeState } from "../../atoms/website-theme";
import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { MessageComponent } from "../Message";
import React from "react";
interface Message {
  _id: any;
  message: string;
  username: string;
  profilePic: string;
}
interface InitialMessage {
  _id: any;
  message: string;
  username: string;
  profilePic: string;
}

const Focused = ({
  initialMessages,
  newMessage,
}: {
  initialMessages: InitialMessage[];
  newMessage: Message[];
}) => {
  const websiteTheme = useRecoilValue(websiteThemeState);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [newMessage, initialMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const formatMessage = (text: string) => {
    let formattedText = text.replace(/\\n/g, "\n");

    formattedText = formattedText.replace(/\n{5,}/g, "\n\n\n\n");

    return formattedText.split("\n").map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <>
      <div className=" w-[90%] lg:w-[80%]  mx-auto  flex flex-col gap-[15px] lg:gap-[20px]">
        {initialMessages?.map((msg: InitialMessage, index: number) => (
          <>
            <div
              className="flex gap-2 lg:gap-5 xl:gap-10  items-center overflow-auto "
              key={index}
            >
              <div className=" w-full hidden lg:flex gap-2 lg:gap-5 xl:gap-10  items-center mt-2 lg:mt-5 xl:mt-5  ">
                <div className=" flex items-center gap-[10px] w-[30%] lg:w-[20%] justify-end ">
                  <p
                    className=" text-[12px] lg:text-[14px] xl:text-[16px] text-right text-wrap w-[50px]   sm:w-[70%]"
                    style={{
                      color: websiteTheme.textColor,
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {msg.username}
                  </p>
                  <div className=" rounded-full lg:h-[50px] lg:w-[50px] w-[35px] h-[35px] overflow-hidden">
                    <img
                      src={msg.profilePic}
                      className=" object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="  w-[70%] lg:w-[60%]">
                  <p className=" text-[13px] lg:text-[18px] xl:text-[20px]">
                    {msg.message}
                  </p>
                </div>
              </div>
              <div className=" lg:hidden flex gap-[10px] ">
                <div
                  className={`rounded-full lg:h-[50px] lg:w-[50px] w-[30px] h-[30px] overflow-hidden  `}
                >
                  <img
                    src={msg.profilePic}
                    className=" object-cover w-full h-full "
                  />
                </div>
                <div>
                  <p
                    className=" text-[12px] lg:text-[14px] xl:text-[16px]  "
                    style={{
                      color: websiteTheme.textColor,
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {msg.username}
                  </p>
                  <div className="   lg:w-[60%] ">
                    <p
                      className=" text-[15px] lg:text-[18px] xl:text-[20px] "
                      style={{
                        color: websiteTheme.textColor,
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {formatMessage(msg.message)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="w-[100%] mx-auto h-[1px]"
              style={{
                backgroundImage: `linear-gradient(to right , ${websiteTheme.bgColor} , ${websiteTheme.textColor} , ${websiteTheme.bgColor} )`,
              }}
            />
          </>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <AnimatePresence initial={false}>
        {newMessage.map((msg) => (
          <MessageComponent
            message={msg.message}
            username={msg.username}
            profilePic={msg.profilePic}
            key={msg._id}
          />
        ))}
      </AnimatePresence>
    </>
  );
};

export default Focused;
