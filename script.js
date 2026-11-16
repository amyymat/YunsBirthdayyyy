document.addEventListener("DOMContentLoaded", () => {
  // --- 1. PEMBOLEHUBAH ELEMEN DOM ---
  const screens = document.querySelectorAll(".screen");
  const btnOpenEnvelope = document.getElementById("btnOpenEnvelope");
  const btnOpenGift = document.getElementById("btnOpenGift");
  const btnBackFromGift = document.getElementById("btnBackFromGift");
  const navButtons = document.querySelectorAll("[data-target]");

  // Elemen Dua Audio (lagu.mp3 & lagu2.mp3)
  const bgMusic = document.getElementById("bgMusic");     // lagu.mp3 (Lagu Utama)
  const giftMusic = document.getElementById("giftMusic"); // lagu2.mp3 (Lagu Bahagian Gift)
  
  // Elemen Piring Hitam di Bahagian Gift
  const vinylControl = document.getElementById("vinylControl");
  const vinylDisc = document.getElementById("vinylDisc");
  const playIcon = document.getElementById("playIcon");
  const musicStatus = document.getElementById("musicStatus");

  // --- 2. TEKS PUISI UNTUK AYUNI (Boleh ubah bait puisi di sini) ---
  const typewriterElement = document.getElementById("typewriter-text");
  const poemText = `Di antara jutaan bintang di Bimasakti,
Hadirnya dirimu adalah cahaya yang paling indah di hati.
Selamat ulang tahun, Nurul Ayuni,
Semoga setiap langkahmu sentiasa dilimpahi bahagia,
Hari ini, esok, dan selamanya.`;

  let typingTimer = null;
  let charIndex = 0;

  // --- 3. PENYELAMAT GAMBAR AUTOMATIK (.jpeg <-> .jpg) ---
  // Jika fail di GitHub berformat .jpg dan bukannya .jpeg, kod ini akan menukarnya secara automatik
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

  // --- 4. FUNGSI PERTUKARAN SKRIN (SPA NAVIGATION) ---
  function switchScreen(targetId) {
    screens.forEach((screen) => {
      screen.classList.remove("active");
    });

    const targetScreen = document.getElementById(targetId);
    if (targetScreen) {
      targetScreen.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Navigasi Butang Biasa
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      switchScreen(targetId);
    });
  });

  // --- 5. TEKAN SAMPUL SURAT -> TERUS MAINKAN LAGU UTAMA (lagu.mp3) ---
  if (btnOpenEnvelope) {
    btnOpenEnvelope.addEventListener("click", () => {
      switchScreen("screen-opened");

      // Mainkan lagu.mp3 serta-merta
      bgMusic.play().catch((err) => {
        console.warn("Audio utama menunggu interaksi:", err);
      });
    });
  }

  // --- 6. MASUK KE BAHAGIAN GIFT & EFEK MENAIP PUISI ---
  function startTypewriter() {
    if (!typewriterElement) return;
    clearInterval(typingTimer);
    typewriterElement.textContent = "";
    charIndex = 0;

    typingTimer = setInterval(() => {
      if (charIndex < poemText.length) {
        typewriterElement.textContent += poemText.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(typingTimer);
      }
    }, 40);
  }

  if (btnOpenGift) {
    btnOpenGift.addEventListener("click", () => {
      switchScreen("screen-gift");
      startTypewriter();
    });
  }

  // --- 7. KAWALAN BUTANG "PLAY MUSIK" DI BAHAGIAN GIFT (lagu2.mp3) ---
  if (vinylControl) {
    vinylControl.addEventListener("click", () => {
      if (giftMusic.paused) {
        // 1. Hentikan seketika lagu utama (lagu.mp3)
        bgMusic.pause();

        // 2. Mainkan lagu kedua (lagu2.mp3)
        giftMusic.play().then(() => {
          vinylDisc.classList.add("spinning");
          playIcon.textContent = "⏸";
          musicStatus.textContent = "Pause Musik";
        }).catch((err) => {
          console.warn("Gagal memainkan lagu2.mp3:", err);
        });
      } else {
        // Jika ditekan semula untuk Pause lagu2.mp3
        giftMusic.pause();
        vinylDisc.classList.remove("spinning");
        playIcon.textContent = "▶";
        musicStatus.textContent = "Play Musik";
      }
    });
  }

  // --- 8. TEKAN BUTANG "BACK" DARI GIFT -> HENTIKAN LAGU 2 & SAMBUNG LAGU 1 ---
  if (btnBackFromGift) {
    btnBackFromGift.addEventListener("click", () => {
      // 1. Hentikan lagu2.mp3 dan set semula kepada awal
      giftMusic.pause();
      giftMusic.currentTime = 0;
      vinylDisc.classList.remove("spinning");
      playIcon.textContent = "▶";
      musicStatus.textContent = "Play Musik";

      // 2. Sambung semula lagu utama (lagu.mp3)
      bgMusic.play().catch((err) => {
        console.warn("Gagal menyambung lagu utama:", err);
      });

      // 3. Kembali ke Menu Utama
      switchScreen("screen-menu");
    });
  }
});
