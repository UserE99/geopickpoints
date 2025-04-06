import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShowNameDialogInput from "./ShowNameDialogInput";


const REACT_APP_REST_API_URL = process.env.REACT_APP_REST_API_URL;

interface AddPlayerDialogProps {
    codeInvite: string;
    onPlayerAdded: (nickName: string, host: boolean) => void;
}


const AddPlayerDialog: React.FC<AddPlayerDialogProps> = ({ codeInvite, onPlayerAdded }) => {
    const [nickName, setnickName] = useState("");
    const host = false;
    const navigate = useNavigate();
    const [showNameDialog, setShowNameDialog] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.click();
        }
    }, []);

    const handleAddPlayerDialog = () => {
        setShowNameDialog(true);

    };

    const handleClose = () => {
        setShowNameDialog(false);
    };

    const handleAddPlayer = async () => {
        try {
            const response = await fetch(`${REACT_APP_REST_API_URL}player`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nickName, host }),
            });

            if (response.ok) {
                const data = await response.json();
                // Callback-Funktion ausführen, wenn der Spieler erfolgreich hinzugefügt wurde
                onPlayerAdded(nickName, host);
                navigate('/LobbyGamePage', { state: { codeInvite, playerID: data.id, nickName } });

            } else {
                alert("Fehler beim Hinzufügen des Spielers");
            }
        } catch (error) {
            console.error("Fehler beim Hinzufügen des Spielers:", error);
        }
    };

    return (
        <div>
            <button hidden={true} ref={buttonRef} onClick={handleAddPlayerDialog}></button>
            <ShowNameDialogInput
                show={showNameDialog}
                onClose={handleClose}
                onSave={handleAddPlayer}
                nickName={nickName}
                setnickName={setnickName}
                host={host}

            />
        </div>
    );
};

export default AddPlayerDialog;
