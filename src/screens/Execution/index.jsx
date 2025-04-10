import Nav from "../../components/Cabeçario";
import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faArrowsRotate,
  faCube,
  faTerminal,
  faLayerGroup,
  faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import MonacoEditor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { database, ref, set, remove } from "../../firebaseConfig";
import Popup from "../../components/Popup";

function Execution() {
  const editorRef = useRef(null);
  const [code, setCode] = useState("print('hello world')");
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupError, setPopupError] = useState(false);

  useEffect(() => {
    monaco.languages.register({ id: "lua" });

    monaco.languages.setMonarchTokensProvider("lua", {
      tokenizer: {
        root: [
          [
            /\b(print|if|then|else|elseif|end|for|while|do|repeat|until|function|return|local|true|false|nil)\b/,
            "keyword",
          ],
          [
            /\b(game|workspace|script|Instance|Vector3|CFrame|wait|task.wait)\b/,
            "type.identifier",
          ],
          [/--.*/, "comment"],
          [/".*?"/, "string"],
          [/\d+/, "number"],
        ],
      },
    });

    monaco.languages.registerCompletionItemProvider("lua", {
      provideCompletionItems: () => {
        const suggestions = [
          {
            label: "print",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "print($1)",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: "game",
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: "game",
          },
          {
            label: "workspace",
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: "workspace",
          },
          {
            label: "script",
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: "script",
          },
          {
            label: "Instance",
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'Instance.new("$1")',
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: "Vector3",
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: "Vector3.new($1, $2, $3)",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: "CFrame",
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: "CFrame.new($1, $2, $3)",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: "wait",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "wait($1)",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: "task.wait",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "task.wait($1)",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
        ];
        return { suggestions };
      },
    });
  }, []);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
      editor.trigger("anyString", "editor.action.triggerSuggest", {});
    });
  };

  const stripLuaComments = (code) => {
    return code
      .replace(/--\[\[[\s\S]*?\]\]/g, "")
      .replace(/--.*$/gm, "")
      .trim();
  };

  const handleExecuteClick = async () => {
    const codeContent = editorRef.current.getValue();
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setPopupText("Error: No userId found.");
      setPopupError(true);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 4000);
      return;
    }

    if (codeContent.trim() === "") {
      setPopupText("Please enter some code.");
      setPopupError(true);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 4000);
      return;
    }

    const strippedCode = stripLuaComments(codeContent);

    if (strippedCode === "") {
      setPopupText("Error: Your code only contains comments.");
      setPopupError(true);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 4000);
      return;
    }

    try {
      const response = await fetch(
        `https://eclipse-backend-9lxy.onrender.com/user?userId=${userId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error fetching user data");
      }

      const {
        robloxUsername,
        discordId,
        discordUsername,
        avatar,
        discordRole,
      } = data;

      if (!robloxUsername) {
        setPopupText(
          "Error: robloxUsername not found. Please add your robloxUsername to the whitelist located on the Dashboard screen."
        );
        setPopupError(true);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 4000);
        return;
      }

      const executeRef = ref(database, "execute");
      await set(executeRef, { code: codeContent, robloxUsername });

      console.log("Code and robloxUsername sent to Realtime Database:", {
        codeContent,
        robloxUsername,
      });

      setPopupText("Code and Roblox username successfully sent.");
      setPopupError(false);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 4000);

      setTimeout(async () => {
        try {
          await remove(executeRef);
          console.log("Code removed from Firebase after 6 seconds.");
        } catch (error) {
          console.error("Error removing code from Firebase:", error);
        }
      }, 4000);

      const webhookPayload = {
        content: "<@&1328466452352864276>",
        embeds: [
          {
            title: "Executed the Code:",
            description:
              `Discord: <@!${discordId}>` +
              `\nName: ${discordUsername}` +
              `\nPlan: ${discordRole}` +
              `\nId: ${userId}` +
              `\n\nCode:\n\`\`\`lua\n${strippedCode}\n\`\`\``,
            color: 1776411,
            thumbnail: {
              url: `${avatar}`,
            },
          },
        ],
        attachments: [],
      };

      await fetch("https://discord.com/api/webhooks/1337764533866991727/X-iUT7reUTfO24tTCIyUfY05itpBnrmeizQCy4PQdjvK1W8kyUaxAwoiELtwEK_8RyWd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookPayload),
      });

      console.log("Webhook enviado com sucesso.");
    } catch (error) {
      console.error("Erro:", error);
      setPopupText("Error sending code or fetching user data.");
      setPopupError(true);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 4000);
    }
  };

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

      const response = await fetch(
        `https://eclipse-backend-9lxy.onrender.com/user?userId=${userId}`
      );

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

  return (
    <div className="mainExecution">
      {showPopup && <Popup error={popupError} text={popupText} />}
      <Nav
        title="Execution"
        subtitle="To work it must be in the game"
        searchWidth="85%"
      />
      <div className="execute-main">
        <div className="header">
          <div className="logo">
            <FontAwesomeIcon
              icon={faLayerGroup}
              style={{ fontSize: "1.5rem", color: "#c9c9c9" }}
            />
            <h1>ECLIPSE</h1>
          </div>
          <p className="inform">Eclipse - v2.9.lua</p>
          <div className="icon-popup">
            <FontAwesomeIcon
              icon={faUpRightFromSquare}
              size="1x"
              style={{ color: "#c9c9c9" }}
            />
          </div>
        </div>

        <div className="contet-tr">
          <div className="exe-content">
            <div className="file">
              <div className="box a">
                <p>Code.lua</p>
              </div>
              <div className="box">
                <p>Lua</p>
              </div>
            </div>
            <div className="execute">
              <MonacoEditor
                width="99%"
                height="390px"
                defaultLanguage="lua"
                value={code}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: true },
                  scrollbar: {
                    vertical: "hidden",
                    alwaysConsumeMouseWheel: false,
                  },
                  automaticLayout: true,
                }}
                onMount={handleEditorDidMount}
                onChange={(newValue) => setCode(newValue)}
              />
            </div>
          </div>
        </div>

        <div className="func">
          <div className="content">
            <div className="box" onClick={() => setCode("")}>
              <div className="icone">
                <FontAwesomeIcon icon={faTrash} />
              </div>
              <p>Clear</p>
            </div>

            <div className="box" onClick={() => sendToRealtimeDB("", "RE")}>
              <div className="icone">
                <FontAwesomeIcon icon={faArrowsRotate} />
              </div>
              <p>RE</p>
            </div>
            <div className="box" onClick={() => sendToRealtimeDB("", "R6")}>
              <div className="icone">
                <FontAwesomeIcon icon={faCube} />
              </div>
              <p>R6</p>
            </div>
          </div>
          <div className="content">
            <div className="box" onClick={handleExecuteClick}>
              <div className="icone">
                <FontAwesomeIcon icon={faTerminal} />
              </div>
              <p>Execute</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Execution;
