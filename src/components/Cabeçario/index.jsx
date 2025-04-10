import { useEffect, useState } from "react";
import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPlay,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

function Nav({ title, subtitle, searchWidth }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const getUserData = () => {
      try {
        return {
          discordUsername:
            localStorage.getItem("discordUsername") ||
            sessionStorage.getItem("discordUsername"),
          avatar:
            localStorage.getItem("avatar") || sessionStorage.getItem("avatar"),
        };
      } catch (err) {
        console.error("Erro ao acessar o armazenamento:", err);
        return null;
      }
    };

    const storedUserData = getUserData();
    if (!storedUserData.discordUsername) {
      setError("Dados do usuário não encontrados.");
      setLoading(false);
      return;
    }

    setUserData(storedUserData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch("https://eclipse-backend-9lxy.onrender.com/games")
      .then((res) => res.json())
      .then((data) => {
        const filteredData = data.map(
          ({ imageUrl, name, description, jobId, id, playing }) => ({
            imageUrl,
            name: name,
            description: description,
            jobId,
            id,
            playing,
          })
        );
        setGames(filteredData);
      })
      .catch((err) => console.error("Erro ao buscar jogos:", err));
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredGames(
        games.filter((game) =>
          game.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredGames([]);
    }
  }, [searchTerm, games]);

  if (loading) return <p>undefined</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="navcomponent">
      <div className="text">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="search" style={{ width: searchWidth }}>
        <div className="icon">
          <FontAwesomeIcon icon={faMagnifyingGlass} size="1x" color="#b4b4b4" />
        </div>
        <input
          type="text"
          placeholder="Search [Games]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        {isFocused && filteredGames.length > 0 && (
          <div className="box-opitions">
            {filteredGames.map((game) => (
              <div className="box" key={game.id}>
                <div className="content">
                  <img src={game.imageUrl} className="img" />
                  <div className="text">
                    <h2>{game.name} ({game.playing})</h2>
                    <h3>{game.description}</h3>
                  </div>
                </div>

                <div className="touchs">
                  <a
                    className="touch a"
                    href={`https://www.roblox.com/games/${game.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      style={{ color: "#c9c9c9" }}
                    />
                    <p>Open</p>
                  </a>
                  <a
                    className="touch"
                    href={`https://www.roblox.com/games/start?launchData=${game.jobId}&placeId=${game.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon
                      icon={faPlay}
                      style={{ color: "#c9c9c9" }}
                    />
                    <p>Play</p>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="content">
        <a
          href="https://discord.gg/y48ZgYAAka"
          target="_blank"
          className="discord"
        >
          <div className="icon">
            <FontAwesomeIcon icon={faDiscord} size="1x" color="#fff" />
          </div>
          <p>Discord</p>
        </a>
        <div className="user">
          {userData ? (
            <img src={userData.avatar} alt="Avatar" className="img" />
          ) : (
            <p>undefined</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;
