import { userAppStore } from '@/Store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ContactsContainer from './components/contacts-container';
import EmptyChatConatiner from './components/empty-chat-container';
import ChatContainer from './components/chat-container';

function Chat() {
  const {userinfo,selectedChatType} = userAppStore();
  const navigate = useNavigate();

  useEffect(()=>{
    if(!userinfo.profileSetup){
         toast("Please Setup Profile to Continue");
         navigate("/profile")
    }
  },[userinfo,navigate])
    return (
    <div className='flex h-[100vh] text-white overflow-hidden'>
      <ContactsContainer/>
      {
        selectedChatType===undefined ? <EmptyChatConatiner/>:<ChatContainer/>
      }
      {/* <EmptyChatConatiner/> */}
      {/* <ChatContainer/> */}
    </div>
  )
}

export default Chat
