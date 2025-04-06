import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect } from 'react';

interface Props {
    show: boolean;
    onClose: () => void;
    onSave: () => void;
    nameOfTeam: string;
    setNameOfTeam: (nameOfTeam: string) => void;
    amountOfTeam: string;
    setAmountOfTeam: (mountOfTeam: string) => void;
    playersID: string[];

}

const HostBuildDialogInput: React.FC<Props> = ({ show, onClose, onSave, nameOfTeam, setNameOfTeam, amountOfTeam, setAmountOfTeam }) => {
    const [errors, setErrors] = useState<{ nameOfTeam?: string }>({});

    // Validierung der Eingabe
    const validateInputs = (): boolean => {
        const tempErrors: { nameOfTeam?: string } = {};
        if (!nameOfTeam.trim()) {
            tempErrors.nameOfTeam = "Name of Team is required.";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
    // Handler für den Speichern-Button
    const handleSave = () => {
        if (validateInputs()) {
            onSave();
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton >
                <Modal.Title>How many team your wanna build ?</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <Form>
                    <Form.Group controlId="formName"  >

                        <Form.Label></Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="enter number of team"
                            value={amountOfTeam}
                            onChange={(e) => setAmountOfTeam(e.target.value)}
                            data-testid={'numberInput'}
                            className="form-spacing"
                        />

                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button style={{
                    backgroundColor: process.env.REACT_APP_COLOR_PRIMARY,
                    color: process.env.REACT_APP_COLOR_SECONDARY,
                    borderColor: process.env.REACT_APP_COLOR_SECONDARY,
                }} variant="secondary" onClick={onClose} data-testid={'closeButton'}>
                    cancel
                </Button>
                <Button style={{
                    backgroundColor: process.env.REACT_APP_COLOR_SECONDARY,
                    color: process.env.REACT_APP_COLOR_PRIMARY,
                    borderColor: process.env.REACT_APP_COLOR_PRIMARY,
                }} variant="primary" onClick={onSave} data-testid={'saveButton'}>
                    save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default HostBuildDialogInput;