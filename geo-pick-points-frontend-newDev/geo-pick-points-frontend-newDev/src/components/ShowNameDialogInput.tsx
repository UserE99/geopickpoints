import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect } from 'react';
import Login from '../Pages/Login';

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  nickName: string;
  setnickName: (nickName: string) => void;
  host: boolean;
}

const ShowNameDialogInput: React.FC<Props> = ({ show, onClose, onSave, nickName, setnickName, host }) => {

  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [errors, setErrors] = useState<{ nickName?: string }>({});

  React.useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Validierung der Eingabe
  const validateInputs = (): boolean => {
    const tempErrors: { nickName?: string } = {};

    if (!nickName.trim()) {
      tempErrors.nickName = "Name is required.";
    } else if (nickName.trim().length < 2) {
      // Ensure at least 2 characters
      tempErrors.nickName = "Name must be at least 2 characters long.";
    }

    // Set errors and return validation status
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
    <Modal show={show} onHide={onClose} data-testid={'DialogNameInput'}>
      <Modal.Header closeButton>
        <Modal.Title>What is your name?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Control
              type="text"
              placeholder="enter your name"
              value={nickName}
              onChange={(e) => setnickName(e.target.value)}
              isInvalid={!!errors.nickName}
              data-testid={'nameInput'}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nickName}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body> 
      <Modal.Footer>
        <Button style={{
      backgroundColor:process.env.REACT_APP_COLOR_PRIMARY,
      color:process.env.REACT_APP_COLOR_SECONDARY,
      borderColor:process.env.REACT_APP_COLOR_SECONDARY,
      }} variant="secondary" onClick={onClose} data-testid={'closeButton'}>
          cancel
        </Button>
        <Button style={{
      backgroundColor:process.env.REACT_APP_COLOR_SECONDARY,
      color:process.env.REACT_APP_COLOR_PRIMARY,
      borderColor:process.env.REACT_APP_COLOR_PRIMARY,
      }} variant="primary" onClick={onSave} data-testid={'saveButton'}>
          save
        </Button>
      </Modal.Footer>
      <div style={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #eae5e5",
        borderRadius: "10px", margin: "0.5rem",
        padding: "0.5rem",
        flexWrap: "wrap",
      }}>
        <div >
          Already have an account or wanna Signup?

        </div>
        <div style={{ margin: "0.5rem" }}><Login /></div>
      </div>
    </Modal>
  );
};

export default ShowNameDialogInput;
