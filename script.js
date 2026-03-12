const scoreEl = document.getElementById('score');
const character = document.getElementById('character-container');
const energyEl = document.getElementById('energy');
const energyFill = document.getElementById('energy-fill');

// UI Elements
const lbBtn = document.getElementById('leaderboard-btn');
const shareBtn = document.getElementById('share-btn');
const lbModal = document.getElementById('leaderboard-modal');
const closeModalBtn = document.getElementById('close-modal');
const lbUserScore = document.getElementById('lb-user-score');

// Daily Reward UI
const rewardBtn = document.getElementById('reward-btn');
const rewardModal = document.getElementById('reward-modal');
const closeRewardBtn = document.getElementById('close-reward-modal');
const rewardGrid = document.getElementById('reward-days-grid');
const claimRewardBtn = document.getElementById('claim-reward-btn');
const rewardMsg = document.getElementById('reward-status-msg');

// Initial Reward State
const REWARD_AMOUNTS = [500, 1000, 2500, 5000, 10000, 25000, 50000];
let streakDays = parseInt(localStorage.getItem('siggy_streak')) || 0;
let lastClaimDate = localStorage.getItem('siggy_lastClaimDate') || "";

// State
let score = parseInt(localStorage.getItem('siggy_score')) || 0;
const MAX_ENERGY = 1000;
let energy = MAX_ENERGY; // Start with full energy for demo

// Store State
let multiplier = parseInt(localStorage.getItem('siggy_multiplier')) || 1;
let multiplierEndTime = parseInt(localStorage.getItem('siggy_multiplierEndTime')) || 0;

function getMultiplier() {
    if (Date.now() < multiplierEndTime) {
        return multiplier;
    }
    return 1;
}

function buyItem(type, cost, durationMins) {
    if (score >= cost) {
        score -= cost;
        scoreEl.innerText = score.toLocaleString('en-US');
        localStorage.setItem('siggy_score', score);
        
        multiplier = type === 'x100' ? 100 : 10;
        multiplierEndTime = Date.now() + durationMins * 60 * 1000;
        localStorage.setItem('siggy_multiplier', multiplier);
        localStorage.setItem('siggy_multiplierEndTime', multiplierEndTime);
        
        const msg = document.getElementById('store-msg');
        msg.style.color = '#10b981';
        msg.innerText = `Activated ${type} boost for ${durationMins} minute(s)!`;
        setTimeout(() => msg.innerText = '', 3000);
    } else {
        const msg = document.getElementById('store-msg');
        msg.style.color = '#f43f5e';
        msg.innerText = "Not enough prayers!";
        setTimeout(() => msg.innerText = '', 3000);
    }
}

function buyLoyalist() {
    if (score >= 1000000) {
        score -= 1000000;
        scoreEl.innerText = score.toLocaleString('en-US');
        localStorage.setItem('siggy_score', score);
        
        const msg = document.getElementById('store-msg');
        msg.style.color = '#10b981';
        msg.innerText = "You are now a certified Loyalist!";
        document.querySelector('.loyalist-btn').innerText = "Owned";
        document.querySelector('.loyalist-btn').disabled = true;
    } else {
        const msg = document.getElementById('store-msg');
        msg.style.color = '#f43f5e';
        msg.innerText = "Not enough prayers!";
        setTimeout(() => msg.innerText = '', 3000);
    }
}

// Initialize UI
scoreEl.innerText = score.toLocaleString('en-US');
updateEnergyUI();

