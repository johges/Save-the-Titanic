const playTime = localStorage.getItem("playTime")

const bgSound = new Audio("./sounds/applause.mp3");

playBackgroundSound = () => {
    bgSound.play();
}

bgSound.autoplay = true;
document.body.appendChild(bgSound);

if (playTime) {
    const minutes = Math.floor(playTime / 60);
    const seconds = Math.floor(playTime % 60);
    const formattedPlayTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    const playTimeDisplay = document.querySelector('.playTimeDisplay');
    playTimeDisplay.textContent = `Winning time: ${formattedPlayTime}`;
}
