import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import LandingPage from './Pages/LandingPage';
import GamePage from './Pages/GamePage';
import LobbyHostGamePage from './Pages/LobbyHostGamePage';
import LobbyGamePage from './Pages/LobbyGamePage';
import { GameStatusProvider } from './utils/GameStatusContext';
import GamePageUser from './Pages/GamePageUser';
import TopMenuWrapper from './utils/TopMenuWrapper';
import Signup from './Pages/Signup';
import ReadQACode from './components/ReadQACode';
import ShareCodeLobbyGame from './components/ShareCodeLobbyGame';
import RedirectHandler from './components/RedirectHandler';
import MapPage from './Pages/MapPage';
import ProfileDetail from './components/ProfileDetail';
import GameOver from './Pages/GameOverPage';
import VerifyEmailPage from './Pages/VerifyEmailPage';
import VerifyThankYouPage from './Pages/VerifyThankYouPage';

const App: React.FC = () => {
  return (
    <GameStatusProvider>
      <Router>
        <TopMenuWrapper /> {/* Conditional rendering for TopMenu */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game" element={<GamePage nickName={''} host />} />
          <Route path="/LobbyHostGamePage" element={<LobbyHostGamePage />} />
          <Route path="/LobbyGamePage" element={<LobbyGamePage />} />
          <Route
            path="/GamePageUser"
            element={<GamePageUser idOfUser="" nickName={""} email={""} host />}
          />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Map" element={<MapPage />} />
          <Route path="/gameOver" element={<GameOver />} />
          <Route path="/ReadQACode/:codeInvite" element={<ReadQACode />} />
          <Route path="/:codeInvite" element={<RedirectHandler />} />
          <Route path="/codelobbygame" element={<ShareCodeLobbyGame />} />
          <Route path="/details/profile" element={<ProfileDetail />} />
          <Route
            path="/details/dashboard"
            element={<GamePageUser idOfUser="" nickName={""} email={""} host />}
          />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verifyThankYou" element={<VerifyThankYouPage />} />
        </Routes>
      </Router>
    </GameStatusProvider>
  );
};

export default App;
