import { useRecoilValue } from "recoil";
import { websiteThemeState } from "../atoms/website-theme";

const Footer = ({
  chatState,
  setChatState,
}: {
  chatState: any;
  setChatState: any;
}) => {
  const websiteTheme = useRecoilValue(websiteThemeState);

  return (
    <div className="block mx-auto w-[90%] max-w-[600px] mt-4 mb-6 md:mb-8 lg:mb-10 xl:mb-12">
      {/* Main container for the footer */}
      <div
        className={`h-[40px] w-full bg-white rounded-md flex justify-between items-center px-1 md:px-2 lg:px-4 ${
          websiteTheme.bgColor === "#ffffff" ? "border border-black" : ""
        }`}
      >
        {/* Button for "den" state */}
        <div
          style={{
            backgroundColor: chatState === "DEN" ? websiteTheme.bgColor : "#ffffff",
            color: chatState === "DEN" ? websiteTheme.textColor : "#000000",
          }}
          onClick={() => setChatState("DEN")}
          className={`uppercase text-xs md:text-sm lg:text-base h-[36px] flex items-center justify-center rounded-md flex-1 cursor-pointer ${
            chatState === "DEN" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
          }`}
        >
          den
        </div>

        {/* Button for "PUMP" state */}
        <div
          style={{
            backgroundColor: chatState === "PUMP" ? websiteTheme.bgColor : "#ffffff",
            color: chatState === "PUMP" ? websiteTheme.textColor : "#000000",
          }}
          onClick={() => setChatState("PUMP")}
          className={`uppercase text-xs md:text-sm lg:text-base h-[36px] flex items-center justify-center rounded-md flex-1 cursor-pointer mx-0.5 md:mx-1 lg:mx-2 ${
            chatState === "PUMP" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
          }`}
        >
          PUMP
        </div>

        {/* Button for "ALPHA" state */}
        <div
          style={{
            backgroundColor: chatState === "ALPHA" ? websiteTheme.bgColor : "#ffffff",
            color: chatState === "ALPHA" ? websiteTheme.textColor : "#000000",
          }}
          onClick={() => setChatState("ALPHA")}
          className={`uppercase text-xs md:text-sm lg:text-base h-[36px] flex items-center justify-center rounded-md flex-1 cursor-pointer ${
            chatState === "ALPHA" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
          }`}
        >
          alpha
        </div>
      </div>
    </div>
  );
};

export default Footer;
