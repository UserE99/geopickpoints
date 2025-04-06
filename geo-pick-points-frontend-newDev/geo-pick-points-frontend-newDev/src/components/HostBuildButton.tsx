import React from "react";
import Button from "react-bootstrap/Button";


interface Props {
    onClick: () => void;
}

const HostBuildButton: React.FC<Props> = ({ onClick }) => {
    return (
        <Button 
        style={{
          backgroundColor:process.env.REACT_APP_COLOR_SECONDARY,
          color:process.env.REACT_APP_COLOR_PRIMARY,
          borderColor:process.env.REACT_APP_COLOR_PRIMARY,
          }}variant="primary" onClick={onClick} data-testid={'HostBuildButton'}>
            Create Teams
        </Button>
    );
};

export default HostBuildButton;