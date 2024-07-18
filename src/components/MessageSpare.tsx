import { motion } from "framer-motion";
import { useRecoilValue } from "recoil";
import { websiteThemeState } from "../atoms/website-theme";
// import { userProfilePicState } from "../atoms/users";
import React from "react";
interface Message {
  message: string;
  username: string;
  profilePic: string;
}
export const MessageComponent: React.FC<Message> = ({
  username,
  message,
  profilePic,
}) => {
  const websiteTheme = useRecoilValue(websiteThemeState);
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
    <motion.div
      className=" w-[90%] lg:w-[80%]  mx-auto  flex flex-col gap-[15px] lg:gap-[20px]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="hidden lg:flex gap-2 lg:gap-5 xl:gap-10  items-center mt-2 lg:mt-5 xl:mt-5 ">
        {/* <div className=" flex items-center gap-[10px] w-[30%] lg:w-[20%] justify-end">
          <p
            className=" text-[12px] lg:text-[14px] xl:text-[16px] text-right text-wrap w-[50px]   sm:w-[70%]"
            style={{
              color: websiteTheme.textColor,
              wordBreak: "break-word",
              whiteSpace: "normal",
            }}
          >
            {username}
          </p>
          <div className=" rounded-full lg:h-[50px] lg:w-[50px] w-[35px] h-[35px] overflow-hidden">
            <img src={profilePic} className=" object-cover w-full h-full" />
          </div>
        </div> */}
         <div className="flex items-center gap-[10px] w-[30%] lg:w-[20%] justify-end">
  <p
    className="text-[12px] lg:text-[14px] xl:text-[16px] text-right whitespace-normal"
    style={{
      color: websiteTheme.textColor,
      wordBreak: "break-word",
      whiteSpace: "normal",
    }}
  >
    {username}
  </p>
  <div className="rounded-full lg:h-[50px] lg:w-[50px] w-[35px] h-[35px] overflow-hidden">
    <img src={profilePic} className="object-cover w-full h-full" />
  </div>
</div>

        <div className="  w-[70%] lg:w-[60%]">
          <p className=" text-[13px] lg:text-[18px] xl:text-[20px]">
            {message.length > 300 ? message.slice(0, 300) : message}
          </p>
        </div>
      </div>
      <div className=" lg:hidden flex gap-[10px] ">
        <div
          className={`rounded-full lg:h-[50px] lg:w-[50px] w-[30px] h-[30px] overflow-hidden  `}
        >
          <img src={profilePic} className=" object-cover w-full h-full " />
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
            {username}
          </p>
          <div className="   lg:w-[60%]  ">
            <p
              className=" text-[15px] lg:text-[18px] xl:text-[20px] "
              style={{
                color: websiteTheme.textColor,
                wordBreak: "break-word",
                whiteSpace: "normal",
              }}
            >
              {formatMessage(message)}
            </p>
          </div>
        </div>
      </div>

    </motion.div>
  );
};
