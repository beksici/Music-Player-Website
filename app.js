const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const audio = document.querySelector("#audio");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#controls #prev");
const play = document.querySelector("#controls #play");
const next = document.querySelector("#controls #next");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const ul = document.querySelector("ul");
const player = new MusicPlayer(musicList);
let music = player.getMusic();
console.log(music.getName());

//sayfa tam yüklendiğinde demek load
window.addEventListener("load", () => {
  let music = player.getMusic();
  displayMusic(music);
  displayMusicList(player.musicList);
  isPlayingNow();
});
function displayMusic(music) {
  title.innerText = music.getName();
  singer.innerText = music.singer;
  image.src = "img/" + music.img;
  audio.src = "mp3/" + music.file;
}

play.addEventListener("click", () => {
  const isMusicPlay = container.classList.contains("playing");
  isMusicPlay ? pauseMusic() : playMusic();

  //audio.play(); //musici başlatır.
});
//prev tuşuna basınca
prev.addEventListener("click", () => {
  prevMusic();
  isPlayingNow();
});
function prevMusic() {
  player.prev();
  let music = player.getMusic();
  displayMusic(music);
  playMusic();
}
//next tuşuna basınca
next.addEventListener("click", () => {
  nextMusic();
  isPlayingNow();
});

function nextMusic() {
  player.next();
  let music = player.getMusic();
  displayMusic(music);
  playMusic();
}
//müziği durdurmak için
function pauseMusic() {
  container.classList.remove("playing");
  play.querySelector("i").classList = "fa-solid fa-play";
  audio.pause();
}
//müziği oynatmak için
function playMusic() {
  container.classList.add("playing");
  play.querySelector("i").classList = "fa-solid fa-pause";
  audio.play(); //musici başlatır.
}

//aşağıdaki arrow function tanımlası yukarıdaki de normal olan
const calculateTime = (seconds) => {
  const minute = Math.floor(seconds / 60);
  const second = Math.floor(seconds % 60);
  const updateSecond = second < 10 ? `0${second}` : `${second}`;
  const time = `${minute}:${updateSecond}`;
  return time;
};

//loadedmetadata diyoruz çünkü müziğin sayfay yüklendikten sonra duration bilgisini alabiliyoruz
audio.addEventListener("loadedmetadata", () => {
  duration.textContent = calculateTime(audio.duration);
  progressBar.max = Math.floor(audio.duration); // progress barın default 100% dür biz onu saniye cinsinden uzattık mesela şarkı 180 saniye ise progres bar 180 gösterir
});

// timeupdate her saniye geçtiğinde içindeki işlemi yapar
audio.addEventListener("timeupdate", () => {
  progressBar.value = Math.floor(audio.currentTime); // currentTime müziğin o anki saniyesini gösterir
  currentTime.textContent = calculateTime(progressBar.value);
});

//input event i herhangi bir kontrole konumlanma aşamasında çalışır
progressBar.addEventListener("input", () => {
  currentTime.textContent = calculateTime(progressBar.value);
  audio.currentTime = progressBar.value;
});

let muteState = "unmuted";
volume.addEventListener("click", () => {
  if (muteState === "unmuted") {
    audio.muted = true; // audio özelliğinden muted true dersen sessize alır
    muteState = "muted";
    volume.classList = "fa-solid fa-volume-xmark";
    volumeBar.value = 0;
  } else {
    audio.muted = false;
    muteState = "unmuted";
    volume.classList = "fa-solid fa-volume-high";
    volumeBar.value = 100;
  }
});

//ses düzeyini ayarlamk için
// e yi burada referans olarak gönderirsek kullanıcı event yaptığında yani barla iletişime geçtiği her veriyi almış oluyoruz
volumeBar.addEventListener("input", (e) => {
  // console.log(e); //eventi görürsün value de ulaşırız
  // console.log(e.target.value);

  const value = e.target.value;
  audio.volume = value / 100; // audio volume 0 ile 1 arasında değer alır ama bizim bar 0 ile 100 arasında alıyor bu yüzde ona göre ayarlamak gerekir
  if (value == 0) {
    audio.muted = true;
    muteState = "muted";
    volume.classList = "fa-solid fa-volume-xmark";
  } else {
    audio.muted = false;
    muteState = "unmuted";
    volume.classList = "fa-solid fa-volume-high";
  }
});
//müzik listesi göster
const displayMusicList = (list) => {
  for (let i = 0; i < list.length; i++) {
    let liTag = `<li onclick="selectedMusic(this)" li-index=${i}
    class="list-group-item d-flex justify-content-between align-items-center"
  >
    <span>${list[i].getName()}</span>
    <span id="music-${i}" class="badge bg-primary rounded-pill"> </span>
    <audio class="music-${i}" src="mp3/${list[i].file}"> </audio>
  </li>`;
    ul.insertAdjacentHTML("beforeend", liTag);
    let liAudioDuration = ul.querySelector(`#music-${i}`);
    let liAudioTag = ul.querySelector(`.music-${i}`);
    liAudioTag.addEventListener("loadeddata", () => {
      liAudioDuration.innerText = calculateTime(liAudioTag.duration);
    });
  }
};

//çalınan müzik
const selectedMusic = (li) => {
  const index = li.getAttribute("li-index");
  player.index = index;
  player.getMusic();
  displayMusic(player.getMusic());
  playMusic();
  isPlayingNow();
};

//çalan şarkının alltaki listede backgroundunu değiştirmek için
const isPlayingNow = () => {
  for (let li of ul.querySelectorAll("li")) {
    if (li.classList.contains("playing")) {
      li.classList.remove("playing");
    }

    if (li.getAttribute("li-index") == player.index) {
      li.classList.add("playing");
    }
  }
};

//music bittiğinde ne yapacağının eventi
audio.addEventListener("ended", () => {
  nextMusic();
  isPlayingNow();
});

// player.next(); //sonraki music gelsin
// music = player.getMusic();
// console.log(music.getName());

// player.previous(); //önceki müzik gelsin
// music = player.getMusic();
// console.log(music.getName());
