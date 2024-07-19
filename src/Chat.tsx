import { useEffect, useState, useRef } from "react";
import Navbar from "./components/Navbar";
import { AiOutlineSend } from "react-icons/ai";
import io from "socket.io-client";
import SettingsIcon from "./components/SettingsIcon";
import SettingsClosed from "./components/SettingsClosed";
const socket = io(import.meta.env.VITE_BASE_URI);
import { motion, AnimatePresence } from "framer-motion";
import { useRecoilState } from "recoil";
import { userProfilePicState } from "./atoms/users";
import { websiteThemeState } from "./atoms/website-theme";
import axios from "axios";
import messageNotification from "./assets/message_notification.mp3";
import { userNameState } from "./atoms/users";
import Focused from "./components/message-animations/Focused";
import synthIcon from "./assets/synth.svg";
import audioIcon from "./assets/audio.svg";
import slideIcon from "./assets/slide.svg";
import onIcon from "./assets/on.svg";
import ambientIcon from "./assets/ambient.svg";
import winIcon from "./assets/win.svg";
import { websiteAudioState } from "./atoms/website-theme";
import winMusic from "./assets/newwin.mp3";
import onMusic from "./assets/newon.mp3";
import slideMusic from "./assets/newslide.mp3";
import synthMusic from "./assets/newsynth.mp3";
import ambientMusic from "./assets/newambient.mp3";
import EquatorTest from "./components/message-animations/EquatorTest";
import { Link, useNavigate } from "react-router-dom";
import MobileNav from "./components/MobileNav";
import Footer from "./components/Footer";
import Pump from "./components/Pump";
import Alpha from "./components/Alpha";
import Chaos from "./components/message-animations/Chaos";
// import { walletAddressState } from "./atoms/wallet"
// import { useNavigate } from "react-router-dom"
const BASE_URI = import.meta.env.VITE_BASE_URI;

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
interface Settings {
  visual: string;
  audio: string;
  motion: string;
}
const totalWidth = window.innerWidth;
const totalHeight = window.innerHeight;

