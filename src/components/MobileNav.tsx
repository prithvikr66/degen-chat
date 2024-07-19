import { motion } from "framer-motion";
import { websiteThemeState } from "../atoms/website-theme";
import { useRecoilValue } from "recoil";
import SettingsClosed from "./SettingsClosed";
import SettingsIcon from "./SettingsIcon";
import bottle from "../assets/bottle.png";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MobileNav = ({
  setIsSettingsOpen,
  isSettingsOpen,
  socket,
}: {
  setIsSettingsOpen: any;
  isSettingsOpen: any;
  socket: any;
}) => {
  const clickAnimation = {
    scale: 0.9,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  };
  const [liveUsersCount, setLiveUsersCount] = useState<number | null>(0);
  const websiteTheme = useRecoilValue(websiteThemeState);
  useEffect(() => {
    socket.on("connectedUsersCountUpdate", (count: number) => {
      setLiveUsersCount(count);
    });
  }, []);

  return (
    <div className="mt-[20px] mb-[20px] lg:hidden w-[90%] mx-auto flex justify-between items-center sticky ">
      <div className="flex items-center ml-[80px]">
      <Link to="/">
      <img src={bottle} alt="Logo" className="h-[17] w-[36px]" />
      </Link>
      </div>
      <div className="flex items-center gap-[10px]">
        <div className="h-[10px] w-[10px] bg-[#00FF00] rounded-full"></div>
        <p>{liveUsersCount} Online</p>
      </div>
      <div className="flex justify-end opacity-80">
        <motion.button
          whileTap={clickAnimation}
          style={{ borderColor: websiteTheme.textColor }}
          className="p-[5px] rounded-[4px] lg:rounded-[8px] lg:hidden border-[1px]"
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        >
          {isSettingsOpen ? (
            <SettingsClosed color={websiteTheme.textColor} />
          ) : (
            <SettingsIcon color={websiteTheme.textColor} />
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default MobileNav;
