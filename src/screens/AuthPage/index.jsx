import React, { useEffect } from 'react';

const RedirectPage = () => {

    useEffect(() => {
      const fetchUserData = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
  
        try {
          const response = await fetch(`https://eclipse-backend-9lxy.onrender.com/user?userId=${userId}`);
          if (!response.ok) throw new Error("Erro ao buscar dados do usuário");
  
          const data = await response.json();
  
          if (
            localStorage.getItem("discordUsername") !== data.discordUsername ||
            localStorage.getItem("avatar") !== data.avatar ||
            localStorage.getItem("discordRole") !== data.discordRole ||
            localStorage.getItem("robloxUsername") !== data.robloxUsername
          ) {
            localStorage.setItem("discordUsername", data.discordUsername);
            localStorage.setItem("avatar", data.avatar);
            localStorage.setItem("discordRole", data.discordRole);
            localStorage.setItem("robloxUsername", data.robloxUsername);
            
            console.log("✅ Dados do usuário salvos!");
          }
        } catch (error) {
          console.error("❌ Erro ao buscar os dados:", error);
        }
      };
  
      fetchUserData();
    }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userId = params.get("userId");
    const discordId = params.get("discordId");

    if (token && userId && discordId) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("discordId", discordId);
      window.location.href = "/";
    } else {
      window.location.href =
        "https://discord.com/oauth2/authorize?client_id=1343275366864916610&response_type=code&redirect_uri=https%3A%2F%2Feclipse-backend-9lxy.onrender.com%2Fauth%2Fdiscord&scope=identify+guilds+email+guilds.join+connections";
    }
  }, []);

  return <div>Redirecionando...</div>;
};

export default RedirectPage;
