import { useEffect, useState } from "react";
import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faLayerGroup,
  faHouse,
  faTerminal,
  faFileCode,
  faFolderOpen,
  faUserTag,
  faMoneyCheck,
  faArrowRightFromBracket,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import Dashboard from "../Dashboard";
import Games from "../Games";
import Execution from "../Execution";
import Players from "../Players";
import ScriptLibrary from "../ScriptLibrary";
import logo from "../../assets/eclipse.png";
import Popup from '../../components/Popup'

function Nav() {
  const [activeItem, setActiveItem] = useState("Your Dashboard");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState('');
  const [popupError, setPopupError] = useState(false);

  useEffect(() => {
    fetch("https://eclipse-backend-9lxy.onrender.com/")
      .then(() => console.log("🔄 Backend acordado"))
      .catch((err) => console.warn("⚠️ Erro ao acordar o backend", err));
  }, []);

  useEffect(() => {
    const handleLogout = (event) => {
      const isReload = event.persisted;
  
      if (!isReload) {
        localStorage.removeItem("discordUsername");
        localStorage.removeItem("avatar");
        localStorage.removeItem("discordRole");
        localStorage.removeItem("robloxUsername");
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("discordId");
        sessionStorage.removeItem("discordUsername");
        sessionStorage.removeItem("avatar");
        sessionStorage.removeItem("discordRole");
        sessionStorage.removeItem("robloxUsername");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("discordId");
      }
    };
  
    window.addEventListener("pagehide", handleLogout);
  
    return () => {
      window.removeEventListener("pagehide", handleLogout);
    };
  }, []);
  

  useEffect(() => {
    const getUserData = () => {
      try {
        return {
          discordUsername: localStorage.getItem("discordUsername") || sessionStorage.getItem("discordUsername"),
          avatar: localStorage.getItem("avatar") || sessionStorage.getItem("avatar"),
          discordRole: localStorage.getItem("discordRole") || sessionStorage.getItem("discordRole"),
          robloxUsername: localStorage.getItem("robloxUsername") || sessionStorage.getItem("robloxUsername"),
        };
      } catch (err) {
        console.error("Erro ao acessar o armazenamento:", err);
        return null;
      }
    };
  
    const storedUserData = getUserData();
  
    if (!storedUserData.discordUsername) {
      const interval = setInterval(() => {
        const updatedData = getUserData();
        if (updatedData.discordUsername) {
          setUserData(updatedData);
          setLoading(false);
          clearInterval(interval);
        }
      }, 1000);
  
      return () => clearInterval(interval);
    }
  
    setUserData(storedUserData);
    setLoading(false);
  }, []);
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleClick = (item) => {
    setActiveItem(item);
  };

  const handleLogout = () => {
    localStorage.removeItem("discordUsername");
    localStorage.removeItem("avatar");
    localStorage.removeItem("discordRole");
    localStorage.removeItem("robloxUsername");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("discordId");
    sessionStorage.removeItem("discordUsername");
    sessionStorage.removeItem("avatar");
    sessionStorage.removeItem("discordRole");
    sessionStorage.removeItem("robloxUsername");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("discordId");

    setPopupText("You have been logged out successfully.");
    setPopupError(false);
    setShowPopup(true);

    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const renderComponent = () => {
    switch (activeItem) {
      case "Your Dashboard":
        return <Dashboard />;
      case "Games":
        return <Games />;
      case "Execution":
        return <Execution />;
      case "Players":
        return <Players />;
      case "Script Library":
        return <ScriptLibrary />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      {showPopup && <Popup error={popupError} text={popupText} />}
      <div className="navmain">
        <div className="divisao">
          <div className="profile">
            <div className="box-img">
              {/* <FontAwesomeIcon icon={faLayerGroup} size="2x" /> */}
              <img src={logo} className="logo" />
            </div>
            <div className="text">
              <p>ServerSide</p>
              <h1>ECLIPSE</h1>
            </div>
          </div>
        </div>

        <div className="divisao nav">
          <div className="nav">
            <p className="titulo">Menu</p>

            <div className="nav-main">
              <div
                className={`box-nav ${
                  activeItem === "Your Dashboard" ? "a" : ""
                }`}
                onClick={() => handleClick("Your Dashboard")}
              >
                <div className="icon">
                  <FontAwesomeIcon icon={faHouse} size="1x" />
                </div>
                <p>Your Dashboard</p>
              </div>

              <div
                className={`box-nav ${activeItem === "Games" ? "a" : ""}`}
                onClick={() => handleClick("Games")}
              >
                <div className="icon">
                  <FontAwesomeIcon icon={faFolderOpen} size="1x" />
                </div>
                <p>Games</p>
              </div>

              <div
                className={`box-nav ${activeItem === "Execution" ? "a" : ""}`}
                onClick={() => handleClick("Execution")}
              >
                <div className="icon">
                  <FontAwesomeIcon icon={faTerminal} size="1x" />
                </div>
                <p>Execution</p>
              </div>

              <div
                className={`box-nav ${activeItem === "Players" ? "a" : ""}`}
                onClick={() => handleClick("Players")}
              >
                <div className="icon">
                  <FontAwesomeIcon icon={faUserTag} size="1x" />
                </div>
                <p>Players</p>
              </div>

              <div
                className={`box-nav ${
                  activeItem === "Script Library" ? "a" : ""
                }`}
                onClick={() => handleClick("Script Library")}
              >
                <div className="icon">
                  <FontAwesomeIcon icon={faFileCode} size="1x" />
                </div>
                <p>Script Library</p>
              </div>
            </div>
          </div>
        </div>

        <div className="divisao inform">
          <div className="nav">
            <p className="titulo">Information</p>

            <div className="nav-main">
              <a
                href="https://discord.gg/y48ZgYAAka"
                target="_banker"
                className="box-nav"
              >
                <div className="icon">
                  <FontAwesomeIcon icon={faDiscord} size="1x" color="#fff" />
                </div>
                <p>Discord Server</p>
                <div className="icon-arrow">
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    size="1x"
                    color="#33333399"
                  />
                </div>
              </a>

              <div
                className={`box-nav ${
                  activeItem === "Plans - Premium" ? "a" : ""
                }`}
              >
                <div className="icon">
                  <FontAwesomeIcon icon={faMoneyCheck} size="1x" />
                </div>
                {userData ? (
                  <p>Plans - {userData.discordRole}</p>
                ) : (
                  <p>undefined</p>
                )}
                <div className="icon-arrow">
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    size="1x"
                    color="#33333399"
                  />
                </div>
              </div>
              <div
                className={`box-nav ${activeItem === "Settings" ? "a" : ""}`}
                onClick={handleLogout}
              >
                <div className="icon">
                  <FontAwesomeIcon icon={faArrowRightFromBracket} size="1x" />
                </div>
                <p>Logout</p>
                <div className="icon-arrow">
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    size="1x"
                    color="#33333399"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="divisao user">
          <div className="nav-main">
            <div className="box-nav a">
              {userData ? (
                <img src={userData.avatar} alt="Avatar" className="img" />
              ) : (
                <p>undefined</p>
              )}
              {userData ? <p>{userData.discordUsername}</p> : <p>undefined</p>}
            </div>
          </div>
        </div>
      </div>
      {renderComponent()}
    </>
  );
}

export default Nav;
