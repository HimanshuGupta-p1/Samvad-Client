import { Container, Form, Stack } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { ChatContext } from "../../context/ChatContext"
import { AuthContext } from "../../context/AuthContext";

var colors = ['#00B3E6',
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
  '#CCFF1A', '#E6331A', '#33FFCC', '#66994D',
  '#B366CC', '#4D8000', '#B33300', '#CC80CC',
  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
  '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
  '#E64D66', '#4DB380', '#99E6E6', '#6666FF'];

export const PotentialChats = () => {
  const [searchUser, setSearchUser] = useState('')
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

  useEffect(() => {
    console.log(searchUser)
  }, [searchUser])
  // console.log("pchats", potentialChats);
  return (
    <>
      <Container className="p-2 home">
          <Form className="d-flex w-50 justify-content-md-center">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2 rounded-pill text-light"
              aria-label="Search"
              style={{background: "transparent"}}
              onChange={(e) => {setSearchUser(e.target.value)}}
            />
          </Form>
          <Stack className="w-25">
          {potentialChats && potentialChats.map((u, index) => {
          const bgColor = colors[(Math.floor(Math.random() * colors.length))]
          return (
            <div className="single-user" key={index} onClick={() => createChat(user?._id, u._id)} style={{ backgroundColor: bgColor }}>
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
