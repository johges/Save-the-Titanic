const playTime = localStorage.getItem("playTime")

if (playTime) {
    const minutes = Math.floor(playTime / 60);
    const seconds = Math.floor(playTime % 60);
    const formattedPlayTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    const playTimeDisplay = document.querySelector('.playTimeDisplay');
    playTimeDisplay.textContent = `Winning time: ${formattedPlayTime}`;
}
