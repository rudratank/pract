import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../../../components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { animationDefaultOption, getColor } from "@/lib/utils";
import Lottie from "react-lottie";
import axios from "axios";
import { HOST, SEACRCH_CONTACTS_ROUTES } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { userAppStore } from "@/Store";

function NewDM() {
  const { setSelectedChatType, setSelectedChatData } = userAppStore();
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [contactResults, setContactResults] = useState([]);
  const [searchError, setSearchError] = useState(false);

  // Search contacts with debounce or live update
  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.trim().length > 0) {
        const response = await axios.post(
          SEACRCH_CONTACTS_ROUTES,
          { searchTerm },
          { withCredentials: true }
        );

        if (response.status === 200 && response.data.contacts) {
          setContactResults(response.data.contacts);
        } else {
          setContactResults([]);
        }
        setSearchError(false);
      } else {
        setContactResults([]);
      }
    } catch (error) {
      console.error("Error searching contacts:", error);
      setSearchError(true);
    }
  };

  // Select a contact and reset state
  const selectNewContact = (contact) => {
    setOpenNewContactModel(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setContactResults([]);
  };

  // Render fallback UI
  const renderFallback = () => (
    <div className="flex flex-col items-center justify-center flex-1 text-center">
      <Lottie
        isClickToPauseDisabled
        height={150}
        width={150}
        options={animationDefaultOption}
      />
      <h3 className="mt-4 text-white text-opacity-80 text-lg">
        Start by searching for a <span className="text-purple-500">Contact</span>!
      </h3>
    </div>
  );

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 hover:text-white transition duration-300 cursor-pointer text-lg"
              onClick={() => setOpenNewContactModel(true)}
              aria-label="Add New Contact"
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] text-white p-2">
            Add New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog
        open={openNewContactModel}
        onOpenChange={() => setOpenNewContactModel(!openNewContactModel)}
      >
        <DialogContent className="bg-[#181920] text-white w-full max-w-md p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle>Select a Contact</DialogTitle>
            <DialogDescription>Search and select a contact to chat with.</DialogDescription>
          </DialogHeader>

          <Input
            placeholder="Search Contacts"
            className="rounded-lg mt-4 p-3 bg-[#2c2e3b] border-none"
            onChange={(e) => searchContacts(e.target.value)}
          />
{
  setContactResults.length>0 &&
          <ScrollArea className="h-[250px] mt-4">
            <div className="flex flex-col gap-4">
              {contactResults.map((contact) => (
                <div
                key={contact._id}
                className="flex items-center p-2 gap-3 bg-[#202124] rounded-lg cursor-pointer hover:bg-[#292b2f] transition"
                onClick={() => selectNewContact(contact)}
                >
                  <Avatar className="w-12 h-12 ring-2 ring-white/10">
                    {contact.image ? (
                      <AvatarImage
                      src={`${HOST}/${contact.image}`}
                      alt={`${contact.firstName || ""}'s avatar`}
                      />
                    ) : (
                      <div
                      className={`flex items-center justify-center w-full h-full text-lg font-bold ${getColor(
                        contact.color
                      )}`}
                      >
                        {contact.firstName?.[0] || contact.email?.[0]}
                      </div>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-white font-medium">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className="text-gray-400 text-sm">{contact.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
            }

          {contactResults.length === 0 && !searchError && renderFallback()}

          {searchError && (
            <div className="mt-4 text-center text-red-500">
              Unable to fetch contacts. Please try again later.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewDM;
