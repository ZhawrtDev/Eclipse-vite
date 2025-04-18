import React, { useEffect, useState } from "react";
import "./styles.css";
import Nav from "../../components/Cabeçario";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPuzzlePiece,
  faSyringe,
  faUsers,
  faUser,
  faPlay,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Games() {
  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [totalPlayers, setTotalPlayers] = useState(0);

  useEffect(() => {
    const getUserData = () => {
      try {
        return {
          discordUsername:
            localStorage.getItem("discordUsername") ||
            sessionStorage.getItem("discordUsername"),
          avatar:
            localStorage.getItem("avatar") || sessionStorage.getItem("avatar"),
          discordRole:
            localStorage.getItem("discordRole") ||
            sessionStorage.getItem("discordRole"),
          robloxUsername:
            localStorage.getItem("robloxUsername") ||
            sessionStorage.getItem("robloxUsername"),
          discordId:
            localStorage.getItem("discordId") ||
            sessionStorage.getItem("discordId"),
        };
      } catch (err) {
        console.error("Erro ao acessar o armazenamento:", err);
        return null;
      }
    };

    const storedUserData = getUserData();

    if (!storedUserData.discordUsername) {
      setError("Dados do usuário não encontrados.");
      return;
    }

    setUserData(storedUserData);
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(`https://eclipse-backend-9lxy.onrender.com/games`);
  
        const sortedGames = response.data.sort((a, b) => (b.playing || 0) - (a.playing || 0));
        setGames(sortedGames);
  
        const total = sortedGames.reduce((sum, game) => {
          const playing = game.playing || 0;
          return sum + playing;
        }, 0);
  
        setTotalPlayers(total);
      } catch (err) {
        console.error("Erro ao buscar jogos:", err);
        setError("Erro ao buscar jogos.");
      } finally {
        setLoadingGames(false);
      }
    };
  
    fetchGames();
  }, []);
  

  if (loadingGames) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mainGames">
      <Nav
        title="Games"
        subtitle="Updates every time a player joins"
        searchWidth="85%"
      />
      <div className="inform-accont">
        <div className="box a">
          <div className="icon">
            <FontAwesomeIcon
              icon={faPuzzlePiece}
              style={{ fontSize: "1.5rem", color: "#c9c9c9" }}
            />
          </div>
          <div className="text">
            <h2>Total Games</h2>
            <p>{games.length}</p>
          </div>
        </div>
        <div className="box">
          <div className="icon">
            <FontAwesomeIcon
              icon={faUsers}
              style={{ fontSize: "1.2rem", color: "#c9c9c9" }}
            />
          </div>
          <div className="text">
            <h2>Active Players</h2>
            <p>{totalPlayers}</p>
          </div>
        </div>
        <div className="box">
          <div className="icon">
            <FontAwesomeIcon
              icon={faSyringe}
              style={{ fontSize: "1.2rem", color: "#c9c9c9" }}
            />
          </div>
          <div className="text">
            <h2>Roblox Username</h2>
            {userData ? <p>{userData.robloxUsername}</p> : <p>undefined</p>}
          </div>
        </div>
      </div>

      <div className="games-main">
        {games.map((game) => (
          <div key={game.id} className="game-box">
            <div className="sh">
              <div className="img-content">
                <img
                  src={game.imageUrl}
                  className="banner-img"
                  alt={game.name}
                />
                <img
                  src={game.imageUrl}
                  className="lower-img"
                  alt={game.name}
                />
              </div>
              <div className="text-content">
                <h1 className="titulo">{game.name}</h1>
                <p className="paragrafo">{game.description}</p>
              </div>
              <div className="inform-content">
                <div className="box-inf">
                  <div className="icon">
                    <FontAwesomeIcon
                      icon={faUser}
                      style={{ fontSize: "1.3rem", color: "#c9c9c9" }}
                    />
                  </div>
                  <div className="text">
                    <p>Active Players</p>
                    <h1>{game.playing}</h1>
                  </div>
                </div>

                <div className="interaction">
                  <a
                    href={`https://www.roblox.com/games/${game.id}`}
                    className="open"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      style={{ color: "#c9c9c9" }}
                    />
                  </a>
                  <a
                    href={`https://www.roblox.com/games/start?launchData=${game.jobId}&placeId=${game.id}`}
                    className="play"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon
                      icon={faPlay}
                      style={{ color: "#c9c9c9" }}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Games;
