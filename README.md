<div align="center">
  # 🕉️ Siggy Temple
  
  ## 🤖 Play inside Telegram: [Siggy God Bot](https://t.me/SiggySayFukBot) 🤖
  
  **Your ultimate mini-game & clicker hub, fully optimized for Telegram Mini Apps!**

  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://wikipedia.org/wiki/HTML5)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://wikipedia.org/wiki/CSS3)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

  <p align="center">
    <a href="#features">🌟 Features</a> •
    <a href="#demo">🎮 How to Play</a> •
    <a href="#installation">🚀 Installation</a> •
    <a href="#telegram-mini-app-integration">📱 Telegram Mini App</a>
  </p>
</div>

---

## 📖 About The Project

**Siggy Temple** is a highly interactive, responsive web application designed as a collection of addictive mini-games built around the "Siggy" lore. Originally conceived as a fun clicking experience where players gather **Prayers (Points)**, it has evolved into a full-fledged entertainment hub featuring gambling, quizzes, an arcade game, and a mystical confessional chat system! 

Designed specifically with a **Mobile-First App Interface**, it works perfectly standalone or integrated directly into **Telegram** as a Web App (Telegram Mini App).

## 🌟 Features

The application is split into exactly **6 distinct interactive views**, each offering varying risk/reward ways to collect Prayers:

### 🙏 1. The Temple (Clicker Main Screen)
* Spam-click the Siggy avatar to earn Prayers!
* Features energetic pulse-glow effects, floating text, and milestone animations.
* An energy system (1000/1000) that slowly regenerates over time.
* Real-time scrolling score updates.

### 🪙 2. Head or Tail (Betting Game)
* Feeling lucky? Bet your accumulated prayers and flip the coin!
* Features smooth 3D CSS flip animations.
* **Double or Nothing**: Win 2x your bet on correct guesses. Can you handle the pressure?

### 😺 3. Flappy Siggy (Arcade Mode)
* An infinite runner mode inspired by the notorious Flappy Bird!
* Tap to fly your Fire Cat avatar through green pipes.
* Earn passive Prayers for every pipe you successfully pass!

### 🧠 4. Ritual Quiz
* Test your knowledge of the Ritual Network lore.
* Answer multiple-choice questions correctly to earn massive bounties (+1,000 Prayers).
* Immediate visual feedback on Correct/Wrong answers before automatically loading the next question. 

### 🛒 5. The Store
* Maximize your earnings by purchasing temporary multipliers!
* **x10 Boost**: 30 minutes duration for 5,000 Prayers.
* **x100 Boost**: 1 minute hyper-grind duration for 50,000 Prayers.
* **Loyalist Certificate**: A permanent brag-right token that costs 1,000,000 Prayers! All purchases affect the points generation globally across all games.

### ⛪ 6. The Confessional (Chat System)
* Confess your deepest sins to the Siggy Priest!
* *Cost:* 10,000 Prayers per confession.
* Recieve random blessings (or condemnations) in English such as *"You are absolved"* or *"You are a sinner"*.
* Drops random unique sticker images as divine gifts!

---

## 🎨 Design & UI Highlights

- **Glassmorphism Aesthetic:** Translucent glowing backgrounds, blurred containers, and frosted glass modals.
- **Dynamic Animations:** Real-time CSS3 animations including floats, shakes, 3D coin rotations, and UI scaling.
- **Vibrant Colors:** Dark `#0f172a` slates paired with gorgeous glowing gold `#eab308` and bright accents.
- **Full Responsiveness:** Layout fully scales using `clamp()` logic to support any modern browser or mobile screen seamlessly.

---

## 🚀 Installation & Setup

You do not need any modern build tools (Webpack/Vite/NPM) to run this app! It is purely compiled in native HTML/CSS/JS.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/siggy-temple.git
   cd siggy-temple
   ```
2. **Launch a local server** (Optional but recommended for the script modules/image paths to load properly):
   ```bash
   # Using Python 3
   python -m http.server 8000
   ```
3. Open your browser and navigate to `http://localhost:8000`.

---

## 📱 Telegram Mini App Integration

Siggy Temple was meticulously styled to be launched inside a Telegram Web App window.

1. Add the [Telegram Web App SDK](https://core.telegram.org/bots/webapps) to the `<head>` of your `index.html` (Optional, only needed if you want native events):
   ```html
   <script src="https://telegram.org/js/telegram-web-app.js"></script>
   ```
   
2. **Built-in Mobile Defenses:**
   The `overflow: hidden;`, `overscroll-behavior-y: none`, and `height: 100dvh` meta tags are already baked into the CSS to completely block the rubber-banding (bouncing scroll) natively found on iOS Safari and Telegram Web layers, creating an immersive, unbreakable "App-like" feel.

---

## 🤝 Contributing
Found a bug or have an idea for Game 7? Feel free to open an Issue or a Pull Request! All suggestions are warmly welcomed.

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

<p align="center">
   <i>May the Prayers be ever in your favor. 🙏</i>
</p>
