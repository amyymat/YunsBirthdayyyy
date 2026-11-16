// --- PEMBOLEHUBAH GLOBAL ---
let typingTimer = null;
let charIndex = 0;
let activePolaroid = null;

const greetingText = `"Selamat Hari Jadi u, Ini ja yang termampu dilakukan untuk u, Semoga dengan hari jadi u harini, u menjadi manusia paling kuat di Bumi, tercapai cita-cita, dimurahkan rezeki, kesihatan bertambah baik, Sorry sebab jadi lelaki paling busy di dunia, ketahuilah bahawa me is love u so much, wanita pling baik d muka bumi, yang x ada di market place , Shopee, jalan raya, Mall dimana-mana pun, i sayang u hari ini, esok, lusa, tulat, kemarin dan sampai bila-bila."`;

// --- 1. FUNGSI TUKAR SKRIN (GLOBAL SUPAYA BOLEH DIPANGGIL TERUS DARI HTML) ---
function switchScreen(targetId) {
  closeExpandedPolaroid();

  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  const targetScreen = document.getElementById(targetId);
  if (targetScreen) {
    targetScreen.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// --- 2. FUNGSI BUKA SAMPUL SURAT & MAINKAN LAGU 1 (lagu.mp3) ---
function openEnvelope() {
  switchScreen("screen-opened");

  const bgMusic = document.getElementById("bgMusic");
  if (bgMusic && bgMusic.paused) {
    bgMusic.play().catch((err) => {
      console.warn("Audio utama menunggu interaksi:", err);
    });
  }
}

// --- 3. FUNGSI MASUK KE BAHAGIAN GIFT & MULAKAN TYPEWRITER ---
function startTypewriter() {
  const typewriterElement = document.getElementById("typewriter-text");
  if (!typewriterElement) return;

  clearInterval(typingTimer);
  typewriterElement.textContent = "";
  charIndex = 0;

  typingTimer = setInterval(() => {
    if (charIndex < greetingText.length) {
      typewriterElement.textContent += greetingText.charAt(charIndex);
      charIndex++;
    } else {
      clearInterval(typingTimer);
    }
  }, 35);
}

function openGiftSection() {
  switchScreen("screen-gift");
  startTypewriter();
}

// --- 4. FUNGSI BUTANG "PLAY MUSIK" DI BAHAGIAN GIFT (lagu2.mp3) ---
function toggleGiftMusic() {
  const bgMusic = document.getElementById("bgMusic");
  const giftMusic = document.getElementById("giftMusic");
  const vinylDisc = document.getElementById("vinylDisc");
  const playIcon = document.getElementById("playIcon");
  const musicStatus = document.getElementById("musicStatus");

  if (!giftMusic) return;

  if (giftMusic.paused) {
    if (bgMusic) bgMusic.pause();

    giftMusic.play().then(() => {
      if (vinylDisc) vinylDisc.classList.add("spinning");
      if (playIcon) playIcon.textContent = "⏸";
      if (musicStatus) musicStatus.textContent = "Pause Musik";
    }).catch((err) => {
      console.warn("Gagal memainkan lagu2.mp3:", err);
    });
  } else {
    giftMusic.pause();
    if (vinylDisc) vinylDisc.classList.remove("spinning");
    if (playIcon) playIcon.textContent = "▶";
    if (musicStatus) musicStatus.textContent = "Play Musik";
  }
}

// --- 5. FUNGSI BUTANG "BACK" DARI GIFT -> HENTIKAN LAGU 2 & SAMBUNG LAGU 1 ---
function backFromGift() {
  const bgMusic = document.getElementById("bgMusic");
  const giftMusic = document.getElementById("giftMusic");
  const vinylDisc = document.getElementById("vinylDisc");
  const playIcon = document.getElementById("playIcon");
  const musicStatus = document.getElementById("musicStatus");

  if (giftMusic) {
    giftMusic.pause();
    giftMusic.currentTime = 0;
  }
  if (vinylDisc) vinylDisc.classList.remove("spinning");
  if (playIcon) playIcon.textContent = "▶";
  if (musicStatus) musicStatus.textContent = "Play Musik";

  if (bgMusic) {
    bgMusic.play().catch((err) => {
      console.warn("Gagal menyambung lagu utama:", err);
    });
  }

  switchScreen("screen-menu");
}

// --- 6. FUNGSI TUTUP ZOOM POLAROID ---
function closeExpandedPolaroid() {
  if (!activePolaroid) return;

  const captionEl = activePolaroid.querySelector(".polaroid-caption");
  if (captionEl) {
    captionEl.textContent = "...";
  }

  activePolaroid.style.transform = "";
  activePolaroid.classList.remove("expanded");

  const polaroidBackdrop = document.getElementById("polaroidBackdrop");
  if (polaroidBackdrop) {
    polaroidBackdrop.classList.remove("active");
  }

  activePolaroid = null;
}

// --- 7. INISIALISASI GAMBAR & INTERAKSI POLAROID ---
document.addEventListener("DOMContentLoaded", () => {
  // Penyelamat Gambar Automatik (.jpeg <-> .jpg)
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", function () {
      if (this.src.endsWith(".jpeg")) {
        this.src = this.src.replace(".jpeg", ".jpg");
      } else if (this.src.endsWith(".jpg") && !this.dataset.triedUpper) {
        this.dataset.triedUpper = "true";
        this.src = this.src.replace(".jpg", ".JPG");
      }
    });
  });

  // Interaksi Klik Polaroid di Bahagian Moment
  const polaroids = document.querySelectorAll(".polaroid");
  const polaroidBackdrop = document.getElementById("polaroidBackdrop");

  polaroids.forEach((polaroid) => {
    polaroid.addEventListener("click", (e) => {
      e.stopPropagation();

      if (activePolaroid === polaroid) {
        closeExpandedPolaroid();
        return;
      }

      if (activePolaroid) {
        closeExpandedPolaroid();
      }

      activePolaroid = polaroid;
      const fullCaption = polaroid.getAttribute("data-caption") || "...";
      const captionEl = polaroid.querySelector(".polaroid-caption");

      if (captionEl) {
        captionEl.textContent = fullCaption;
      }

      const rect = polaroid.getBoundingClientRect();
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const deltaX = viewportCenterX - cardCenterX;
      const deltaY = viewportCenterY - cardCenterY;
      const zoomScale = window.innerWidth < 600 ? 1.85 : 2.15;

      polaroid.classList.add("expanded");
      if (polaroidBackdrop) polaroidBackdrop.classList.add("active");
      polaroid.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${zoomScale}) rotate(0deg)`;
    });
  });

  const momentScreen = document.getElementById("screen-moment");
  if (momentScreen) {
    momentScreen.addEventListener("click", (e) => {
      if (activePolaroid && !e.target.closest(".polaroid")) {
        closeExpandedPolaroid();
      }
    });
  }
});
