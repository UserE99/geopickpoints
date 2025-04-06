import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


type ScoresMap = Map<string, number>; 

const GameOverPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dataGameInstance, playerID, teamID } = location.state || {};
  const rawScores: unknown = location.state?.scores ?? new Map();
  const scores: ScoresMap = rawScores instanceof Map ? rawScores : new Map();
  //console.log("RawScores: " + rawScores)
  //console.log("Scores: " + scores)
  const startTime = dataGameInstance?.payload?.startTime;

  const [timeDifference, setTimeDifference] = useState<string | null>(null);

  useEffect(() => {
    if (startTime) {
      // Calculate time difference
      const startDate = new Date(startTime);
      const currentDate = new Date();
      const diffInMilliseconds = currentDate.getTime() - startDate.getTime();

      // Calculate time difference in minutes and seconds
      const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
      const minutes = Math.floor(diffInSeconds / 60);
      const seconds = diffInSeconds % 60;

      setTimeDifference(`${minutes} minutes and ${seconds} seconds`);
    } else {
      setTimeDifference(null);
    }
  }, [startTime]);

  return (
    <div style={{ paddingTop: "20vh", textAlign: "center" }}>
      <h1>Game Over</h1>

      {/* Display Time Difference if available */}
      {timeDifference ? (
        <p>
          <strong>Time:</strong> {timeDifference}
        </p>
      ) : (
        <p>
          <strong>Time:</strong> Not available
        </p>
      )}

<div>
      <h2>Scores</h2>
      {scores.size > 0 ? (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {[...scores.entries()].map(([teamname, score], index) => (
            <li key={index} style={{ margin: "10px 0" }}>
              <strong>{teamname}</strong> - Score {score}
            </li>
          ))}
        </ul>
      ) : (
        <p>No scores available</p>
      )}
    </div>

      {/* Back to Start Button */}
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          border: "solid",
          borderColor: process.env.REACT_APP_COLOR_SECONDARY,
          borderRadius: "5px",
          backgroundColor: process.env.REACT_APP_COLOR_PRIMARY,
          color: process.env.REACT_APP_COLOR_SECONDARY,
        }}
        onClick={() => navigate("/")}
      >
        Back to Start
      </button>
    </div>
  );
};

export default GameOverPage;
