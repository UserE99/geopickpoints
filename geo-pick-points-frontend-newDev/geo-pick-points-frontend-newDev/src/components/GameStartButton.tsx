import React from "react";
import Button from "react-bootstrap/Button";


interface Props {
  onClick: () => void;
}

const GameStartButton: React.FC<Props> = ({ onClick }) => {
  return (
    <Button style={{
      backgroundColor:process.env.REACT_APP_COLOR_SECONDARY,
      color:process.env.REACT_APP_COLOR_PRIMARY,
      borderColor:process.env.REACT_APP_COLOR_PRIMARY,
      }} variant="primary" className="btn-space" onClick={onClick} data-testid={'GameStartButton'}>
      Host Game
    </Button>
  );
}; 

export default GameStartButton;