// Audio Context setup
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playTempleSound() {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    // A soothing bell-like sound
    osc.type = 'sine';
    
    // Frequency drop for bell effect
    osc.frequency.setValueAtTime(900, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
    
    // Volume envelope (attack and decay)
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
}

// Interaction handling
const MILESTONE_WORDS = ["gsiggy", "gritual", "ritual", "god siggy", "grity"];

function handleInteraction(e) {
    e.preventDefault();
    if (energy <= 0) return;
    
    // Ensure audio context is ready (requires user interaction to start)
    initAudio();
    
    // Update Score
    score += 1 * getMultiplier();
    scoreEl.innerText = score.toLocaleString('en-US');
    localStorage.setItem('siggy_score', score);
    
    // Update Energy
    energy -= 1;
    updateEnergyUI();
    
    // Play Sound
    playTempleSound();
    
    // Show Floating Icon
    showFloatingIcon(e);
    
    // Check Milestone (every 10 clicks)
    if (score % 10 === 0) {
        showMilestoneText(e);
    } else if (score % 5 === 0) {
        // Show image popup on 5, 15, 25...
        showPopupImage(e);
    }
    
    // Add micro-vibration if supported
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
    }
}

function showFloatingIcon(e) {
    const icon = document.createElement('div');
    icon.classList.add('floating-icon');
    icon.innerText = '🙏'; // Chắp tay icon
    
    let x, y;
    
    // Get Coordinates (handle both touch and mouse/pointer)
    if (e.touches && e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }
    
    // Fallback if coords are undefined
    if (x === undefined || y === undefined) {
        const rect = character.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
    }
    
    icon.style.left = `${x}px`;
    icon.style.top = `${y}px`;
    
    document.body.appendChild(icon);
    
    // Clean up DOM after animation finishes (1 second)
    setTimeout(() => {
        icon.remove();
    }, 1000);
}

function showMilestoneText(e) {
    const textEl = document.createElement('div');
    textEl.classList.add('milestone-text');
    
    // Choose random word
    const randomWord = MILESTONE_WORDS[Math.floor(Math.random() * MILESTONE_WORDS.length)];
    textEl.innerText = randomWord;    
    
    let x, y;
    // Get Coordinates
    if (e.touches && e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }
    
    // Fallback coords
    if (x === undefined || y === undefined) {
        const rect = character.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
    }
    
    // Add random offset so they don't cover the main icon
    const offsetX = (Math.random() - 0.5) * 120;
    const offsetY = (Math.random() - 0.5) * 60 - 60; // offset upwards
    
    textEl.style.left = `${x + offsetX}px`;
    textEl.style.top = `${y + offsetY}px`;
    
    document.body.appendChild(textEl);
    
    setTimeout(() => {
        textEl.remove();
    }, 1500);
}

function showPopupImage(e) {
    const imgWrapper = document.createElement('div');
    imgWrapper.classList.add('popup-image');
    
    const img = document.createElement('img');
    // Random 1 or 2
    const num = Math.random() < 0.5 ? 1 : 2;
    img.src = `assets/popup${num}.png`;
    
    imgWrapper.appendChild(img);
    
    let x, y;
    if (e.touches && e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }
    
    if (x === undefined || y === undefined) {
        const rect = character.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
    }
    
    // Random offset
    const offsetX = (Math.random() - 0.5) * 150;
    const offsetY = (Math.random() - 0.5) * 100 - 80; // offset upwards
    
    imgWrapper.style.left = `${x + offsetX}px`;
    imgWrapper.style.top = `${y + offsetY}px`;
    
    document.body.appendChild(imgWrapper);
    
    setTimeout(() => {
        imgWrapper.remove();
    }, 1200);
}

function updateEnergyUI() {
    energyEl.innerText = energy;
    const percentage = (energy / MAX_ENERGY) * 100;
    energyFill.style.width = `${percentage}%`;
}

