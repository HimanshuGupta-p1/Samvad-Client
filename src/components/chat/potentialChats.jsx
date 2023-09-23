import { Container, Form, Stack } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { ChatContext } from "../../context/ChatContext"
import { AuthContext } from "../../context/AuthContext";

export const PotentialChats = () => {
  const [searchUser, setSearchUser] = useState('')
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);
  const [potentialChats1, setPotentialChats1] = useState(potentialChats)

  useEffect(() => {
    const potentialChatstemp = potentialChats.filter((item) => {
      if (item.name.toLowerCase().includes(searchUser.toLowerCase())){ 
        return item; 
      }
    });
    if (searchUser === "")
      setPotentialChats1(potentialChats)
    else  
      setPotentialChats1(potentialChatstemp)
  }, [searchUser, potentialChats])
  // console.log("pchats", potentialChats);
  return (
    <>
      <Container className="p-2 search">
      <div className="text-light ">
              Search User to Chat with them.
            </div>
          <Form className="d-flex w-50 justify-content-md-center">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2 rounded-pill"
              aria-label="Search"
              // style={{background: "transparent"}}
              onChange={(e) => {setSearchUser(e.target.value)}}
            />
          </Form>
          <Stack className="w-50">
          {potentialChats1 && potentialChats1.map((u, index) => {
          return (
            <div className="single-user text-light messages-box text-center" key={index} onClick={() => createChat(user?._id, u._id)}>
              {u.name}
              <span className={onlineUsers?.some((user) => user?.userId == u?._id) ?
                "user-online" : ""} style={{ position: "absolute" }}></span>
            </div>
          );
        })}
          </Stack>
    </Container>
    </>
  )
}
