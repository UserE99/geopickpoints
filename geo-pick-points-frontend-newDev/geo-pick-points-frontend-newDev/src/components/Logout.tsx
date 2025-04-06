import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/index";
import { useNavigate } from "react-router-dom";


const Logout: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    let isLoggedInA = useSelector((state: RootState) => state.authentication.authen.isLoggedIn)
    const navigate = useNavigate();


    useEffect(() => {
        // Listen for storage changes (triggered by logout in another tab)
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "authToken" && !event.newValue) {
                // Token was removed (logout detected)
                isLoggedInA = false;
                setIsLoggedIn(false);
                navigate("/");
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };

    }, [navigate]);


    //logout
    const logout = () => (dispatch: AppDispatch) => {
        dispatch({ type: "auth/logout" })
    }
    const logoutDialog = async () => {
        sessionStorage.removeItem("authToken");
        localStorage.removeItem('authToken');
        isLoggedInA = false;
        setIsLoggedIn(false);
        window.location.href = "/";
        dispatch(logout())
    }


    return (

        <Button variant="secondary" onClick={logoutDialog}>
            Logout
        </Button>

    );

};

export default Logout;