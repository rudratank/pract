import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getColor } from "@/lib/utils";
import { userAppStore } from "@/Store";
import { HOST, LOGOUT_ROUTE,  } from "@/utils/constants";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function ProfileInfo() {
  const { userinfo,setUserInfo } = userAppStore();
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      const response=await axios.post(LOGOUT_ROUTE,{},{withCredentials:true});

      if(response.status===200){
        navigate('/auth');
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex items-center gap-2">
        <div className="relative w-12 h-12">
          <Avatar className="w-12 h-12 ring-4 ring-white/10 ring-offset-2 ring-offset-black/50 transition-all duration-300 group-hover:ring-white/30">
            {userinfo.image ? (
              <AvatarImage
                src={`${HOST}/${userinfo.image}`}
                alt="profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <div
                className={`flex items-center justify-center w-full h-full text-lg font-bold uppercase ${getColor(
                  userinfo.color
                )}`}
              >
                {userinfo.firstName?.[0] || userinfo.email?.[0] || ""}
              </div>
            )}
          </Avatar>
        </div>
        <div className="text-white font-medium">
          {userinfo.firstName && userinfo.lastName
            ? `${userinfo.firstName} ${userinfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="text-purple-500 text-xl cursor-pointer"
                onClick={() => navigate("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1be] text-white border-none">
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                className="text-red-500 text-xl cursor-pointer"
                onClick={logOut}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1be] text-white border-none">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default ProfileInfo;
