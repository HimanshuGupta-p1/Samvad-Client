import React, { useContext } from 'react'
import { Container, Nav, Navbar, Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Notification from './chat/Notification'
import Avatar from './Avatar'

export const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <Navbar className="mb-4" style={{ height: "3.75rem" }}>
      <Container>
        <h2>
          <Link to="/" className='link-light text-decoration-none'>
            SAMVAD
          </Link>
        </h2>
        
        <Nav>

          <Stack direction='horizontal' gap={3}>
            {
              user && (<>
              <Notification/>
              <Avatar px="10px" py="5px" borderRadius="50%" color="white" border="solid white 2px">
        <span className='text-light'>{user?.name.charAt(0).toUpperCase()} </span>
        </Avatar>
                <Link onClick={() => logoutUser()} to="/login"
                  className="link-light text-decoration-none" >
                  LogOut</Link></>)
            }
            
            {
              !user && <>
                <Link to="/login" className='link-light text-decoration-none'>
                  Login
                </Link>
                <Link to="/register" className='link-light text-decoration-none'>
                  Register
                </Link></>
            }
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  )
}
