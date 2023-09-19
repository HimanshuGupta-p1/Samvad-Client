import React, { useContext } from 'react'
import { useFetchRecipientUser } from '../../hooks/useFetchRecipient'
import avatar from '../../assets/avatar.svg'
import { Stack } from 'react-bootstrap';
import { ChatContext } from '../../context/ChatContext';
import { unreadNotificationsFunc } from '../../utils/unreadNotifications';
import { useFetchLatestMessage } from '../../hooks/useFetchLatestMessage';
import moment from 'moment';
import Avatar from '../Avatar';

var colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
'#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
'#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
'#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
'#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
'#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
'#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
'#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
'#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
'#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

const UserChat = ({chat, user}) => {
    const {recipientUser} = useFetchRecipientUser(chat, user);
    const {onlineUsers, notifications, markThisUserNotificationAsRead} = useContext(ChatContext);
    const {latestMessage} = useFetchLatestMessage(chat);

    const unreadNotifications = unreadNotificationsFunc(notifications);
    const thisUserNotifications = unreadNotifications?.filter(
        (n) => n.senderId === recipientUser?._id
    );
    const bgColor = colors[(Math.floor(Math.random() * colors.length))];

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