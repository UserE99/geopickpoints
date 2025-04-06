import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { RootState, useAppDispatch } from "../store/index";
import { register } from "../actions/Register";
import { authentication } from "../actions/Authentication";
import { createNewPlayer } from "../actions/CreateNewPlayer";
import { useSelector } from "react-redux";
import { FaEyeSlash, FaEye } from "react-icons/fa";

const eyesFill = <FaEye />;
const eyesNotFill = <FaEyeSlash />;

interface SignupPageState {
    name: string;
    password: string;
    email: string;
    pending: boolean;
    isError: boolean;
    errorMessage: string;
    showPassword: boolean;
}

const SignupPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [state, setState] = useState<SignupPageState>({
        name: "",
        email: "",
        password: "",
        pending: false,
        isError: false,
        errorMessage: "",
        showPassword: false,
    });

    const [errors, setErrors] = useState<{ name?: string; password?: string | null; email?: string }>({});
    let isLoggedInA = useSelector((state: RootState) => state.authentication.authen.isLoggedIn);
    const [codeInvite, setCodeInvite] = useState<string | null>(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const queryCode = searchParams.get("c"); // Query parameter
        const path = window.location.pathname;

        if (queryCode) {
            setCodeInvite(queryCode);
        } else {
            const regexMatch = path.match(/\/ReadQACode\/([A-Z0-9]+)/);
            if (regexMatch) {
                setCodeInvite(regexMatch[1]);
            } else {
                setCodeInvite(null);
            }
        }
    }, [searchParams]);

    const validatePassword = (password: string): { errors: string[]; strength: string } => {
        const errors: string[] = [];

        if (password.length < 6) {
            errors.push("Password must be at least 6 characters long.");
        }

        let hasUpperCase = false;
        let hasNumberOrSymbol = false;

        for (let i = 0; i < password.length; i++) {
            const char = password[i];
            if (/[A-Z]/.test(char)) hasUpperCase = true;
            if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(char)) hasNumberOrSymbol = true;
        }

        if (!hasUpperCase) errors.push("Password must include at least one uppercase letter.");
        if (!hasNumberOrSymbol) errors.push("Password must include at least one number or special character.");

        const isProperlyMixed = password.split("").some(
            (char) =>
                /[A-Z]/.test(char) && /[0-9!@#$%^&*(),.?":{}|<>]/.test(password)
        );
        if (!isProperlyMixed) errors.push("Password must be properly mixed with uppercase letters and numbers or special characters.");

        let strength = "weak";
        if (password.length >= 10 && hasUpperCase && hasNumberOrSymbol) strength = "strong";
        else if (password.length >= 8 && hasUpperCase && hasNumberOrSymbol) strength = "medium";

        return { errors, strength };
    };

    const validateEmail = (email: string): string | null => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!email) return "Email is required.";
        if (!emailPattern.test(email)) return "Please enter a valid email address.";
        return null;
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "password") {
            const { errors } = validatePassword(value);
            setErrors((prevErrors) => ({ ...prevErrors, password: errors[0] || null }));
        }

        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: { name?: string; password?: string | null; email?: string } = {};

        if (!state.name) newErrors.name = "Name is required.";

        const { errors } = validatePassword(state.password);
        if (errors.length > 0) newErrors.password = errors[0];

        const emailError = validateEmail(state.email);
        if (emailError) newErrors.email = emailError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setState((prevState) => ({
            ...prevState,
            pending: true,
            isError: false,
            errorMessage: "",
        }));

        try {
            const userData = await dispatch(register({ name: state.name, password: state.password, email: state.email }));

            if (register.fulfilled.match(userData)) {
                setState({
                    ...state,
                    name: "",
                    email: "",
                    password: "",
                    pending: false,
                    isError: false,
                    errorMessage: "",
                });

                const result = await dispatch(authentication({ name: state.name, password: state.password }));
                if (authentication.fulfilled.match(result)) {
                    const token = result.payload.token;
                    const decodedToken = atob(token.split(".")[1]);
                    const userInformation = JSON.parse(decodedToken);
                    const idOfUser = userInformation.id;
                    isLoggedInA = true;
                    //session 
                    sessionStorage.setItem("authToken", token);
                    localStorage.setItem("authToken", token);

                    if (codeInvite) {
                        const newPlayer = await dispatch(createNewPlayer({ nickName: state.name, host: false }));
                        if (createNewPlayer.fulfilled.match(newPlayer)) {
                            const playerID = newPlayer.payload.id;
                            navigate("/LobbyGamePage", {
                                state: { codeInvite, playerID, nickName: state.name, host: false },
                            });
                        }
                    } else {
                        isLoggedInA = true;
                        navigate("/GamePageUser", {
                            state: { idOfUser, nickName: state.name, host: false },
                        });
                    }
                }
            } else if (register.rejected.match(userData)) {
                setState({
                    ...state,
                    pending: false,
                    isError: true,
                    errorMessage: "User name already exists.",
                });
            }
        } catch (error: any) {
            setState({
                ...state,
                pending: false,
                isError: true,
                errorMessage: error.message || "Something went wrong.",
            });
        }
    };

    return (
        <div id="UserManagementPageCreateComponent">
            <section className="wrapper">
                <div className="container">
                    <div className="col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4 text-center" style={{ marginTop: "1.5rem" }}>

                        <form className="rounded bg-white shadow p-5" onSubmit={saveUser}>
                            <h3 className="text-dark fw-bolder fs-4 mb-2">Create an Account</h3>

                            <div className="row input-box-signup" >
                                <div className="col-md-6 mb-4">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="name"
                                            className="form-control form-control-lg"
                                            id="nameInput"
                                            placeholder="example marie"
                                            name="name"
                                            value={state.name}
                                            onChange={handleInput}

                                        />
                                        <label htmlFor="nameInput">Name</label>
                                    </div>
                                    {errors.name && (
                                        <span style={{ color: "red" }}>{errors.name}</span>
                                    )}
                                    <div>
                                        {state.isError && (
                                            <div style={{ color: "red" }}>
                                                {state.errorMessage}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="row input-box-signup">
                                <div className="col-md-6 mb-4">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="email"
                                            className="form-control form-control-lg"
                                            id="floatingInput"
                                            placeholder="name@example.com"
                                            name="email"
                                            value={state.email}
                                            onChange={handleInput}

                                        />
                                        <label htmlFor="floatingInput">Email address</label>
                                    </div>
                                    {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
                                </div>
                            </div>
                            <div className="row input-box-signup" >
                                <div className="col-md-6 mb-4">
                                    <div className="form-floating mb-3">
                                        <input
                                            type={state.showPassword ? "text" : "password"}
                                            className="form-control form-control-lg"
                                            id="passwordInput"
                                            name="password"
                                            placeholder="*****"
                                            value={state.password}
                                            onChange={handleInput}

                                        />
                                        <label htmlFor="passwordInput">Password</label>
                                        <div>
                                            <span
                                                onClick={() => setState({ ...state, showPassword: !state.showPassword })}
                                                style={{
                                                    position: "absolute",
                                                    transform: "translateY(-100%)",
                                                    cursor: "pointer",
                                                    padding: "0.5rem",
                                                    marginTop: "-0.75rem",
                                                    right: "10%"
                                                }}
                                            >
                                                {state.showPassword ? eyesFill : eyesNotFill}
                                            </span>
                                        </div>
                                    </div>

                                    {errors.password && <span style={{ color: "red" }}>{errors.password}</span>}
                                </div>
                            </div>
                            <div style={{ color: "Tomato", marginLeft: "0.5rem" }}> * at least 6 characters minimum</div>
                            <div style={{ color: "Tomato" }}> * contains a number or symbol</div>
                            <div style={{ color: "Tomato", marginLeft: "1.2rem" }}> * contains a small or capital letter</div>
                            <Button type="submit" disabled={state.pending}>
                                {state.pending ? <Spinner animation="border" size="sm" /> : "Create Account"}
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SignupPage;
