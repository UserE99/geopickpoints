import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { updateUser } from "../actions/UpdateUser";
import { useAppDispatch } from "../store/index";

// Typen für die Props und den Benutzer
interface User {
    idOfUser: string;
    name: string;
    email: string;
}

interface UserEditProps {
    data: User[];
    id: string;
    onProfileUpdate: (updatedUser: User) => void;
}

interface LinkState {
    idOfUser: string;
    nickName: string;
    email: string;
}

const UserEdit: React.FC<UserEditProps> = (props) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    // Benutzer aus Daten suchen
    const userData = props.data?.find((user) => user.idOfUser === props.id);

    // Initialer Zustand
    const initialState: User = userData || {
        idOfUser: "",
        name: "",
        email: "",
    };

    const [user, setUser] = useState<User>(initialState);

    // Daten beim Mount aktualisieren (wenn props.data später geladen wird)
    useEffect(() => {
        if (userData) {
            setUser(userData);
        }
    }, [userData]);

    // Handler für Input-Änderungen
    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    // Speichern und Aktualisieren des Benutzers 
    const saveUpdateUser: React.FormEventHandler<HTMLFormElement> = async (e) => {

        e.preventDefault();

        //update User
        const updateUserData = await dispatch(updateUser({ id: user.idOfUser, name: user.name, email: user.email }));

        // Navigation nach Speichern
        if (updateUser.fulfilled.match(updateUserData)) {
            props.onProfileUpdate(updateUserData.payload as User);

        } else {
            console.error("Error creating team:", updateUserData);
        }


    };

    const handleCancelUpdate = async () => {
        props.onProfileUpdate(userData as User);
    }



    return (
        <section className="wrapper">
            <div className="container">
                <div className="col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4 text-center" style={{ marginTop: "1.5rem" }}>

                    <form onSubmit={saveUpdateUser} className="rounded bg-white shadow p-5">
                        <h3 className="text-dark fw-bolder fs-4 mb-2">Edit profile</h3>

                        <div className="fw-normal text-muted mb-4">
                            change a new update Profile
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                style={{ background: "#E4E4E4" }}
                                type="hidden"
                                name="idOfUser"
                                value={user.idOfUser}
                                className="form-control"
                                readOnly
                            />
                            <label htmlFor="idInput">ID</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                id="nickNameInput"
                                style={{ background: "#E4E4E4" }}
                                type="text"
                                name="nickName"
                                value={user.name}
                                onChange={handleInputChange}
                                className="form-control"
                                readOnly
                            />
                            <label htmlFor="nickNameInput">User name</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                id="emailInput"
                                type="text"
                                name="email"
                                value={user.email}
                                onChange={handleInputChange}
                                className="form-control"
                            />
                            <label htmlFor="emailInput">Email address</label>
                        </div>
                        <div className="mt-4 pt-2">
                            <Button variant="primary" type="submit" >
                                Update profile settings
                            </Button>{" "}
                            &nbsp; &nbsp;
                            <Link to={`/details/profile`} state={{
                                idOfUser: user.idOfUser,
                                nickName: user.name,
                                email: user.email

                            }} onClick={handleCancelUpdate}>
                                <Button variant="danger" type="button" >
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default UserEdit;




