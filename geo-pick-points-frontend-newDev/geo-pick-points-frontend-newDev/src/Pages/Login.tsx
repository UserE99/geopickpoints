import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { authentication } from "../actions/Authentication";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/index';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { createNewPlayer } from "../actions/CreateNewPlayer";
import Logout from "../components/Logout";



interface LoginPageState {
    showDialog: boolean;
    name: string;
    password: string;
    pending: boolean;
    isError: boolean;
    errorMessage: string;

}


const LoginPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [errors, setErrors] = useState<{ name?: string; password?: string | null }>({});

    const [state, setState] = useState<LoginPageState>({
        showDialog: false,
        name: '',
        password: '',
        pending: false,
        isError: false,
        errorMessage: '',
    });

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    let isLoggedInA = useSelector((state: RootState) => state.authentication.authen.isLoggedIn)
    const [codeInvite, setCodeInvite] = useState<string | null>(null);
    const [searchParams] = useSearchParams();

    //Case : login with share-Links and QACode
    // Extrahiere `codeInvite`-Parameter aus der URL
    useEffect(() => {
        const code = searchParams.get("c");

        if (code) {
            setCodeInvite(code);
        }

        const path = window.location.pathname;
        const match = path.match(/\/ReadQACode\/([A-Z0-9]+)/);

        if (match) {
            const qaCodeIn = match[1];
            setCodeInvite(qaCodeIn);
        }

    }, [searchParams]);


    // Run authentication check on component mount
    useEffect(() => {
        const checkAuthentication = () => {
            const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
            setIsLoggedIn(!!token);
            if (!token) {
                isLoggedInA = false;
                setIsLoggedIn(false);
                navigate("/");
            }
        };

        // Listen for storage changes (triggered by logout in another tab)
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "authToken" && event.oldValue) {
                checkAuthentication();
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


    const handleShow = () => {
        setState(prevState => ({ ...prevState, showDialog: true }));
    };

    const handleClose = () => {
        setState(prevState => ({
            ...prevState,
            name: '',
            password: '',
            showDialog: false,
            isError: false,
            errorMessage: "",
        }));
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Validate form inputs
    const validateForm = (): boolean => {
        const newErrors: { name?: string; password?: string } = {};
        if (!state.name) newErrors.name = "Name is required.";
        if (!state.password) newErrors.password = "Password is required.";
        else if (state.password.length < 6) newErrors.password = "Password must be at least 6 characters long.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        const { name, password } = state;
        if (!validateForm()) {
            return;
        }
        setState(prevState => ({
            ...prevState,
            pending: true,
            isError: false,
            errorMessage: '',
        }));

        try {
            // Dispatch den Thunk mit den Login-Daten
            const result = await dispatch(authentication({ name, password }));
            if (authentication.fulfilled.match(result)) {

                setState(prevState => ({
                    ...prevState,
                    showDialog: false,
                    name: '',
                    password: '',
                    isLoggedIn: true,
                }));

                const token = result.payload.token;
                const decodedToken = atob(token.split(".")[1]);
                const userInformation = JSON.parse(decodedToken);
                const idOfUser = userInformation.id;

                const email = userInformation.email;
                isLoggedInA = true;

                //session 
                sessionStorage.setItem("authToken", token);
                localStorage.setItem("authToken", token);

                const newPlayer = await dispatch(createNewPlayer({ nickName: name, host: false }));
                const playerID = newPlayer.payload.id;

                if (createNewPlayer.fulfilled.match(newPlayer)) {
                    if (codeInvite) {
                        let host = false;
                        const nickName = state.name;
                        isLoggedInA = true;

                        try {
                            navigate("/LobbyGamePage", {
                                state: { codeInvite, playerID, nickName, host },
                            });
                        } catch (err) {
                            console.error("Error creating the player:", err);
                        }
                    } else {

                        isLoggedInA = true;
                        navigate("/GamePageUser", {
                            state: { idOfUser, nickName: state.name, host: false, email: email },
                        });
                    }
                } else {
                    const error = result.payload || 'Error during  add new Player';
                }

            } else {

                const error = result.payload || 'Error during login';
                setState(prevState => ({
                    ...prevState,
                    pending: false,
                    isError: true,
                    errorMessage: error,
                }));

            }
        } catch (error) {
            console.error('Login failed:', error);
            let errorMessage: string;

            // Handle the case when HTML is returned (e.g., HTML error page)
            if (error instanceof Response && error.headers.get('Content-Type')?.includes('text/html')) {
                errorMessage = "An error occurred. Please try again.";
            } else {
                errorMessage = (error instanceof Error && error.message)
                    ? error.message
                    : "An unknown error occurred during login.";
            }

            handleLoginError(errorMessage);
            console.log("error in login..++handleLoginError(error)+++", handleLoginError(error))

        } finally {
            setState(prevState => ({ ...prevState, pending: false }));
        }
    };


    const handleLoginError = (error: any) => {
        // Handle undefined error gracefully by setting a default error message
        const errorMessage: string =
            (error && typeof error === 'object' && 'message' in error)
                ? (error as { message: string }).message
                : typeof error === 'string'
                    ? error
                    : "An unknown error has occurred.";

        // Update the state with the error message
        setState(prevState => ({
            ...prevState,
            isError: true,
            errorMessage: errorMessage,
        }));

        // Log the error for debugging purposes
        console.error("Login error:", errorMessage);
    };



    const handleSignup = async () => {
        setState(prevState => ({
            ...prevState,
            showDialog: false,
        }));
        const url = codeInvite ? `/Signup?c=${codeInvite}` : "/Signup";
        navigate(url);
    }
    const handleForgotPassword = async () => {
        setState(prevState => ({
            ...prevState,
            showDialog: false,
        }));
        navigate("/forgotPassword")
    }


    //isLoggedIn,
    const { showDialog, pending, isError, errorMessage } = state;
    const isAuthenticated = isLoggedInA;

    return (
        <div>
            {isAuthenticated ? (
                <Logout />
            ) : (
                <div style={{ margin: "0.2rem" }}>
                    <><Button
                        id="OpenLoginDialogButton"
                        variant="primary"
                        onClick={handleShow} style={{
                            backgroundColor:process.env.REACT_APP_COLOR_SECONDARY,
                            color:process.env.REACT_APP_COLOR_PRIMARY,
                            borderColor:process.env.REACT_APP_COLOR_PRIMARY,
                            }} 
                    >
                        Login
                    </Button></> <Button style={{
                            backgroundColor:process.env.REACT_APP_COLOR_PRIMARY,
                            color:process.env.REACT_APP_COLOR_SECONDARY,
                            borderColor:process.env.REACT_APP_COLOR_SECONDARY,
                            }}  variant="warning" onClick={handleSignup}> Signup</Button></div>
            )}

            <Modal id="LoginDialog" show={showDialog} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group style={{ margin: "0.5rem" }}>

                            <Form.Control
                                id="LoginDialogUserIDText"
                                type="text"
                                placeholder="name"
                                name="name"
                                value={state.name}
                                onChange={handleChange}
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group style={{ margin: "0.5rem" }}>
                            <Form.Control
                                id="LoginDialogPasswordText"
                                type="password"
                                placeholder="password"
                                name="password"
                                value={state.password}
                                onChange={handleChange}
                                autoComplete="off"
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>

                            <div className="d-flex align-items-center" style={{ margin: "0.5rem" }}>
                                <Button variant="primary" onClick={handleLogin} disabled={pending}>
                                    Login
                                </Button>
                                {pending && <Spinner animation="border" variant="primary" className="ms-3" />}
                                {isError && errorMessage && (
                                    <span style={{ color: "red", marginLeft: "1rem" }}>
                                        {errorMessage.replace(/^"|"$/g, '')}
                                    </span>
                                )}

                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>

                    <div onClick={handleForgotPassword} className="text-primary text-decoration-underline" style={{ cursor: "pointer" }}>Forgot password?</div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default LoginPage;