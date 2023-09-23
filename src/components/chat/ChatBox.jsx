import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import moment from 'moment';
import InputEmoji from 'react-input-emoji'
import { PotentialChats } from "./potentialChats";

export const ChatBox = () => {
    const { user } = useContext(AuthContext);
    const { currentChat, messages,sendTextMessage, updateCurrentChat} = useContext(ChatContext);
    let { recipientUser } = useFetchRecipientUser(currentChat, user);
    const [textMessage, setTextMessage] = useState('');
    const scroll = useRef();

    const closeChat = () => {
        updateCurrentChat(null);
        recipientUser = null;
    }
    // console.log(textMessage);


    useEffect(() => {
        scroll.current?.scrollIntoView({behaviour: "smooth"})
    }, [messages]);

    return (
            <Stack gap={4} className="chat-box">
            <div className="chat-header">
                <strong>{recipientUser?.name}</strong>
            </div>
            <Stack gap={3} className="messages">
                {messages &&
                    messages.map((message, index) => (
                        <Stack key={index}
                            className={`${message?.senderId === user?._id ?
                                "message self align-self-end flex-grow-0" :
                                "message align-self-start flex-grow-0"}`}
                            ref={scroll}>

                            <span>{message.text}</span>
                            <span className="message-footer">{moment(message.createdAt).calendar()}</span>
                        </Stack>))}
            </Stack>
            
            <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
            <svg xmlns="http://www.w3.org/2000/svg" style={{cursor:"pointer"}} onClick={() => closeChat()} x="0px" y="0px" width="30" height="30" viewBox="0 0 512 512">
<path fill="#E04F5F" d="M504.1,256C504.1,119,393,7.9,256,7.9C119,7.9,7.9,119,7.9,256C7.9,393,119,504.1,256,504.1C393,504.1,504.1,393,504.1,256z"></path><path fill="#FFF" d="M285,256l72.5-84.2c7.9-9.2,6.9-23-2.3-31c-9.2-7.9-23-6.9-30.9,2.3L256,222.4l-68.2-79.2c-7.9-9.2-21.8-10.2-31-2.3c-9.2,7.9-10.2,21.8-2.3,31L227,256l-72.5,84.2c-7.9,9.2-6.9,23,2.3,31c4.1,3.6,9.2,5.3,14.3,5.3c6.2,0,12.3-2.6,16.6-7.6l68.2-79.2l68.2,79.2c4.3,5,10.5,7.6,16.6,7.6c5.1,0,10.2-1.7,14.3-5.3c9.2-7.9,10.2-21.8,2.3-31L285,256z"></path>
</svg>
                <InputEmoji value={textMessage}
                    onChange={setTextMessage}
                    fontFamily="nunito"
                    borderColor="rgba(72, 112, 223, 0.2)" />
                <button className="send-btn" onClick={() => sendTextMessage(textMessage, user, currentChat?._id, setTextMessage)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                    </svg>
                </button>
            </Stack>
        </Stack>
        
    )
}
