import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../store/index";
import HostBuildButton from '../components/HostBuildButton';
import { createNewTeam } from '../actions/CreateNewTeam';
import HostBuildDialogInput from '../components/HostBuildDialogInput';
import Button from "react-bootstrap/Button";
import { Col, Row, Container } from "react-bootstrap";

interface Props {
  nickName: string;
  host: boolean;
}

const animalNames = [
  "Löwe", "Tiger", "Elefant", "Panda", "Adler",
  "Krokodil", "Giraffe", "Delphin", "Fuchs", "Wolf",
];

function getRandomAnimalName(): string {
  return animalNames[Math.floor(Math.random() * animalNames.length)];
}

const GamePage: React.FC<Props> = () => {
  const [showHostBuildDialog, setshowHostBuildDialog] = useState(false);
  const [qaCodeData, setqaCodeData] = useState({ codeInvite: '' });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState({});
  const { nickName, host } = location.state as Props;
  const [amountOfTeam, setAmountOfTeam] = useState('');
  const [nameOfTeam, setNameOfTeam] = useState(getRandomAnimalName());

  const playerList = useAppSelector((state) => state.players.players);
  const { loading, error } = useAppSelector((state) => ({
    loading: state.players.loading,
    error: state.players.error,
  }));

  const handleHostBuildClick = () => {

    if (host) {
      setshowHostBuildDialog(true);
    }
  };



  function getRandomAnimalName(): string {
    return animalNames[Math.floor(Math.random() * animalNames.length)];
  }



  const handleClose = () => {
    setshowHostBuildDialog(false);
  };
  const validateInviteCode = (inviteCode: string): { errors: string[] } => {
    console.log("invite Code..++ ", inviteCode);
    const errors: string[] = [];

    if (inviteCode.length < 6) {
      errors.push("Invite-Code must be at least 6 characters long.");
    }
    return { errors };
  };



  const validateInputs = async (): Promise<boolean> => {
    let tempErrors: { codeInvite?: string } = {};
    const { errors } = validateInviteCode(qaCodeData.codeInvite);
    if (errors.length > 0) {
      tempErrors.codeInvite = errors[0];
    }
    if (!qaCodeData.codeInvite.trim()) {
      tempErrors.codeInvite = "Invite-Code is required.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setqaCodeData({ ...qaCodeData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const playerID = playerList.map((player) => String(player.id)).filter((id) => id !== 'undefined');

    if (await validateInputs()) {

      navigate('/LobbyGamePage', { state: { codeInvite: qaCodeData.codeInvite, playerID: playerID[0], nickName } });
    }
    else {
      alert('Please enter a valid invite-Code.');
    }
  };



  const handleSaveHostBuild = async () => {
    var numOfTeam = parseInt(amountOfTeam, 10);
    var teamID: string[] = [];
    if (numOfTeam < 0) {
      numOfTeam = 1;
    }
    if (amountOfTeam) {
      let codeInvite: undefined;
      let playersIDData: undefined;
      const playersID = playerList.map((player) => String(player.id)).filter((id) => id !== 'undefined');
      let players: string[] = []
      for (let i = 0; i < numOfTeam; i++) {
        const randomName = getRandomAnimalName(); // Generiere zufälligen Tiernamen
        let dataInfo;

        if (codeInvite) {
          dataInfo = await dispatch(createNewTeam({ amountOfTeam: Number(amountOfTeam), playersID, host, nameOfTeam: randomName, codeInvite }));
        } else {
          dataInfo = await dispatch(createNewTeam({ amountOfTeam: Number(amountOfTeam), playersID, host, nameOfTeam: randomName }));
        }

        codeInvite = dataInfo.payload.codeInvite;
        playersIDData = dataInfo.payload.playersID;


        if (createNewTeam.fulfilled.match(dataInfo)) {
          teamID.push(dataInfo.payload.id);
        } else {
          console.error("Error creating team:", dataInfo);
        }
      }

      handleClose();
      navigate('/LobbyHostGamePage', { state: { amountOfTeam, nickName, teamID, codeInvite: codeInvite, playerID: playersID[0] } });

    } else {
      alert('Please enter a valid number of team.');
    }
  };

  return (
    <div className="game-page text-center">
      <h4 style={{ margin: "1.5rem" }}>Welcome to the GEO Pick Points, {nickName}!</h4>
      {loading ? (
        <p>Setting up your player...</p>
      ) : error ? (
        <p className="error">An error occurred: {error}</p>
      ) : (
        <>
          {playerList.length > 0 && (
            <div>
              {playerList.map((player) => (
                <p key={player.id}></p>
              ))}
              {host ? (
                <>
                  <h4 style={{ paddingTop: "10vh" }}>You are the Host now!</h4>
                  <h5> It's time to manage your teams! </h5>
                  <HostBuildButton onClick={handleHostBuildClick} />
                  <HostBuildDialogInput
                    show={showHostBuildDialog}
                    onClose={handleClose}
                    onSave={handleSaveHostBuild}
                    playersID={playerList.map((player) => String(player.id)).filter((id) => id !== 'undefined')}
                    nameOfTeam={nameOfTeam}
                    setNameOfTeam={setNameOfTeam}
                    amountOfTeam={amountOfTeam}
                    setAmountOfTeam={setAmountOfTeam}
                  />
                </>
              ) : <>


                <div id="LobbyComponent">
                  <Container>
                    <Row className="vh-20 d-flex justify-content-center align-items-center">
                      <Col md={10} lg={8} xs={12}>
                        <div className="border border-3 border-primary"></div>
                        <div className="mb-3 mb-4">
                          <h4 style={{ paddingTop: "10vh" }} className="fw-bold mb-2">Please enter the Code before proceeding to the lobby.</h4>
                        </div>

                        <form
                          style={{
                            position: "static",
                            top: 95,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "0rem",
                            padding: "0rem",
                          }}
                          onSubmit={handleSubmit}
                        >

                          <div className="row" >
                            <div className="col-md-6 mb-4">
                              <div className='text-center'> Invite-Code :</div>
                            </div>
                            <div className="col-md-6 mb-4">
                              <div className="form-outline">
                                <input
                                  type="text"
                                  id="code_Test"
                                  name="codeInvite"
                                  value={qaCodeData.codeInvite}
                                  onChange={handleInput}
                                  placeholder="enter your code"
                                  className="form-control form-control-lg"
                                />

                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-2">
                            <Button
                              variant="primary"
                              id="TestID"
                              type="submit"
                              style={{
                                backgroundColor: process.env.REACT_APP_COLOR_SECONDARY,
                                color: process.env.REACT_APP_COLOR_PRIMARY,
                                borderColor: process.env.REACT_APP_COLOR_PRIMARY,
                              }}
                            >
                              Join Game!
                            </Button>
                          </div>
                        </form>
                      </Col>
                    </Row>
                  </Container>
                </div>

              </>}
            </div>
          )}
        </>
      )}
    </div>
  );

};



export default GamePage;
