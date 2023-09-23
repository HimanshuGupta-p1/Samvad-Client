import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatContext'
import { Container, Stack } from 'react-bootstrap';
import UserChat from '../components/chat/UserChat';
import { AuthContext } from '../context/AuthContext';
import { ChatBox } from '../components/chat/ChatBox';
import { PotentialChats } from '../components/chat/potentialChats';

const Chat = () => {
  const {user} = useContext(AuthContext);
  const {userChats,
    currentChat,
    isUserChatsLoading,
    updateCurrentChat} = useContext(ChatContext);
    // console.log("User Chats", userChats);
  return (
    <>
      <Container className='home'>
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
          {
            currentChat? <ChatBox/>:
            <>
            <p style={{ textAlign: "center", width: "100%" , color: "rgb(241, 239, 239)"}}>
                Click on Conversation to Chat...
            </p>
            <PotentialChats/>
            </>
          }
          
          </Stack>
      </Container>
    </>
  )
}

export default Chat