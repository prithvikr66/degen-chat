import React, { useRef, useState, useEffect } from "react";
import bgVideo from "./assets/newBgVideo.mp4";
import bgVideoMobile from "./assets/newBgMobile.mp4"
import winMusic from "./assets/win.mp3";
import { IoVolumeMuteOutline } from "react-icons/io5";
import { VscUnmute } from "react-icons/vsc";
import { motion } from "framer-motion";
import { walletAddressState } from "./atoms/wallet";
import { useRecoilState } from "recoil";
import { SolanaConnect } from "./components/ConnectButton";
import { useNavigate } from "react-router-dom";
import { TransactionsCountErrorIcon } from "./components/Icons";

import AnimatedBottle from './components/AnimateBottle'; //making changes here. to implement animation
const App: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const [walletAddress, setWalletAddressState] =
    useRecoilState(walletAddressState);

  const [showWalletTransactionsError, setShowWalletTransactionsError] =
    useState(false);

  const [showVerifying, setShowVerifying] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    audioRef.current!.play();

    const walletAddressFromLocalStorage = localStorage.getItem("walletAddress");
    if (walletAddressFromLocalStorage) {
      {
        setWalletAddressState(walletAddressFromLocalStorage);
      }
    }
  }, []);

  const handlePlayForSmallerDevices = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      {
        isPlaying ? audioRef.current.pause() : audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const handlePlay = () => {
    if (audioRef.current) {
      {
        isPlaying ? audioRef.current.pause() : audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full h-screen ">
      <div className="lg:hidden block">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover object-center"
          src={bgVideoMobile}
          autoPlay
          loop
          muted
        />
      </div>
      <div className="hidden lg:block">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover object-center"
          src={bgVideo}
          autoPlay
          loop
          muted
        />
      </div>
      <div>
        <audio ref={audioRef} loop>
          <source src={winMusic} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>

      <div className=" hidden lg:block relative top-[50px]">
        <button
          onClick={handlePlay}
          className=" hidden lg:flex lg:absolute lg:top-0 lg:left-[-50px] lg:w-full lg:h-full  lg:justify-end lg:text-white lg:text-[20px] lg:font-bold"
          style={{ zIndex: 1000 }}
        >
          {isPlaying ? (
            <VscUnmute className=" " />
          ) : (
            <IoVolumeMuteOutline className=" " />
          )}
        </button>
      </div>

      <div className=" lg:hidden relative top-[50px]">
        <button
          onClick={handlePlayForSmallerDevices}
          className="  flex absolute top-0 left-[-50px] w-full h-full  justify-end text-white text-[20px] font-bold"
          style={{ zIndex: 1000 }}
        >
          {isPlaying ? (
            <IoVolumeMuteOutline className=" " />
          ) : (
            <VscUnmute className=" " />
          )}
        </button>
      </div>

      <div className="relative z-10 flex items-center justify-center h-full top-[-100px] lg:top-[-50px]">
        <div className="text-white text-center flex flex-col justify-between">
          {/* making change here */}
          
            <AnimatedBottle/>
          
            <h1 className="text-[40px] lg:text-[80px] font-bold font-jbm uppercase">
            degen chat
          </h1>
          <p className="text-[15px] lg:text-[24px] uppercase font-jbm">
            autism friendly chat interface from the future
          </p>
          {showConnectWallet ? (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`bg-white ${
                showVerifying ? "opacity-100" : "opacity-100"
              } coming-soon-shadow text-[#0000FF]  uppercase font-jbm text-[15px] lg:text-[24px] p-2 lg:p-4 w-[90%] mx-auto mt-5 sm:w-full flex flex-col gap-2 ${
                showWalletTransactionsError &&
                "bg-opacity-0 anti-coming-soon-shadow opacity-100"
              }`}
            >
              <div className=" mx-auto">
                {showVerifying ? (
                  <>
                    {showWalletTransactionsError ? (
                      <div className=" text-white text-center mt-[-10px] flex flex-col gap-[10px] ">
                        <div className=" flex justify-center">
                          <TransactionsCountErrorIcon />
                        </div>
                        <p>access denied</p>
                        <p className=" lg:w-[1000px]">
                          wallet must have at least 69 transactions in the past
                          to access this universe
                        </p>
                      </div>
                    ) : (
                      <p>verifying...</p>
                    )}
                  </>
                ) : (
                  <SolanaConnect
                    setShowVerifying={setShowVerifying}
                    setShowWalletTransactionsError={
                      setShowWalletTransactionsError
                    }
                  />
                )}
              </div>
            </motion.div>
          ) : showWalletTransactionsError && showVerifying ? (
            <></>
          ) : (
            <button
            className="bg-white coming-soon-shadow text-[#0000FF] uppercase font-jbm text-[15px] lg:text-[24px] p-2 lg:p-4 w-[90%] mx-auto mt-5 sm:w-full"
            onClick={() => {
              console.log("Wallet Address:", walletAddress);
              if (walletAddress) {
                return navigate("/chat");
              } else {
                return setShowConnectWallet(true);
              }
            }}
          >
            connect n chat
          </button>
          )}
        </div>
      </div>
      <div className="lg:hidden absolute top-0 left-0 w-full h-full bg-black opacity-30 z-0"></div>
    </div>
  );
};

export default App;
