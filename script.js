document.addEventListener("DOMContentLoaded", () => {
  // --- 1. PEMBOLEHUBAH ELEMEN DOM ---
  const screens = document.querySelectorAll(".screen");
  const btnOpenEnvelope = document.getElementById("btnOpenEnvelope");
  const btnOpenGift = document.getElementById("btnOpenGift");
  const navButtons = document.querySelectorAll("[data-target]");

  // Elemen Muzik & Piring Hitam
  const bgMusic = document.getElementById("bgMusic");
  const vinylControl = document.getElementById("vinylControl");
  const vinylDisc = document.getElementById("vinylDisc");
  const playIcon = document.getElementById("playIcon");
  const musicStatus = document.getElementById("musicStatus");

  // Elemen Typewriter Surat
  const typewriterElement = document.getElementById("typewriter-text");
  const giftMessage = `"Selamat ulang tahun, Sayang. Di hari spesialmu ini, aku cuma mau bilang terima kasih karena sudah lahir ke dunia dan membawa begitu banyak kebahagiaan ke hidupku. Kamu adalah hal terindah yang pernah hadir dalam hidupku, dan aku berharap bisa terus merayakan hari-hari bahagiamu di tahun-tahun berikutnya. I love you so much, kini dan nanti."`;
  
  let typingTimer = null;
  let charIndex = 0;

  // --- 2. FUNGSI PERTUKARAN SKRIN (SPA NAVIGATION) ---
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

  // --- 3. EVENT LISTENER UNTUK BUTANG NAVIGASI ---
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      switchScreen(targetId);
    });
  });

  // Klik Sampul Surat (Skrin 1 -> Skrin 2)
  if (btnOpenEnvelope) {
    btnOpenEnvelope.addEventListener("click", () => {
      switchScreen("screen-opened");
    });
  }

  // --- 4. FUNGSI TYPEWRITER SURAT UCAPAN (SKRIN GIFT) ---
  function startTypewriter() {
    clearInterval(typingTimer);
    typewriterElement.textContent = "";
    charIndex = 0;

    typingTimer = setInterval(() => {
      if (charIndex < giftMessage.length) {
        typewriterElement.textContent += giftMessage.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(typingTimer);
      }
    }, 38); // Kelajuan menaip (38ms setiap huruf)
  }

  if (btnOpenGift) {
    btnOpenGift.addEventListener("click", () => {
      switchScreen("screen-gift");
      startTypewriter();
    });
  }

  // --- 5. KAWALAN AUDIO & ANIMASI PIRING HITAM ---
  function toggleMusic() {
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        vinylDisc.classList.add("spinning");
        playIcon.textContent = "⏸";
        musicStatus.textContent = "Pause Musik";
      }).catch((err) => {
        console.warn("Interaksi diperlukan untuk mainkan audio:", err);
      });
    } else {
      bgMusic.pause();
      vinylDisc.classList.remove("spinning");
      playIcon.textContent = "▶";
      musicStatus.textContent = "Play Musik";
    }
  }

  if (vinylControl) {
    vinylControl.addEventListener("click", toggleMusic);
  }
});
