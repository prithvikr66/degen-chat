import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { websiteThemeState } from "../atoms/website-theme";
import Navbar from "./Navbar";
import { useState } from "react";
import errorIcon from "../assets/error.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { userNameState, userProfilePicState } from "../atoms/users";
import { MdDriveFolderUpload } from "react-icons/md";
import profileIcon from "../assets/profile.png";

const BASE_URI = import.meta.env.VITE_BASE_URI;


const Profile = () => {
  const websiteTheme = useRecoilValue(websiteThemeState);
  const setusername = useSetRecoilState(userNameState);
  const [userName, setUserName] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [, setShowProfilePicError] = useState(false);
  const [showFileUploadSuccess, setShowFileUploadSuccess] = useState(false);
  const [profilePicFromS3, setProfilePicFromS3] =
    useRecoilState(userProfilePicState);

  const walletAddress = localStorage.getItem("walletAddress");

  const validateUsername = async () => {
    if (userName.length <= 15) {
      try {
        setShowError(false);
        const result = await axios.post(
          `${BASE_URI}/api/profile?walletAddress=${walletAddress}&username=${userName}`
        );
        setUserName("");
        if (result.status === 201) {
          setShowSuccess(true);
          setusername(result.data.user.username);
        }
      } catch (err: any) {
        if (err.response) {
          if (err.response.status === 409) {
            setShowError(true);
          }
        }
      }
    } else {
      alert("Username cannot exceed 15 characters");
    }
  };

  const handleFileChange = (event: any) => {
    setShowProfilePicError(false);
    const file = event.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setProfilePic(file);
    } else {
      setShowProfilePicError(true);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!profilePic) {
      return;
    }
  

    const formData = new FormData();
    formData.append("profilePic", profilePic);

    try {
      const response = await axios.post(
        `${BASE_URI}/api/profile-pic?walletAddress=${walletAddress}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = response.data;
      setProfilePicFromS3(data.data.Location);
      setShowFileUploadSuccess(true);

      setProfilePic(data.data.Location);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const renderProfilePic = () => {
    if (!profilePic) {
        return profileIcon;
    } else if (profilePicFromS3) {
      return profilePicFromS3;
    }
  };

  return (
    <div
      style={{
        backgroundColor: websiteTheme.bgColor,
        color: websiteTheme.textColor,
      }}
      className="uppercase h-screen max-h-screen w-full font-jbm"
    >
      <div className="h-[10%] ">
        <div className="w-[90%] flex justify-end">
          <Navbar websiteTheme />
        </div>
      </div>

      <div className="   h-[90%] flex flex-col items-center justify-center relative top-[-100px] gap-5 lg:gap-10 w-full ">
        <div className=" relative group  border border-white h-[100px] w-[100px] lg:h-[200px] lg:w-[200px] rounded-[100%] flex items-center justify-center ">
          <div className=" rounded-full h-full w-full overflow-hidden ">
            <img
              src={renderProfilePic()}
              className=" object-cover w-full h-full"
            />
          </div>
          <form
            onSubmit={handleSubmit}
            className=" absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full h-full"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="fileInput"
              onChange={handleFileChange}
            />
            <label
              htmlFor="fileInput"
              className="flex items-center justify-center cursor-pointer w-full h-full"
            >
              <MdDriveFolderUpload className=" w-full h-auto opacity-0" />
            </label>
          </form>
        </div>
        <div className=" flex items-center gap-2 ">
          <div
            className=" border  p-2 lg:p-5 text-[15px] lg:text-[20px]"
            style={{
              borderColor: websiteTheme.textColor,
            }}
          >
            username
          </div>
          <div>
            <input
              style={{
                borderColor: websiteTheme.textColor,
              }}
              placeholder="type here"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className={`  bg-inherit uppercase  border  p-2 lg:p-5 text-[15px] lg:text-[20px] outline-none ${
                showError ? "text-red-600" : "text-white"
              }`}
            />
          </div>
        </div>
        {showError && (
          <div className=" flex gap-2 items-center justify-center ">
            <img src={errorIcon} />
            <p>name taken try something else</p>
          </div>
        )}
        {showSuccess && (
          <div className=" flex gap-2 items-center justify-center ">
            <p>username added successfully</p>
          </div>
        )}
        {showFileUploadSuccess && (
          <div className=" flex gap-2 items-center justify-center ">
            <p>Profile Picture updated successfully</p>
          </div>
        )}
        <button
          onClick={(e) => {
            if (userName.length > 0 && profilePic) {
              validateUsername();
              handleSubmit(e);
            } else if (!userName && profilePic) {
              handleSubmit(e);
            } else if (!profilePic && userName.length > 0) {
              validateUsername();
            }
          }}
          className={`  p-2 lg:p-5 uppercase  text-[#0000ff] w-[320px] lg:w-[450px] text-[15px] lg:text-[20px] ${
            userName.length === 0 || profilePic ? "opacity-80" : "opacity-100"
          }`}
          style={{
            backgroundColor: websiteTheme.textColor,
            color: websiteTheme.bgColor,
          }}
        >
          save
        </button>
        <Link to="/chat">
          <p className=" uppercase text-[15px] lg:text-[20px]">Back to chat</p>
        </Link>
      </div>
    </div>
  );
};

export default Profile;
