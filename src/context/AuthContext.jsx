import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setisRegisterLoading] = useState(null);
    const [LoginError, setLoginError] = useState(null);
    const [isLoginLoading, setisLoginLoading] = useState(null);
    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: ""
    });

    // console.log("User", user);
    // console.log("LoginInfo", loginInfo);

    useEffect(() => {
        const user = localStorage.getItem("User")
        setUser(JSON.parse(user));
    }, [])
    const registerUser = useCallback(async (e) => {
        e.preventDefault();
        setisRegisterLoading(true);
        setRegisterError(null);
        const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo))
        setisRegisterLoading(false);
        if (response.error) {
            return setRegisterError(response);
        }
        localStorage.setItem("User", JSON.stringify(response))
        setUser(response);
    }, [registerInfo])

    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info);
    }, [])

    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info);
    }, [])
    
    const logoutUser = useCallback(() => {
        localStorage.removeItem("User");
        setUser(null);
    }, [])

    const loginUser = useCallback(async (e) => {
        e.preventDefault();
        setisLoginLoading(true);
        setLoginError(null);
        const response = await postRequest(
            `${baseUrl}/users/login`,
            JSON.stringify(loginInfo));
        setisLoginLoading(false);
        if (response.error) {
            return setLoginError(response);
        }
        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);

    }, [loginInfo])

    return (<AuthContext.Provider
        value={{
            user,
            registerInfo,
            updateRegisterInfo,
            registerUser,
            registerError,
            isRegisterLoading,
            logoutUser,
            loginUser,
            LoginError,
            loginInfo,
            updateLoginInfo,
            isLoginLoading
        }}>
        {children}
    </AuthContext.Provider>
    );
}