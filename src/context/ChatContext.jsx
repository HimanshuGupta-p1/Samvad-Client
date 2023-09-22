import {createContext, useCallback, useEffect, useState} from 'react'
import {io} from "socket.io-client"
import {baseUrl, postRequest, getRequest} from '../utils/services'
import { Navigate } from 'react-router-dom';

export const ChatContext = createContext();

export const ChatContextProvider = ({children, user}) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserLoading]  = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [IsMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);

    // console.log("CurrentChat:", currentChat)
    // console.log("Messages", messages);
    // console.log("Notifications", notifications);

    useEffect(() => {
        const newSocket = io("https://samvad-server.onrender.com");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, [user]);
    //add online users
    useEffect(() => {
        if (socket == null)
            return;
        socket.emit("addNewUser", user?._id);
        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res);
        });

        return () => {
            socket.off("getOnlineUsers");
        };

    }, [socket]);

    //send Message
    useEffect(() => {
        if (socket == null)
            return;
        const recipientId = currentChat?.members.find((id) => id != user?._id);

        socket.emit("sendMessage", {...newMessage, recipientId})

    }, [newMessage]);

    //recieveMessage and notifications
    useEffect(() => {
        if (socket == null)
            return;
        socket.on("getMessage", res => {
            if (currentChat?._id !== res.chatId) return;
            setMessages((prev) => [...prev, res]);
        });
        socket.on("getNotifications", (res) => {
            const isChatOpen = currentChat?.members.some((id) => id === res.senderId);
            if (isChatOpen){
                setNotifications(prev => [{...res, isRead: true}, ...prev])
            }
            else {
                setNotifications(prev => [res, ...prev]);
            }
        })
        return () => {
            socket.off("getMessage");
            socket.off("getNotifications");
        }
    }, [socket, currentChat]);

    
    useEffect(() => {
        const getUsers = async () => {
            const response = await getRequest(`${baseUrl}/users`);
            if (response.error){
                return console.log("Error fetching users", response);
            }

            const pChats = response.filter((u) => {
                let isChatCreated = false;
                if (user?._id === u._id) return false

                if (userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id;
                    });
                }

                return !isChatCreated;
            });

            setPotentialChats(pChats);
            setAllUsers(response);
        };

        getUsers();
    }, [userChats]);

    useEffect(() => {
        const getUserChats = async () => {
            if (user?._id) {
                setIsUserLoading(true);
                setUserChatsError(null);
                const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
                setIsUserLoading(false);
                if (response.error){
                    return setUserChatsError(response);
                }
                setUserChats(response);
            }
        };

        getUserChats();
    }, [user, notifications]);

    useEffect(() => {
        const getMessages = async () => {
            setIsMessagesLoading(true);
            setMessagesError(null);
            const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);
            setIsMessagesLoading(false);
            if (response.error){
                return setMessagesError(response);
            }
            setMessages(response);
        };

        getMessages();
    }, [currentChat]);

    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage)
            return;
        const response = await postRequest(`${baseUrl}/messages/`, JSON.stringify({
            chatId: currentChatId,
            senderId: sender?._id,
            text: textMessage
        }));

        if (response.error) {
            return setSendTextMessageError(response);
        }

        setNewMessage(response);
        setMessages((prev) => [...prev, response]);
        setTextMessage('');

    }, [])


    const updateCurrentChat = useCallback(async (chat) => {
        setCurrentChat(chat);
    }, []);

    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(`${baseUrl}/chats`, JSON.stringify({
            firstId, secondId
        }));

        if (response.error) {
            return console.log("Error creating chat", response);
        }
        // Navigate('/')
        setUserChats((prev) => [...prev, response]);

    }, []);

    const markAllNotificationsAsRead = useCallback((notifications) => {
        const mNotifications = notifications.map((n) => {
            return {
            ...n, isRead: true,
        }});

        setNotifications(mNotifications);
    }, []);

    const  markNotificationAsRead = useCallback((n, userChats, user, notifications) => {
        //find chat to open
        const desiredChat = userChats.find((chat) => {
            const chatMembers = [user?._id, n?.senderId];
            const isDesiredChat = chat?.members.every((member) => {
                return chatMembers.includes(member);
            });
            return isDesiredChat;
        });

        //mark notification as read
        const mNotifications = notifications.map((el) => {
            if (n.senderId === el.senderId){
                return {...n, isRead: true};
            } else {
                return el;
            }
        });

        updateCurrentChat(desiredChat);
        setNotifications(mNotifications);

    }, []);

    const markThisUserNotificationAsRead = useCallback((thisUserNotifications, notifications) => {
        //mark notification as read;
        const mNotifications = notifications.map((el) => {
            let notification;
            thisUserNotifications.forEach((n) => {
                if (n.senderId === el.senderId){
                    notification = {...n, isRead: true}
                }
                else { 
                    notification = el;
                }
            });
            return notification;
        });

        setNotifications(mNotifications);
    }, [])

    return <ChatContext.Provider
                value = {{
                    userChats,
                    isUserChatsLoading,
                    userChatsError,
                    potentialChats,
                    createChat,
                    updateCurrentChat,
                    currentChat,
                    messages,
                    IsMessagesLoading,
                    messagesError,
                    sendTextMessage,
                    onlineUsers,
                    notifications,
                    allUsers,
                    newMessage,
                    markAllNotificationsAsRead,
                    markNotificationAsRead,
                    markThisUserNotificationAsRead
                }}>
            {children}
    </ChatContext.Provider>
}