document.getElementById("play-btn").addEventListener("click", (event) => {
  event.preventDefault(); // Stop navigation temporarily
  console.log("Play button clicked");
  const players = document.getElementById("players");
  const userEntries = players.getElementsByClassName("user-entry");
  let playerData = [];
  userEntries.forEach((element, index) => {
    let playerCount = index + 1;
    let playerName = element.querySelector(`input[type="text""]`).value;
    let playerColor = element.querySelector(`input[type="color"]`).value;
    if (!playerName && playerCount <= 2) {
      alert(`A least Two players are required to play the game`);
      playerName.focus();
      return;
    }
    if (playerData.find((player) => player.color === playerColor)) {
      alert(`Please choose different colors for each player`);
      playerColor.focus();
      return;
    }
    if (playerData.find((player) => player.name === playerName)) {
      alert(`Please choose different names for each player`);
      playerName.focus();
      return;
    }
    if (playerName && playerColor) {
      playerData.push({ name: playerName, color: playerColor });
    }
  });

  // Encode as JSON
  const playersJSON = JSON.stringify(playerData);
  const encoded = encodeURIComponent(playersJSON);

  window.location.href = `game.html?players=${encoded}`;
});