const Chat = () => {
  const [currentUserMessage, setCurrentUserMessage] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMusicPlayinh, setMusicIsPlaying] = useState(true);
  const [settingsModal, setSettingsModal] = useState<Settings>({
    visual: "rem",
    audio: "win",
    motion: "focused",
  });
  const [websiteTheme, setWebsiteTheme] = useRecoilState(websiteThemeState);
  const [initialMessages, setInitialMessages] = useState<InitialMessage[]>([]);
  const [newMessage, setNewMessage] = useState<Message[]>([]);
  const [chatState, setChatState] = useState<"DEN" | "PUMP" | "ALPHA">("DEN");
  const [userName, setUserName] = useRecoilState(userNameState);
  const [profilePicState, setProfilePicState] =
    useRecoilState(userProfilePicState);
  const notificationRef = useRef<HTMLAudioElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [websiteAudio, setWebsiteAudio] = useRecoilState(websiteAudioState);
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    audioRef.current!.play();
    const loadUserProfile = async () => {
      const wAddress = localStorage.getItem("walletAddress");
      try {
        const response = await axios.get(
          `${BASE_URI}/api/user-profile?walletAddress=${wAddress}`
        );
        const data = response.data;
        if (data.username) {
          setUserName(data.username);
        }
        if (data.profilePic) {
          setProfilePicState(data.profilePic);
        }
      } catch (err: any) {
        console.log("profile-error", err.message);
      }
    };
    loadUserProfile();
    const loadInitialMessages = async () => {
      try {
        const response = await axios.get(`${BASE_URI}/api/initialMessages`);
        const messages = response.data;
        if (messages) {
          setInitialMessages(messages);
        }
      } catch (err) {
        console.log("initial-messages-error", err);
      }
    };
    loadInitialMessages();

    const handleNewMessage = (msg: Message) => {
      setNewMessage((prevMessages: Message[]) => {
        notificationRef.current!.play();
        return [...prevMessages, msg];
      });
    };
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("initialMessages");
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

  const handleSendMessage = () => {
    if (currentUserMessage.length <= 500) {
      if (currentUserMessage.trim()) {
        socket.emit("sendMessage", {
          username: userName,
          message: currentUserMessage,
          profilePic: profilePicState,
        });
        setCurrentUserMessage("");
      }
    } else {
      alert("Character count exceeds 500");
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setCurrentUserMessage((prevValue) => prevValue + "\n");
    } else if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const clickAnimation = {
    scale: 0.9,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = websiteAudio;
      audioRef.current.play();
    }
  }, [websiteAudio]);

  const handleMusicPlayPause = () => {
    if (isMusicPlayinh) {
      audioRef.current?.pause();
      setMusicIsPlaying(false);
    } else {
      audioRef.current?.play();
      setMusicIsPlaying(true);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const RenderComponent = () => {
    switch (chatState) {
      case "DEN":
        return (
          <>
            <div>
              <audio ref={notificationRef}>
                <source src={messageNotification} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>

            {/* -------------------------------------- */}
            <div className="relative h-[70%] lg:h-[75%] overflow-y-auto mb-[10px]  w-full">
              {settingsModal.motion === "focused" ? (
                initialMessages.length > 0 && (
                  <Focused
                    initialMessages={initialMessages}
                    newMessage={newMessage}
                  />
                )
              ) : settingsModal.motion === "chaos" ? (
                <Chaos
                  newMessage={newMessage}
                  width={totalWidth}
                  height={totalHeight}
                />
              ) : (
                initialMessages.length > 0 && (
                  <EquatorTest
                    initialMessages={initialMessages}
                    newMessage={newMessage}
                  />
                )
              )}
            </div>
            {/* -------------------------------------- */}
            <div className="flex items-start lg:items-center justify-center gap-2 lg:gap-4 h-[7%] w-full ">
              <AnimatePresence>
                {isSettingsOpen ? (
                  <motion.div
                    ref={modalRef}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="w-[90%]  lg:w-[50%] xl:w-[35%] 2xl:w-[35%] relative top-[-450px] lg:top-[-100px] text-black z-10 flex flex-col gap-[10px]  "
                  >
                    <div
                      className={`${
                        websiteTheme.bgColor === "#ffffff"
                          ? "border border-black"
                          : "border-none"
                      } bg-white  p-5 rounded-[8px] flex flex-col gap-[20px] lg:gap-[5px] `}
                    >
                      <div className=" flex lg:items-center rounded-[8px] flex-col lg:flex-row ">
                        <div className=" w-[15%]  ">
                          <p className=" text-[12px] lg:text-[16px]">visual</p>
                        </div>
                        <div className=" flex items-center justify-between w-full mt-[10px] lg:mt-[0px]">
                          <div className="  w-full flex justify-between lg:justify-around">
                            <div
                              className=" flex flex-col items-center "
                              onClick={() => {
                                setWebsiteTheme({
                                  ...websiteTheme,
                                  bgColor: "#0000FF",
                                  textColor: "#ffffff",
                                  buttonColor: "#0000FF",
                                });
                              }}
                            >
                              <div className=" bg-[#0000FF] text-white p-[5px] lg:p-2 rounded-[3px] text-[8px] lg:text-[10px] cursor-pointer ">
                                <p>dont sin</p>
                                <p>dont sin</p>
                                <p>dont sin</p>
                              </div>
                              <p
                                className={`text-[10px] lg:text-[16px] ${
                                  settingsModal.visual === "rem"
                                    ? "text-[#0000FF]"
                                    : "text-black"
                                }  lg:border-none lg:p-0`}
                              >
                                rem
                              </p>
                            </div>

                            <div
                              className=" flex flex-col items-center"
                              onClick={() => {
                                setWebsiteTheme({
                                  ...websiteTheme,
                                  bgColor: "#000000",
                                  textColor: "#00FF00",
                                  buttonColor: "#000000",
                                });
                              }}
                            >
                              <div className=" bg-[#000000] text-[#00FF00] text-[8px] lg:text-[10px]  p-[5px] lg:p-2 rounded-[3px] cursor-pointer ">
                                <p>dont sin</p>
                                <p>dont sin</p>
                                <p>dont sin</p>
                              </div>
                              <p
                                className={`text-[10px] lg:text-[16px] ${
                                  settingsModal.visual === "neo"
                                    ? "text-[#0000FF]"
                                    : "text-black"
                                }  rounded-[2px] p-[4px] lg:border-none lg:p-0`}
                              >
                                neo
                              </p>
                            </div>

                            <div
                              className=" flex flex-col items-center"
                              onClick={() => {
                                setWebsiteTheme({
                                  ...websiteTheme,
                                  bgColor: "#00FF00",
                                  textColor: "#000000",
                                  buttonColor: "#00FF00",
                                });
                              }}
                            >
                              <div className=" bg-[#00FF00] text-[#000000] text-[8px] lg:text-[10px]  p-[5px] lg:p-2 rounded-[3px] cursor-pointer ">
                                <p>dont sin</p>
                                <p>dont sin</p>
                                <p>dont sin</p>
                              </div>
                              <p
                                className={`text-[10px] lg:text-[16px] ${
                                  settingsModal.visual === "oen"
                                    ? "text-[#0000FF]"
                                    : "text-black"
                                }   rounded-[2px] p-[4px] lg:border-none lg:p-0`}
                              >
                                oen
                              </p>
                            </div>

                            <div
                              className=" flex flex-col items-center"
                              onClick={() => {
                                setWebsiteTheme({
                                  ...websiteTheme,
                                  bgColor: "#FF5959",
                                  textColor: "#ffffff",
                                  buttonColor: "#000000",
                                });
                              }}
                            >
                              <div className=" bg-[#FF5959] text-[#3D3D3D] text-[8px] lg:text-[10px]  p-[5px] lg:p-2 rounded-[3px] cursor-pointer">
                                <p>dont sin</p>
                                <p>dont sin</p>
                                <p>dont sin</p>
                              </div>
                              <p
                                className={`text-[10px] lg:text-[16px] ${
                                  settingsModal.visual === "hmmm"
                                    ? "text-[#0000FF]"
                                    : "text-black"
                                }  rounded-[2px] p-[4px] lg:border-none lg:p-0`}
                              >
                                hmmm
                              </p>
                            </div>

                            <div
                              className=" flex flex-col items-center"
                              onClick={() => {
                                setWebsiteTheme({
                                  ...websiteTheme,
                                  bgColor: "#ffffff",
                                  textColor: "#000000",
                                  buttonColor: "#000000",
                                });
                              }}
                            >
                              <div className=" bg-[#ffffff] text-[#000000] text-[8px] lg:text-[10px]  p-[5px] lg:p-2 rounded-[3px] border border-black cursor-pointer ">
                                <p>dont sin</p>
                                <p>dont sin</p>
                                <p>dont sin</p>
                              </div>
                              <p
                                className={`text-[10px] lg:text-[16px] ${
                                  settingsModal.visual === "b/w"
                                    ? "text-[#0000FF]"
                                    : "text-black"
                                }   rounded-[2px] p-[4px] lg:border-none lg:p-0`}
                              >
                                b/w
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className=" w-[100%] h-[1px] bg-gradient-to-r from-[#0000FF] to-transparent lg:hidden " />

                      {/* --------------------------------------------- */}
                      <div className=" flex lg:items-center flex-col lg:flex-row   rounded-[8px]">
                        <div
                          className=" flex items-center gap-[10px] cursor-pointer mr-[5px] "
                          onClick={handleMusicPlayPause}
                        >
                          <p className="  text-[12px] lg:text-[16px]">audio</p>
                          <img src={audioIcon} className=" mt-[-3px]" />
                        </div>
                        <div className=" w-full flex lg:justify-around justify-between mt-[10px] lg:mt-[0px]">
                          <div
                            className=" flex flex-col items-center justify-center"
                            onClick={() => setWebsiteAudio(winMusic)}
                          >
                            <div
                              className={`  bg-[#ffffff] text-white text-[10px] p-2 border ${
                                websiteAudio === winMusic
                                  ? "border-[#0000FF]"
                                  : "border-black"
                              }  h-[45px] w-[45px] lg:h-[65px] lg:w-[65px] rounded-[3px] cursor-pointer flex items-center justify-center`}
                            >
                              <img src={winIcon} className=" w-[100%] h-auto" />
                            </div>
                            <p
                              className={`text-[10px] lg:text-[16px] ${
                                websiteAudio === winMusic
                                  ? "text-[#0000FF]"
                                  : "text-black"
                              } p-[4px] rounded-[2px] lg:border-none`}
                            >
                              win
                            </p>
                          </div>

                          <div
                            className=" flex flex-col items-center "
                            onClick={() => setWebsiteAudio(slideMusic)}
                          >
                            <div
                              className={`  bg-[#ffffff] text-white text-[10px] p-2 border ${
                                websiteAudio === slideMusic
                                  ? "border-[#0000FF]"
                                  : "border-black"
                              } h-[45px] w-[45px] lg:h-[65px] lg:w-[65px] rounded-[3px] cursor-pointer flex items-center justify-center`}
                            >
                              <img
                                src={slideIcon}
                                className=" w-[100%] h-auto"
                              />
                            </div>

                            <p
                              className={` text-[10px] lg:text-[16px]  ${
                                websiteAudio === slideMusic
                                  ? "text-[#0000FF]"
                                  : "text-black"
                              }  p-[4px] rounded-[2px] lg:border-none`}
                            >
                              slide
                            </p>
                          </div>

                          <div
                            className=" flex flex-col items-center"
                            onClick={() => setWebsiteAudio(onMusic)}
                          >
                            <div
                              className={` bg-[#ffffff] text-white text-[10px] p-2 border ${
                                websiteAudio === onMusic
                                  ? "border-[#0000FF]"
                                  : "border-black"
                              } h-[45px] w-[45px] lg:h-[65px] lg:w-[65px] rounded-[3px] cursor-pointer flex items-center justify-center`}
                            >
                              <img
                                src={onIcon}
                                className=" w-[100%] h-auto mt-[7px] "
                              />
                            </div>

                            <p
                              className={` text-[10px] lg:text-[16px]  ${
                                websiteAudio === onMusic
                                  ? "text-[#0000FF]"
                                  : "text-black"
                              } p-[4px] rounded-[2px] lg:border-none`}
                            >
                              on
                            </p>
                          </div>

                          <div
                            className=" flex flex-col items-center"
                            onClick={() => setWebsiteAudio(synthMusic)}
                          >
                            <div
                              className={` bg-[#ffffff] text-white text-[10px] p-2 border ${
                                websiteAudio === synthMusic
                                  ? "border-[#0000FF]"
                                  : "border-black"
                              } h-[45px] w-[45px] lg:h-[65px] lg:w-[65px] rounded-[3px] cursor-pointer flex items-center justify-center`}
                            >
                              <img
                                src={synthIcon}
                                className=" w-[100%] h-auto"
                              />
                            </div>

                            <p
                              className={` text-[10px] lg:text-[16px] ${
                                websiteAudio === synthMusic
                                  ? "text-[#0000FF]"
                                  : "text-black"
                              }  p-[4px] rounded-[2px] lg:border-none`}
                            >
                              synth
                            </p>
                          </div>

                          <div
                            className=" flex flex-col items-center"
                            onClick={() => setWebsiteAudio(ambientMusic)}
                          >
                            <div
                              className={` bg-[#ffffff] text-white text-[10px] p-2 border ${
                                websiteAudio === ambientMusic
                                  ? "border-[#0000FF]"
                                  : "border-black"
                              } h-[45px] w-[45px] lg:h-[65px] lg:w-[65px] rounded-[3px] cursor-pointer flex items-center justify-center`}
                            >
                              <img
                                src={ambientIcon}
                                className=" w-[100%] h-auto"
                              />
                            </div>

                            <p
                              className={` text-[10px] lg:text-[16px] ${
                                websiteAudio === ambientMusic
                                  ? "text-[#0000FF]"
                                  : "text-black"
                              }  p-[4px] rounded-[2px] lg:border-none`}
                            >
                              ambient
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className=" w-[100%] h-[1px] bg-gradient-to-r from-[#0000FF] to-transparent lg:hidden" />
                      {/* ------------------------------- */}
                      <div className=" flex flex-col lg:flex-row lg:items-center  rounded-[8px]">
                        <p className=" w-[18%] text-[12px] lg:text-[16px]">
                          motion
                        </p>
                        <div className=" flex w-full lg:justify-around gap-[20px] sm:gap-[40px] lg:gap-0 mt-[10px] lg:mt-[0px]">
                          <div
                            className=" flex flex-col items-center"
                            onClick={() =>
                              setSettingsModal({
                                ...settingsModal,
                                motion: "chaos",
                              })
                            }
                          >
                            <div
                              className={` bg-[#white] ${
                                settingsModal.motion === "chaos"
                                  ? "text-[#0000FF] border border-[#0000FF]"
                                  : "text-black border border-black"
                              }  lg:text-[10px] p-[5px] lg:p-2 rounded-[3px] text-[8px] cursor-pointer`}
                            >
                              <p>dont sin</p>
                              <p>dont sin</p>
                              <p>dont sin</p>
                            </div>
                            <p className=" text-[10px] lg:text-[16px] p-[4px] rounded-[2px] lg:border-none">
                              chaos
                            </p>
                          </div>
                          <div
                            className=" flex flex-col items-center"
                            onClick={() =>
                              setSettingsModal({
                                ...settingsModal,
                                motion: "focused",
                              })
                            }
                          >
                            <div
                              className={` bg-[#white] ${
                                settingsModal.motion === "focused"
                                  ? "text-[#0000FF] border border-[#0000FF]"
                                  : "text-black border border-black"
                              }  lg:text-[10px] p-[5px] lg:p-2 rounded-[3px] text-[8px] cursor-pointer `}
                            >
                              <p>dont sin</p>
                              <p>dont sin</p>
                              <p>dont sin</p>
                            </div>
                            <p className=" text-[10px] lg:text-[16px]  p-[4px] rounded-[2px] lg:border-none">
                              focused
                            </p>
                          </div>
                          <div
                            className=" flex flex-col items-center"
                            onClick={() =>
                              setSettingsModal({
                                ...settingsModal,
                                motion: "equator",
                              })
                            }
                          >
                            <div
                              className={` bg-[#white] ${
                                settingsModal.motion === "equator"
                                  ? "text-[#0000FF] border border-[#0000FF]"
                                  : "text-black border border-black"
                              } lg:text-[10px] p-[5px] lg:p-2 rounded-[3px] text-[8px] cursor-pointer`}
                            >
                              <p>dont sin</p>
                              <p>dont sin</p>
                              <p>dont sin</p>
                            </div>
                            <p className=" text-[10px] lg:text-[16px]  p-[4px] rounded-[2px] lg:border-none">
                              equator
                            </p>
                          </div>
                        </div>
                        <div className="lg:hidden flex flex-col gap-[15px] mt-[15px] w-full">
                          <button
                            onClick={() => navigate("/profile")}
                            className=" uppercase font-jbm  p-[5px]   "
                            style={{
                              background:
                                websiteTheme.bgColor === "#ffffff"
                                  ? "black"
                                  : websiteTheme.bgColor,
                              color:
                                websiteTheme.bgColor === "#ffffff"
                                  ? "white"
                                  : websiteTheme.textColor,
                            }}
                          >
                            profile
                          </button>
                          <button
                            className={`  uppercase font-jbm  
                     `}
                            style={{
                              color:
                                websiteTheme.bgColor === "#ffffff"
                                  ? "#000000"
                                  : websiteTheme.bgColor,
                            }}
                          >
                            <Link to={"/"}>exit</Link>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="w-[60%] lg:w-[40%] xl:w-[35%]   ">
                    <motion.textarea
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      placeholder="type something retarded..."
                      value={currentUserMessage}
                      className={`bg-white ${
                        websiteTheme.bgColor === "#ffffff"
                          ? "border border-black"
                          : "border-none"
                      } text-[#121212] uppercase p-3 lg:p-5 text-[13px] lg:text-[18px] mx-auto rounded-[4px] lg:rounded-[8px] w-full outline-none resize-none`}
                      onChange={(e) => setCurrentUserMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={1}
                    />
                  </div>
                )}
              </AnimatePresence>
              <motion.button
                whileTap={clickAnimation}
                className={`p-[10px] lg:p-[15px] ${
                  websiteTheme.bgColor === "#ffffff"
                    ? "border border-black"
                    : "border-none"
                } bg-white rounded-[4px] lg:rounded-[8px] hidden lg:block`}
                onClick={handleSendMessage}
              >
                <AiOutlineSend
                  className={`w-[22px] lg:w-[35px] h-auto `}
                  style={{
                    color: websiteTheme.buttonColor,
                  }}
                />
              </motion.button>
              {!isSettingsOpen && (
                <motion.button
                  whileTap={clickAnimation}
                  className={`p-[10px] lg:p-[15px] ${
                    websiteTheme.bgColor === "#ffffff"
                      ? "border border-black"
                      : "border-none"
                  } bg-white rounded-[4px] lg:rounded-[8px] lg:hidden`}
                  onClick={handleSendMessage}
                >
                  <AiOutlineSend
                    className={`w-[22px] lg:w-[35px] h-auto `}
                    style={{
                      color: websiteTheme.buttonColor,
                    }}
                  />
                </motion.button>
              )}
              <motion.button
                whileTap={clickAnimation}
                className={`p-[10px] lg:p-[15px] ${
                  websiteTheme.bgColor === "#ffffff"
                    ? "border border-black"
                    : "border-none"
                } bg-white rounded-[4px] lg:rounded-[8px] hidden lg:block`}
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              >
                {isSettingsOpen ? (
                  <SettingsClosed color={websiteTheme.buttonColor} />
                ) : (
                  <SettingsIcon color={websiteTheme.buttonColor} />
                )}
              </motion.button>
            </div>
          </>
        );

      case "ALPHA":
        return <Alpha />;

      case "PUMP":
        return <Pump />;
    }
  };

  return (
    <div
      style={{
        backgroundColor: websiteTheme.bgColor,
        color: websiteTheme.textColor,
      }}
      className={`transition-colors duration-1000 w-full   relative font-jbm uppercase h-screen lg:h-screen overflow-hidden`}
    >
      <div>
        <audio ref={audioRef} loop>
          <source src={websiteAudio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>

      <div className="h-[5%] lg:h-[10%]">
        <div className="w-[90%] lg:flex justify-end hidden">
          <Navbar websiteTheme />
        </div>
        <MobileNav
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          socket={socket}
        />
      </div>
      {RenderComponent()}

      <Footer setChatState={setChatState} chatState={chatState} />
    </div>
  );
};

export default Chat;
