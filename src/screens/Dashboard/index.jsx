import { useEffect, useState } from "react";
import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faIdCardClip,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import { faWindows, faAndroid } from "@fortawesome/free-brands-svg-icons";
import Nav from "../../components/Cabeçario";
import Popup from '../../components/Popup'
import { database, ref, set, get, update, push } from "../../firebaseConfig";


function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRobloxUsername, setNewRobloxUsername] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState('');
  const [popupError, setPopupError] = useState(false);

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
          userId:
            localStorage.getItem("userId") || sessionStorage.getItem("userId"),
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

  const handleUpdateWhitelist = async () => {
    if (!newRobloxUsername) {
      setPopupText("Please enter a Roblox username.");
      setPopupError(true);
      setShowPopup(true);
      return;
    }
  
    try {
      const userId = userData.userId;
  
      const response = await fetch(
        `https://eclipse-backend-9lxy.onrender.com/name?userId=${userId}&newname=${newRobloxUsername}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        const responseBody = await response.json();
        setPopupText(
          `Error updating Roblox username: ${
            responseBody.message || responseBody.error || response.statusText
          }`
        );
        setPopupError(true);
        setShowPopup(true);
        return;
      }
  
      const oldRobloxUsername =
        localStorage.getItem("robloxUsername") || sessionStorage.getItem("robloxUsername");
  
      localStorage.setItem("robloxUsername", newRobloxUsername);
      sessionStorage.setItem("robloxUsername", newRobloxUsername);
      setUserData((prevState) => ({
        ...prevState,
        robloxUsername: newRobloxUsername,
      }));
  
      const nameListRef = ref(database, "whitelist");
      const snapshot = await get(nameListRef);
      const existingNames = snapshot.exists() ? snapshot.val() : {};
  
      let updated = false;
  
      if (oldRobloxUsername) {
        for (const key in existingNames) {
          const nameEntry = existingNames[key];
          if (
            nameEntry &&
            nameEntry.Name &&
            nameEntry.Name.toLowerCase() === oldRobloxUsername.toLowerCase()
          ) {
            await update(nameListRef, {
              [key]: { Name: newRobloxUsername },
            });
            updated = true;
            break;
          }
        }
      }
  
      if (!updated) {
        await push(nameListRef, { Name: newRobloxUsername });
      }
  
      setPopupText("Roblox username successfully updated!");
      setPopupError(false);
      setShowPopup(true);
    } catch (error) {
      console.error("Error:", error);
      setPopupText("Error making the request.");
      setPopupError(true);
      setShowPopup(true);
    }
  };
  
  if (loading) return <p>undefined</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dsh">
      {showPopup && <Popup error={popupError} text={popupText} />}
      <Nav
        title="Dashboard"
        subtitle="Managing and monitoring information."
        searchWidth="70%"
      />

      <div className="screens">
        <div className="contenta">
          <div className="inform-accont">
            <div className="box a">
              <div className="icon">
                <FontAwesomeIcon
                  icon={faCreditCard}
                  style={{ fontSize: "1.5rem", color: "#c9c9c9" }}
                />
              </div>
              <div className="text">
                <h2>Plan</h2>
                {userData ? <p>{userData.discordRole}</p> : <p>undefined</p>}
              </div>
            </div>
            <div className="box">
              <div className="icon">
                <FontAwesomeIcon
                  icon={faCircleUser}
                  style={{ fontSize: "1.2rem", color: "#c9c9c9" }}
                />
              </div>
              <div className="text">
                <h2>Roblox Username</h2>
                {userData ? <p>{userData.robloxUsername}</p> : <p>undefined</p>}
              </div>
            </div>
            <div className="box">
              <div className="icon">
                <FontAwesomeIcon
                  icon={faIdCardClip}
                  style={{ fontSize: "1.2rem", color: "#c9c9c9" }}
                />
              </div>
              <div className="text">
                <h2>User ID</h2>
                {userData ? (
                  <p>{userData.discordId.slice(0, 5)}</p>
                ) : (
                  <p>undefined</p>
                )}
              </div>
            </div>
          </div>

          <div className="overlay">
            <div className="text">
              <div className="plataformas">
                <div className="box">
                  <FontAwesomeIcon
                    icon={faWindows}
                    size="2x"
                    color="#ffffff69"
                  />
                  <h2>Windows</h2>
                </div>
                <div className="box">
                  <FontAwesomeIcon
                    icon={faAndroid}
                    size="2x"
                    color="#ffffff69"
                  />
                  <h2>Android</h2>
                </div>
              </div>
              <p>
                <span>Overlay Screen</span> An always-on-top window that remains
                visible across applications
              </p>
            </div>
          </div>
        </div>

        <div className="whitelist">
          <div className="ctn">
            <h1 className="titulo">WhiteList</h1>
            <p className="paragrafo">
              A whitelist system that grants exclusive permissions to
              pre-approved users, ensuring controlled access to script
              resources, player interactions, and execution functionalities.
              This mechanism enhances security by restricting unauthorized
              access, allowing only designated individuals to utilize advanced
              features and ServerSide controls within the Roblox environment.
            </p>

            <div className="outher">
              <input
                type="text"
                placeholder="Builderman - Roblox Username"
                value={newRobloxUsername}
                onChange={(e) => setNewRobloxUsername(e.target.value)}
              />
              <div className="touch" onClick={handleUpdateWhitelist}>
                <p>Update Whitelist</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