// Energy Regeneration Loop
setInterval(() => {
    if (energy < MAX_ENERGY) {
        energy += 1;
        updateEnergyUI();
    }
    
    // Update active boost UI
    const boostEl = document.getElementById('active-boost');
    const bContainer = document.getElementById('boost-status-container');
    const bIcon = document.getElementById('boost-status-icon');
    const bText = document.getElementById('boost-status-text');
    
    if (boostEl && bContainer) {
        if (Date.now() < multiplierEndTime) {
            const remaining = Math.ceil((multiplierEndTime - Date.now()) / 1000);
            const m = Math.floor(remaining / 60);
            const s = remaining % 60;
            boostEl.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
            
            // Active Theme
            bContainer.classList.add('border-[#D4AF37]', 'bg-[#D4AF37]/10', 'shadow-[0_0_15px_rgba(212,175,55,0.3)]');
            bContainer.classList.remove('border-white/10', 'bg-white/5');
            bIcon.classList.add('text-[#F3D06D]');
            bIcon.classList.remove('text-white');
            bText.classList.add('text-[#F3D06D]');
            bText.classList.remove('text-white');
            bText.innerText = `x${multiplier}`;
            
        } else {
            boostEl.innerText = '';
            
            // Inactive Theme
            bContainer.classList.remove('border-[#D4AF37]', 'bg-[#D4AF37]/10', 'shadow-[0_0_15px_rgba(212,175,55,0.3)]');
            bContainer.classList.add('border-white/10', 'bg-white/5');
            bIcon.classList.remove('text-[#F3D06D]');
            bIcon.classList.add('text-white');
            bText.classList.remove('text-[#F3D06D]');
            bText.classList.add('text-white');
            bText.innerText = 'Boost';
        }
    }
}, 1000);

// Add listener to the entire container to capture fast taps
character.addEventListener('pointerdown', handleInteraction);

// --- Modals and Actions ---

// Leaderboard Modal
if (lbBtn) {
    lbBtn.addEventListener('click', () => {
        // Update dynamic user score in LB
        lbUserScore.innerText = score.toLocaleString('en-US');
        lbModal.classList.add('active');
    });
}
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        lbModal.classList.remove('active');
    });
}

// Close modal when clicking outside content
if (lbModal) {
    lbModal.addEventListener('click', (e) => {
        if (e.target === lbModal) {
            lbModal.classList.remove('active');
        }
    });
}

