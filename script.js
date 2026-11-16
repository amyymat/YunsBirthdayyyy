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

  // --- 2. ISI KANDUNGAN KAD UCAPAN (PALING ATAS DI BAHAGIAN GIFT) ---
  const typewriterElement = document.getElementById("typewriter-text");
  const greetingText = `"Selamat Hari Jadi u, Ini ja yang termampu dilakukan untuk u, Semoga dengan hari jadi u harini, u menjadi manusia paling kuat di Bumi, tercapai cita-cita, dimurahkan rezeki, kesihatan bertambah baik, Sorry sebab jadi lelaki paling busy di dunia, ketahuilah bahawa me is love u so much, wanita pling baik d muka bumi, yang x ada di market place , Shopee, jalan raya, Mall dimana-mana pun, i sayang u hari ini, esok, lusa, tulat, kemarin dan sampai bila-bila."`;

  let typingTimer = null;
  let charIndex = 0;

  // --- 3. PENYELAMAT GAMBAR AUTOMATIK (.jpeg <-> .jpg) ---
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

  // --- 4. FUNGSI INTERAKTIF ZOOM POLAROID DI BAHAGIAN MOMENT ---
  const polaroids = document.querySelectorAll(".polaroid");
  const polaroidBackdrop = document.getElementById("polaroidBackdrop");
  let activePolaroid = null;

  function closeExpandedPolaroid() {
    if (!activePolaroid) return;

    const captionEl = activePolaroid.querySelector(".polaroid-caption");
    if (captionEl) {
      captionEl.textContent = "...";
    }

    activePolaroid.style.transform = "";
    activePolaroid.classList.remove("expanded");
    polaroidBackdrop.classList.remove("active");
    activePolaroid = null;
  }

  polaroids.forEach((polaroid) => {
    polaroid.addEventListener("click", (e) => {
      e.stopPropagation();

      // Jika gambar yang sama ditekan semasa sedang besar, kecilkan semula
      if (activePolaroid === polaroid) {
        closeExpandedPolaroid();
        return;
      }

      // Jika ada gambar lain yang sedang besar, tutup dahulu
      if (activePolaroid) {
        closeExpandedPolaroid();
      }

      activePolaroid = polaroid;
      const fullCaption = polaroid.getAttribute("data-caption") || "...";
      const captionEl = polaroid.querySelector(".polaroid-caption");

      // Tukar '...' kepada penerangan sebenar gambar
      if (captionEl) {
        captionEl.textContent = fullCaption;
      }

      // Kira jarak ke tengah skrin supaya gambar membesar tepat di tengah dengan smooth
      const rect = polaroid.getBoundingClientRect();
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const deltaX = viewportCenterX - cardCenterX;
      const deltaY = viewportCenterY - cardCenterY;
      const zoomScale = window.innerWidth < 600 ? 1.85 : 2.15;

      polaroid.classList.add("expanded");
      polaroidBackdrop.classList.add("active");
      polaroid.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${zoomScale}) rotate(0deg)`;
    });
  });

  // Tekan di luar gambar (backdrop atau ruangan skrin) untuk mengecilkan semula gambar
  if (polaroidBackdrop) {
    polaroidBackdrop.addEventListener("click", closeExpandedPolaroid);
  }

  document.getElementById("screen-moment").addEventListener("click", (e) => {
    if (activePolaroid && !e.target.closest(".polaroid")) {
      closeExpandedPolaroid();
    }
  });

  // --- 5. FUNGSI PERTUKARAN SKRIN (SPA NAVIGATION) ---
  function switchScreen(targetId) {
    closeExpandedPolaroid();

    screens.forEach((screen) => {
      screen.classList.remove("active");
    });

    const targetScreen = document.getElementById(targetId);
    if (targetScreen) {
      targetScreen.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      switchScreen(targetId);
    });
  });

  // --- 6. TEKAN SAMPUL SURAT -> TERUS MAINKAN LAGU UTAMA (lagu.mp3) ---
  if (btnOpenEnvelope) {
    btnOpenEnvelope.addEventListener("click", () => {
      switchScreen("screen-opened");

      bgMusic.play().catch((err) => {
        console.warn("Audio utama menunggu interaksi:", err);
      });
    });
  }

  // --- 7. MASUK KE BAHAGIAN GIFT & EFEK MENAIP KAD UCAPAN ---
  function startTypewriter() {
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

  if (btnOpenGift) {
    btnOpenGift.addEventListener("click", () => {
      switchScreen("screen-gift");
      startTypewriter();
    });
  }

  // --- 8. KAWALAN BUTANG "PLAY MUSIK" DI BAHAGIAN GIFT (lagu2.mp3) ---
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

  // --- 9. TEKAN BUTANG "BACK" DARI GIFT -> HENTIKAN LAGU 2 & SAMBUNG LAGU 1 ---
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
