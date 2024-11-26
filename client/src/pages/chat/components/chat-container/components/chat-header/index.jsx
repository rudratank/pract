import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { userAppStore } from "@/Store";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";

function ChatHeader() {
  const { closeChat, selectedChatData, selectedChatType } = userAppStore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center justify-center">
          <Avatar className="w-12 h-12 ring-2 ring-white/10">
            {selectedChatData.image ? (
              <AvatarImage
                src={`${HOST}/${selectedChatData.image}`}
                alt={`${selectedChatData.firstName || ""}'s avatar`}
              />
            ) : (
              <div
                className={`flex items-center justify-center w-full h-full text-lg font-bold ${getColor(
                  selectedChatData.color
                )}`}
              >
                {selectedChatData.firstName?.[0] || selectedChatData.email?.[0]}
              </div>
            )}
          </Avatar>
          <div>
            {selectedChatType === "contact" && selectedChatData.firstName?
              `${selectedChatData.firstName} ${selectedChatData.lastName}`: selectedChatData.email}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