// Twitter Share Action
if (shareBtn) {
    shareBtn.addEventListener('click', () => {
        const text = `I am praying for Siggy. I have prayed for him to get ${score.toLocaleString('en-US')} prayers. We are Siggy's servants, please grant us a miracle @ritualnet`;
        const hashtags = "SiggyTemple,TapToEarn,ritual";
        const url = "https://siggy.temple"; // Replace with actual URL if known
        
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}&url=${encodeURIComponent(url)}`;
        
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    });
}

// --- Daily Rewards Logic ---
function isToday(dateString) {
    if (!dateString) return false;
    return new Date().toDateString() === new Date(dateString).toDateString();
}

function isYesterday(dateString) {
    if (!dateString) return false;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toDateString() === new Date(dateString).toDateString();
}

function renderRewardGrid() {
    // Reset streak if missed a day
    if (lastClaimDate && !isToday(lastClaimDate) && !isYesterday(lastClaimDate)) {
        streakDays = 0;
        localStorage.setItem('siggy_streak', streakDays);
    }
    
    // Cycle back to 0 if 7 days completed and a new day starts
    if (streakDays >= 7 && !isToday(lastClaimDate)) {
        streakDays = 0;
        localStorage.setItem('siggy_streak', streakDays);
    }

    const canClaimToday = !isToday(lastClaimDate);
    
    rewardGrid.innerHTML = '';
    for (let i = 0; i < 7; i++) {
        const dayEl = document.createElement('div');
        const isPast = i < streakDays;
        const isCurrent = i === streakDays;
        const rewardValue = REWARD_AMOUNTS[i] >= 1000 ? (REWARD_AMOUNTS[i]/1000) + 'K' : REWARD_AMOUNTS[i];
        
        let styleClass = "bg-white/5 border-white/10 opacity-60"; // Default future
        let checkIcon = "";
        
        if (isPast) {
            styleClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300";
            checkIcon = `<span class="material-symbols-outlined text-[16px] absolute -top-2 -right-2 bg-emerald-500 text-black rounded-full p-0.5 shadow-md">check</span>`;
        } else if (isCurrent && canClaimToday) {
            styleClass = "bg-[#D4AF37]/20 border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.3)] animate-pulse";
        }
        
        dayEl.className = `relative flex flex-col items-center justify-center p-2 rounded-xl border ${styleClass} transition-all`;
        dayEl.innerHTML = `
            ${checkIcon}
            <span class="text-[10px] uppercase font-bold text-slate-400 mb-1">Day ${i+1}</span>
            <img src="assets/popup1.png" class="w-6 h-6 object-contain mb-1 drop-shadow-md">
            <span class="text-[12px] font-black font-['Outfit'] text-white">${rewardValue}</span>
        `;
        rewardGrid.appendChild(dayEl);
    }
    
    if (canClaimToday) {
        claimRewardBtn.disabled = false;
        claimRewardBtn.innerText = `Claim ${REWARD_AMOUNTS[streakDays]} Prayers`;
        rewardMsg.innerText = "";
    } else {
        claimRewardBtn.disabled = true;
        claimRewardBtn.innerText = "Come Back Tomorrow";
        rewardMsg.innerText = "You have already claimed today's blessing!";
        rewardMsg.style.color = '#94a3b8';
    }
}

if (rewardBtn) {
    rewardBtn.addEventListener('click', () => {
        renderRewardGrid();
        rewardModal.classList.add('active');
    });
}
if (closeRewardBtn) {
    closeRewardBtn.addEventListener('click', () => {
        rewardModal.classList.remove('active');
    });
}
if (rewardModal) {
    rewardModal.addEventListener('click', (e) => {
        if (e.target === rewardModal) {
            rewardModal.classList.remove('active');
        }
    });
}

if (claimRewardBtn) {
    claimRewardBtn.addEventListener('click', () => {
        if (isToday(lastClaimDate)) return; // Double check
        
        const rewardAmount = REWARD_AMOUNTS[streakDays];
        score += rewardAmount * getMultiplier();
        scoreEl.innerText = score.toLocaleString('en-US');
        localStorage.setItem('siggy_score', score);
        
        streakDays++;
        lastClaimDate = new Date().toDateString();
        localStorage.setItem('siggy_streak', streakDays);
        localStorage.setItem('siggy_lastClaimDate', lastClaimDate);
        
        rewardMsg.innerText = `Blessed with ${rewardAmount.toLocaleString('en-US')} Prayers!`;
        rewardMsg.style.color = '#10b981';
        
        initAudio();
        playTempleSound();
        renderRewardGrid();
        
        setTimeout(() => {
            rewardModal.classList.remove('active');
        }, 1500);
    });
}

// --- Tab Navigation ---
const navBtns = document.querySelectorAll('.nav-btn');
const gameViews = document.querySelectorAll('.game-view');

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update Active Button
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update Active View
        const targetId = btn.getAttribute('data-target');
        gameViews.forEach(view => {
            view.classList.remove('active');
            if (view.id === targetId) {
                view.classList.add('active');
            }
        });
    });
});

// --- Coin Flip Game Logic ---
const betAmountInput = document.getElementById('bet-amount');
const btnHead = document.getElementById('btn-head');
const btnTail = document.getElementById('btn-tail');
const coin = document.getElementById('coin');
const flipResult = document.getElementById('flip-result');

let isFlipping = false;

function handleCoinFlip(userChoice) {
    if (isFlipping) return;
    
    // Validate Bet
    const bet = parseInt(betAmountInput.value);
    if (isNaN(bet) || bet <= 0) {
        flipResult.innerText = "Please enter a valid bet amount.";
        flipResult.className = 'flip-lose';
        return;
    }
    
    if (bet > score) {
        flipResult.innerText = "Not enough prayers!";
        flipResult.className = 'flip-lose';
        return;
    }
    
    // Deduct bet amount
    isFlipping = true;
    score -= bet;
    scoreEl.innerText = score.toLocaleString('en-US');
    localStorage.setItem('siggy_score', score);
    
    flipResult.innerText = "Flipping...";
    flipResult.className = '';
    
    // Disable Buttons
    btnHead.disabled = true;
    btnTail.disabled = true;
    betAmountInput.disabled = true;
    
    // Generate Result (0 = Head, 1 = Tail)
    const result = Math.random() < 0.5 ? 'head' : 'tail';
    
    // Reset coin animation
    coin.style.transition = 'none';
    coin.style.transform = 'rotateY(0deg)';
    
    // Force reflow
    void coin.offsetWidth;
    
    // Animate Coin
    coin.style.transition = 'transform 3s cubic-bezier(0.1, 0.8, 0.3, 1)';
    
    // Calculate spins (at least 5 full rotations + extra half if tail)
    const spins = 5; 
    let degrees = spins * 360;
    if (result === 'tail') degrees += 180;
    
    coin.style.transform = `rotateY(${degrees}deg)`;
    
    // Resolve bet after animation
    setTimeout(() => {
        if (userChoice === result) {
            const winAmount = bet * 2 * getMultiplier();
            score += winAmount;
            flipResult.innerText = `IMPRESSIVE! You looted ${winAmount.toLocaleString('en-US')}!`;
            flipResult.className = 'flip-win';
            
            // Play win sound
            initAudio();
            playTempleSound();
        } else {
            flipResult.innerText = "KNEEL DOWN! You are unworthy...";
            flipResult.className = 'flip-lose';
        }
        
        // Update Score UI
        scoreEl.innerText = score.toLocaleString('en-US');
        localStorage.setItem('siggy_score', score);
        
        // Enable Buttons
        btnHead.disabled = false;
        btnTail.disabled = false;
        betAmountInput.disabled = false;
        isFlipping = false;
    }, 3000);
}

btnHead.addEventListener('click', () => handleCoinFlip('head'));
btnTail.addEventListener('click', () => handleCoinFlip('tail'));

// --- Flappy Siggy Game Logic ---
const flappyArea = document.getElementById('flappy-game-area');
const bird = document.getElementById('flappy-bird');
const fScoreOverlay = document.getElementById('flappy-score-overlay');
const fStartMsg = document.getElementById('flappy-start-msg');

let fGameActive = false;
let fGameOver = false;
let fScore = 0;
let fAnimationId;

// Physics Config
const gravity = 0.3;
const jumpVelocity = -7;
const pipeSpeed = 3;
const pipeSpawnRate = 90; // Frames between pipe spawns
const pipeGap = 200;

// Game State
let birdY = window.innerHeight / 2 - 20; // Default center
let birdVelocity = 0;
let pipes = [];
let frames = 0;

function jump(e) {
    if (e) e.preventDefault();
    if (fGameOver) {
        resetFlappyGame();
        return;
    }
    
    if (!fGameActive) {
        startFlappyGame();
    }
    
    birdVelocity = jumpVelocity;
    
    // Play bell sound
    initAudio();
    playTempleSound();
}

function startFlappyGame() {
    if (fGameOver) return;
    fGameActive = true;
    fStartMsg.style.display = 'none';
    fScoreOverlay.innerText = "0";
    
    // Center bird initally based on container
    const rect = flappyArea.getBoundingClientRect();
    birdY = rect.height / 2 - 20;
    
    gameLoop();
}

function resetFlappyGame() {
    fGameActive = false;
    fGameOver = false;
    fScore = 0;
    birdVelocity = 0;
    frames = 0;
    pipes.forEach(p => p.topEl.remove() || p.bottomEl.remove());
    pipes = [];
    
    const rect = flappyArea.getBoundingClientRect();
    birdY = rect.height / 2 - 20;
    bird.style.top = `${birdY}px`;
    bird.style.transform = `rotate(0deg)`;
    
    fScoreOverlay.innerText = "0";
    fStartMsg.style.display = 'flex';
    fStartMsg.innerHTML = `
        <div class="bg-black/60 backdrop-blur-sm border border-[#D4AF37]/30 px-6 py-4 rounded-2xl text-center shadow-[0_0_20px_rgba(212,175,55,0.2)] animate-pulse">
            <h3 class="text-[#F3D06D] font-black tracking-widest text-xl uppercase">Tap to Fly</h3>
        </div>
    `;
}

function createPipe() {
    const rect = flappyArea.getBoundingClientRect();
    const areaHeight = rect.height;
    
    // Min height 50px for top/bottom pipes
    const minHeight = 50; 
    const maxTopPipeHeight = areaHeight - pipeGap - minHeight;
    const topHeight = Math.floor(Math.random() * (maxTopPipeHeight - minHeight + 1) + minHeight);
    
    const topEl = document.createElement('div');
    topEl.classList.add('flappy-pipe', 'top');
    topEl.style.height = `${topHeight}px`;
    topEl.style.left = `${rect.width}px`;
    
    const bottomEl = document.createElement('div');
    bottomEl.classList.add('flappy-pipe', 'bottom');
    bottomEl.style.height = `${areaHeight - topHeight - pipeGap}px`;
    bottomEl.style.left = `${rect.width}px`;
    
    flappyArea.appendChild(topEl);
    flappyArea.appendChild(bottomEl);
    
    pipes.push({
        x: rect.width,
        topEl,
        bottomEl,
        passed: false
    });
}

function gameOver() {
    fGameActive = false;
    fGameOver = true;
    cancelAnimationFrame(fAnimationId);
    fStartMsg.style.display = 'flex';
    fStartMsg.innerHTML = `
        <div class="bg-black/85 backdrop-blur-md border-2 border-[#f43f5e]/60 p-6 rounded-3xl text-center shadow-[0_0_40px_rgba(244,63,94,0.35)] flex flex-col items-center gap-1 animate-bounce mt-8 pointer-events-none scale-110">
            <span class="material-symbols-outlined text-[#f43f5e] text-[3.5rem] mb-1 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">skull</span>
            <h3 class="text-[#f43f5e] font-black tracking-[0.2em] text-2xl uppercase mt-[-8px] block">Game Over</h3>
            <p class="text-slate-200 text-sm font-bold tracking-wide mt-2">Prayers: <span class="text-[#F3D06D] text-lg ml-1">${fScore}</span></p>
            <div class="bg-[#f43f5e]/20 text-[#f43f5e] px-4 py-2 mt-4 rounded-xl text-[11px] uppercase tracking-widest font-black border border-[#f43f5e]/30">Tap to Retry</div>
        </div>
    `;
    
    // Add micro-vibration if supported
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([100, 50, 100]);
    }
}

function checkCollision(birdRect, pipeRect) {
    return (
        birdRect.left < pipeRect.right &&
        birdRect.right > pipeRect.left &&
        birdRect.top < pipeRect.bottom &&
        birdRect.bottom > pipeRect.top
    );
}

function gameLoop() {
    if (!fGameActive) return;
    
    const areaRect = flappyArea.getBoundingClientRect();
    const birdRect = bird.getBoundingClientRect();
    
    // Apply Physics
    birdVelocity += gravity;
    birdY += birdVelocity;
    bird.style.top = `${birdY}px`;
    
    // Rotation mapping (down = point down, up = point up)
    let rotation = Math.min(Math.max(birdVelocity * 4, -25), 90);
    bird.style.transform = `rotate(${rotation}deg)`;
    
    // Check floor/ceiling collision
    if (birdY <= 0 || birdY + birdRect.height >= areaRect.height) {
        gameOver();
        return;
    }
    
    // Manage Pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        let p = pipes[i];
        p.x -= pipeSpeed;
        p.topEl.style.left = `${p.x}px`;
        p.bottomEl.style.left = `${p.x}px`;
        
        // Pipe Collision
        const topPipeRect = p.topEl.getBoundingClientRect();
        const bottomPipeRect = p.bottomEl.getBoundingClientRect();
        
        if (checkCollision(birdRect, topPipeRect) || checkCollision(birdRect, bottomPipeRect)) {
            gameOver();
            return;
        }
        
        // Score updating
        if (!p.passed && p.x + 60 < 40 /* bird x pos */) {
            p.passed = true;
            fScore += 20 * getMultiplier();
            fScoreOverlay.innerText = fScore;
            
            // Increment global score array
            score += 20 * getMultiplier();
            scoreEl.innerText = score.toLocaleString('en-US');
            localStorage.setItem('siggy_score', score);
        }
        
        // Remove off-screen pipes
        if (p.x < -60) {
            p.topEl.remove();
            p.bottomEl.remove();
            pipes.splice(i, 1);
        }
    }
    
    // Spawn new pipes
    if (frames % pipeSpawnRate === 0) {
        createPipe();
    }
    
    frames++;
    fAnimationId = requestAnimationFrame(gameLoop);
}

// Attach event listeners for Flappy game
flappyArea.addEventListener('pointerdown', jump);

// Handle resizing resetting game state safely
window.addEventListener('resize', () => {
    if (document.getElementById('view-flappy').classList.contains('active') && !fGameActive) {
        resetFlappyGame();
    }
});

// --- Quiz Game Logic ---
const quizQuestions = [
    {
        q: "What does Ritual Network primarily focus on?",
        options: ["Decentralized AI computation", "Web3 gaming", "NFT marketplaces", "Decentralized storage"],
        a: 0
    },
    {
        q: "What is the name of Ritual's core product that connects AI to blockchains?",
        options: ["Mainnet", "Testnet", "Infernet", "Devnet"],
        a: 2
    },
    {
        q: "Which architecture does Ritual use to enable smart contracts to access ML models?",
        options: ["Centralized Servers", "AI Coprocessor", "ZK-Rollups", "Yield Farming"],
        a: 1
    },
    {
        q: "What happens when a Ritual Network query is complete?",
        options: ["Mints a meme token", "Deletes the blockchain", "Returns the result to the smart contract", "Powers off"],
        a: 2
    },
    {
        q: "What is the ultimate goal of Ritual Network?",
        options: ["To replace Ethereum", "To build an open AI infrastructure layer", "To create a global cryptocurrency", "To store images securely"],
        a: 1
    }
];

let currentQIdx = 0;
const qQuestionEl = document.getElementById('quiz-question');
const qOptionsEl = document.getElementById('quiz-options');
const qResultEl = document.getElementById('quiz-result');

function loadQuestion() {
    if (currentQIdx >= quizQuestions.length) {
        qQuestionEl.innerText = "Quiz Completed!";
        qOptionsEl.innerHTML = "";
        qResultEl.innerText = "You have answered all questions!";
        qResultEl.className = "flip-result flip-win";
        return;
    }
    
    qResultEl.innerText = "";
    qResultEl.className = "flip-result";
    const qData = quizQuestions[currentQIdx];
    qQuestionEl.innerText = qData.q;
    
    qOptionsEl.innerHTML = "";
    qData.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.classList.add('quiz-btn');
        btn.innerText = opt;
        btn.onclick = () => handleQuizAnswer(idx, btn);
        qOptionsEl.appendChild(btn);
    });
}

function handleQuizAnswer(idx, btnEl) {
    const qData = quizQuestions[currentQIdx];
    const buttons = qOptionsEl.querySelectorAll('.quiz-btn');
    buttons.forEach(b => b.disabled = true); // Disable all buttons
    
    if (idx === qData.a) {
        btnEl.classList.add('correct');
        // Add 1000 prayers
        score += 1000 * getMultiplier();
        scoreEl.innerText = score.toLocaleString('en-US');
        localStorage.setItem('siggy_score', score);
        
        qResultEl.innerText = "IMPRESSIVE! +1,000 Prayers!";
        qResultEl.className = "flip-result flip-win";
        
        setTimeout(() => {
            currentQIdx++;
            loadQuestion();
        }, 1500);
    } else {
        btnEl.classList.add('wrong');
        buttons[qData.a].classList.add('correct'); // Highlight actual correct
        qResultEl.innerText = "KNEEL DOWN! Try again.";
        qResultEl.className = "flip-result flip-lose";
        
        setTimeout(() => {
            loadQuestion(); // Reload same question so they can try again
        }, 1500);
    }
}

// Initialize quiz
loadQuestion();

// --- Confessional Game Logic ---
const confessInput = document.getElementById('confess-input');
const confessSendBtn = document.getElementById('confess-send-btn');
const chatHistory = document.getElementById('chat-history');

const priestResponses = ["It's fine.", "You are absolved.", "You are a sinner.", "You are forgiven."];
const confessImages = ["assets/confess1.png", "assets/confess2.png", "assets/confess3.png", "assets/confess4.png"];

function addChatMessage(sender, text, images = []) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-msg', sender);
    msgDiv.innerText = text;
    
    if (images.length > 0) {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('chat-images');
        images.forEach(src => {
            const imgEl = document.createElement('img');
            imgEl.src = src;
            imgContainer.appendChild(imgEl);
        });
        msgDiv.appendChild(imgContainer);
    }
    
    chatHistory.appendChild(msgDiv);
    // Scroll to bottom
    setTimeout(() => chatHistory.scrollTop = chatHistory.scrollHeight, 50);
}

function handleConfession() {
    const text = confessInput.value.trim();
    if (!text) return;
    
    if (score < 10000) {
        addChatMessage('system', "You need 10,000 Prayers to confess.");
        return;
    }
    
    // Deduct
    score -= 10000;
    scoreEl.innerText = score.toLocaleString('en-US');
    localStorage.setItem('siggy_score', score);
    
    // User message
    addChatMessage('user', text);
    confessInput.value = '';
    
    // Priest response
    setTimeout(() => {
        const randomResp = priestResponses[Math.floor(Math.random() * priestResponses.length)];
        
        // Pick 1 random image out of 4
        const shuffled = [...confessImages].sort(() => 0.5 - Math.random());
        const selectedImages = shuffled.slice(0, 1);
        
        addChatMessage('priest', randomResp, selectedImages);
        
        // Play sound for divine intervention
        initAudio();
        playTempleSound();
    }, 1000);
}

confessSendBtn.addEventListener('click', handleConfession);
confessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleConfession();
});

// --- Telegram Bot Sync Logic (Option A: sendData) ---
const tgSubmitContainer = document.getElementById('tg-submit-container');
const tgSubmitBtn = document.getElementById('tg-submit-btn');

// Initialize Telegram WebApp
let tg = null;
if (window.Telegram && window.Telegram.WebApp) {
    tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    
    // Set theme colors
    tg.setHeaderColor('#0B1218');
    tg.setBackgroundColor('#000000');

    // Show submit button only if in Telegram
    if (tgSubmitContainer) {
        tgSubmitContainer.classList.remove('hidden');
    }
}

function syncScoreToTelegram(force = false) {
    if (!tg) return;
    
    // Use sendData for Option A
    const message = `SiggyScore: ${score}`;
    
    try {
        tg.sendData(message);
        console.log("Score sent via sendData!");
    } catch (error) {
        console.error("Failed to send data via Telegram:", error);
    }
}

if (tgSubmitBtn) {
    tgSubmitBtn.addEventListener('click', () => {
        syncScoreToTelegram(true);
    });
}
