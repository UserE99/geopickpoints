import React, { useState, useEffect } from "react";
import Cookies from "js-cookie"; // Importiere die Cookie-Bibliothek
import { useNavigate } from "react-router-dom";
import ProfileMenu from "../utils/ProfielMenu";
import ProFileEdit from "./ProfileEdit";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";

const ProfileDetail: React.FC = () => {
    const [storedIdOfUser, setIdOfUser] = useState<string>("");
    const [storedNickName, setNickName] = useState<string>("");
    const [storedEmail, setEmail] = useState<string>("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false)
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false)
    const navigate = useNavigate();
    let isLoggedInA = useSelector((state: RootState) => state.authentication.authen.isLoggedIn)

    // Beim Laden der Komponente: Cookies auslesen
    useEffect(() => {
        const cookieIdOfUser = Cookies.get("idOfUser");
        const cookieNickName = Cookies.get("nickName");
        const cookieEmail = Cookies.get("email");
        const token = sessionStorage.getItem("authToken");
        const tokenLocal = localStorage.getItem('authToken');

        if (token) {
            setIsLoggedIn(true);
            isLoggedInA = true;
        }
        else {
            setIsLoggedIn(false);
            isLoggedInA = false;
        }
        if (tokenLocal) {
            setIsLoggedIn(true);
            isLoggedInA = true;
        }
        else {
            setIsLoggedIn(false);
            isLoggedInA = false;
        }
        // Wenn Cookies vorhanden sind, setze den Zustand
        if (cookieIdOfUser) {
            setIdOfUser(cookieIdOfUser);
        }
        if (cookieNickName) {
            setNickName(cookieNickName);
        }
        if (cookieEmail) {
            setEmail(cookieEmail);
        }
    }, []);

    const checkAuthentication = () => {
        const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
        setIsLoggedIn(!!token);
        if (!token) navigate("/");
    };
    // Run authentication check on component mount
    useEffect(() => {
        checkAuthentication();

        // Listen for storage changes (triggered by logout in another tab)
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "authToken" && event.oldValue && !event.newValue) {
                checkAuthentication();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleEditProfile = () => {
        setShowEditForm(true)
    }
    const handleProfileUpdate = (updatedUser: { idOfUser: string; name: string; email: string }) => {
        setIdOfUser(updatedUser.idOfUser);
        setNickName(updatedUser.name);
        setEmail(updatedUser.email);

        setShowEditForm(false);
    };



    return (

        <div>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800" style={{ marginTop: "1.5rem", marginLeft: "1.0rem" }}> Your Profile</h1>
            </div>
            <div style={{ marginBottom: "1rem" }}>
                <ProfileMenu idOfUser={storedIdOfUser} nickName={storedNickName} email={storedEmail} />
            </div>

            <div >
                {!showEditForm ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <div className="card shadow mb-4  cardSelbe cardSmall"  >
                            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 className="m-0 fs-4 fw-bold fontSize">Profile Details</h6>
                                <div className="text-primary text-decoration-underline" style={{ cursor: "pointer" }} onClick={handleEditProfile}>Edit profile</div>
                            </div>

                            <div className="card-bod marginBetweenText">
                                <p className="marginBetweenText"><strong>User ID:</strong> {storedNickName}</p>
                                <p className="marginBetweenText"><strong>Nickname:</strong> {storedNickName}</p>
                                <p className="marginBetweenText"><strong>Email:</strong> {storedEmail}</p>


                            </div>
                        </div>
                    </div>
                ) : (
                    <ProFileEdit data={[
                        {
                            idOfUser: storedIdOfUser,
                            name: storedNickName,
                            email: storedEmail
                        }
                    ]} id={storedIdOfUser} onProfileUpdate={handleProfileUpdate} />
                )}
            </div>

        </div>

    );
};

export default ProfileDetail;




/**
 *  {!showChangePasswordForm ? (
                    <div className="card shadow mb-4 cardSelbe cardSmall">
                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 fs-4 fw-bold fontSize">Password</h6>
                            <div className="text-primary text-decoration-underline" style={{ cursor: "pointer" }} onClick={handleChangePassword}>change password</div>
                        </div>
                        <div className="card-body ">
                            <p ><strong>Password</strong> ******* </p>
                        </div>
                    </div>
                ) : (
                    <ChangePassword data={[
                        {
                            idOfUser: storedIdOfUser,
                            password: "******",
                        }
                    ]} idOfUser={storedIdOfUser} onPasswordUpdate={handlePasswordUpdate} />

                )}
 */

/**
 * <ChangePassword data={[
                        {
                            idOfUser: storedIdOfUser,
                            password: "******",
                        }
                    ]} idOfUser={storedIdOfUser} onPasswordUpdate={handlePasswordUpdate} />
 */