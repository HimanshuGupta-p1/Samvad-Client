import React, { useContext } from 'react'
import {Alert, Button, Form, Row, Col, Stack} from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext';
const Login = () => {
    const {
        loginUser,
        LoginError,
        loginInfo,
        updateLoginInfo,
        isLoginLoading } = useContext(AuthContext);
  return (
    <>
    <Form onSubmit={loginUser}  className='home'>
        <Row style={{
            height: "100vh",
            justifyContent:"center",
            paddingTop: "10%"
        }}>
            <Col xs={4}>
                <Stack gap={3}>
                    <h2 style={{textAlign:"center"}}>Login</h2> 
                    <Form.Control type="email" placeholder="Email" onChange={(e) => updateLoginInfo({...loginInfo, email: e.target.value})}/>
                    <Form.Control type="password" placeholder="Password" onChange={(e) => updateLoginInfo({...loginInfo, password: e.target.value})}/>
                    <Button variant="primary" type="submit">
                        {isLoginLoading? "Getting you in..." : "Login"}
                    </Button>
                    {LoginError?.error &&
                    <Alert variant='danger'>
                        <p>An error occured.</p>
                    </Alert>
}
                </Stack>
            </Col>
        </Row>
    </Form>
    </>
  )
}

export default Login;