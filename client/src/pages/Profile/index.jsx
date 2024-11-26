import React, { useState, useEffect, useRef } from "react";
import { userAppStore } from "@/Store";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import { IoArrowBack } from "react-icons/io5";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  ADD_PROFILE_IMAGE,
  HOST,
  REMOVE_PROFILE_IMAGE,
  UPDATE_PROFILE_ROUTES,
} from "@/utils/constants";

const Profile = () => {
  const navigate = useNavigate();
  const { userinfo, setUserInfo } = userAppStore();
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const colors = [
    "bg-gradient-to-br from-purple-600 to-blue-500",
    "bg-gradient-to-br from-rose-500 to-orange-400",
    "bg-gradient-to-br from-green-400 to-cyan-500",
    "bg-gradient-to-br from-pink-500 to-purple-500",
    "bg-gradient-to-br from-yellow-400 to-orange-500",
  ];

  const getColor = (index) => colors[index] || colors[0];

  useEffect(() => {
    if (userinfo.profileSetup) {
      setFirstname(userinfo.firstName);
      setLastName(userinfo.lastName);
      setSelectedColor(userinfo.color);
    }

    if (userinfo.image) {
      setImage(`E:/pract/server/uploads/${userinfo.image}`);
      console.log(image);
    }
    console.log(userinfo);
  }, [userinfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("FirstName is required.");
      return false;
    }

    if (!lastName) {
      toast.error("LastName is required.");
      return false;
    }

    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      setIsLoading(true); // Set loading state

      try {
        const response = await axios.post(
          UPDATE_PROFILE_ROUTES,
          {
            firstName,
            lastName,
            color: selectedColor,
          },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile updated successfully");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error updating profile");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlenavigate = () => {
    if (userinfo && userinfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup profile.");
    }
  };

  const handlefileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      try {
        const response = await axios.post(ADD_PROFILE_IMAGE, formData, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data.image) {
          setUserInfo({ ...userinfo, image: response.data.image });
          toast.success("Image uploaded successfully");
        }
      } catch (error) {
        console.log("Error uploading image: ", error);
        toast.error("Error uploading image");
      }
    }
  };

  const handleImageDelete = async () => {
    try {
      const response = await axios.delete(REMOVE_PROFILE_IMAGE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserInfo({ ...userinfo, image: null });
        toast.success("Image deleted successfully");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error deleting image");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1b1c24] to-[#2d2e3d] flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] opacity-5 blur-xl" />
      </div>

      <Card className="w-[90vw] md:w-[800px] bg-black/30 backdrop-blur-xl border-white/10 p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-gradient" />

        <button
          onClick={handlenavigate}
          className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
        >
          <IoArrowBack className="text-2xl group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <div
              className="relative group"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Avatar className="h-40 w-40 md:h-48 md:w-48 ring-4 ring-white/10 ring-offset-2 ring-offset-black/50 transition-all duration-300 group-hover:ring-white/30">
                {image ? (
                  <AvatarImage
                    src={image}
                    alt="profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div
                    className={`uppercase w-full h-full text-5xl font-bold flex items-center justify-center ${getColor(
                      selectedColor
                    )}`}
                  >
                    {firstName
                      ? firstName[0]
                      : userinfo.email
                      ? userinfo.email[0]
                      : ""}
                  </div>
                )}
              </Avatar>

              <div
                className={`absolute inset-0 flex items-center justify-center rounded-full transition-all duration-300 ${
                  hovered ? "bg-black/50" : "bg-transparent pointer-events-none"
                }`}
              >
                {image ? (
                  <FaTrash
                    className="text-white text-3xl cursor-pointer transform scale-0 group-hover:scale-100 transition-transform duration-300"
                    onClick={handleImageDelete}
                  />
                ) : (
                  <label className="text-white text-3xl cursor-pointer transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <FaPlus onClick={handlefileInputClick} />
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              {colors.map((color, index) => (
                <button
                  key={index}
                  className={`h-8 w-8 rounded-full transition-all duration-300 transform hover:scale-110 ${color} ${
                    selectedColor === index
                      ? "ring-2 ring-white ring-offset-2 ring-offset-[#1b1c24]"
                      : ""
                  }`}
                  onClick={() => setSelectedColor(index)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Input
              placeholder="Email"
              type="email"
              disabled
              value={userinfo.email || "User"} // Ensure email is set here correctly
              className="h-12 bg-white/5 border-white/10 focus:border-purple-500 transition-colors"
            />

            <Input
              placeholder="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstname(e.target.value)}
              className="h-12 bg-white/5 border-white/10 focus:border-purple-500 transition-colors"
            />

            <Input
              placeholder="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-12 bg-white/5 border-white/10 focus:border-purple-500 transition-colors"
            />

            <Button
              onClick={saveChanges}
              isLoading={isLoading}
              className="mt-4 bg-gradient-to-br from-purple-500 to-pink-500 hover:bg-gradient-to-br focus:ring focus:ring-offset-2 focus:ring-purple-300"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
