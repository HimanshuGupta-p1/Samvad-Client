import React, { useContext } from 'react'
import { useFetchRecipientUser } from '../../hooks/useFetchRecipient'
import { Stack } from 'react-bootstrap';
import { ChatContext } from '../../context/ChatContext';
import { unreadNotificationsFunc } from '../../utils/unreadNotifications';
import { useFetchLatestMessage } from '../../hooks/useFetchLatestMessage';
import moment from 'moment';
import Avatar from '../Avatar';

const UserChat = ({chat, user}) => {
    const {recipientUser} = useFetchRecipientUser(chat, user);
    const {onlineUsers, notifications, markThisUserNotificationAsRead} = useContext(ChatContext);
    const {latestMessage} = useFetchLatestMessage(chat);

    const unreadNotifications = unreadNotificationsFunc(notifications);
    const thisUserNotifications = unreadNotifications?.filter(
        (n) => n.senderId === recipientUser?._id
    );
    const isOnline = onlineUsers?.some((user) => user?.userId == recipientUser?._id);

    const cutText = (text) => {
        let shortText = text.substring(0, 20);

        if (text.length > 20){
            shortText = shortText + "...";
        }
        return shortText;
    }
    // console.log(recipientUser)
  return <Stack direction = "horizontal" gap={3} 
  className = "user-card align-items-center p-2 justify-content-between" 
  role = "button"
//   style={{backgroundColor: "#020202"}}
  onClick={() => {
    if (thisUserNotifications?.length !== 0){
        markThisUserNotificationAsRead(thisUserNotifications, notifications);
    }
  }}>
    <div className='d-flex'>
        <div className='me-2'>
        <Avatar px="12px" py="5px" borderRadius="50%" color="white" border="2px solid #f2f2f2">
        <span>{recipientUser?.name.charAt(0).toUpperCase()} </span>
        </Avatar>
        </div>
        <div className='text-content'>
            <div className='name'>{recipientUser?.name} 
            <span className={isOnline? 'user-online': ''} style={{position: "relative"}}></span>
            </div>
            <div className='text'>{latestMessage?.text && (
                <span>{cutText(latestMessage?.text)}</span>
            )}</div>
        </div>
    </div>
    <div className="d-flex flex-column align-items-end">
        <div className='date'>{moment(latestMessage?.createdAt).calendar()}</div>
        <div className={thisUserNotifications?.length > 0 ?'this-user-notifications': ""}>
            {thisUserNotifications?.length > 0 ? thisUserNotifications?.length: ""}
        </div>

    </div>
  </Stack>
}

export default UserChat