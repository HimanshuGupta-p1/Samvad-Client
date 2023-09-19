import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatContext'
import { Container, Stack } from 'react-bootstrap';
import UserChat from '../components/chat/UserChat';
import { AuthContext } from '../context/AuthContext';
import { PotentialChats } from '../components/chat/potentialChats';
import { ChatBox } from '../components/chat/ChatBox';
import SearchBar from '../components/Search';

const Chat = () => {
  const {user} = useContext(AuthContext);
  const {userChats,
    isUserChatsLoading,
    updateCurrentChat} = useContext(ChatContext);
    // console.log("User Chats", userChats);
  return (
    <>
      <Container className='home'>
        {/* <PotentialChats/> */}
        {userChats?.length < 1 ? null: 
        <Stack direction = "horizontal" gap={4} 
        className = "align-items-start" >
          <Stack className = "messages-box flex-grow-0 " gap={3}>
            {isUserChatsLoading && <p>
              Loading Chats...</p>}
            {userChats?.map((chat,index) => {
              return(
                <div key = {index} onClick={() => updateCurrentChat(chat)}>
                    <UserChat chat = {chat} user = {user} />
                </div>
              )
            })}
          </Stack>
          <ChatBox/>
          </Stack>}
      </Container>
    </>
  )
}

export default Chat