document.addEventListener('DOMContentLoaded', () => {

    // --- Deklarasi Variabel ---
    const splashScreen = document.getElementById('welcome-splash');
    const startGameBtn = document.getElementById('start-game-btn');
    const gameListContainer = document.getElementById('game-list-container');
    const mainCta = document.getElementById('main-cta');
    const backToCtaBtn = document.getElementById('back-to-cta-btn');
    const settingsButton = document.getElementById('settings-button');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsModalBtn = document.getElementById('close-settings-modal');
    const toggleMusicBtn = document.getElementById('toggle-music-btn');
    const musicStatusEl = document.getElementById('music-status');
    const htmlEl = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const modal = document.getElementById('game-modal');
    const gamePlaceholder = document.getElementById('game-placeholder');
    const closeModalButton = document.querySelector('.close-button');
    const sideGif = document.getElementById('left-side-gif');
    const rightSideGif = document.getElementById('right-side-gif'); 
    const backgroundMusic = document.getElementById('background-music');
    const arenaMusic = document.getElementById('arena-music');
    const volumeSlider = document.getElementById('volume-slider');
    const clickSound = document.getElementById('click-sound');

    // --- 1. STATUS MUSIK GLOBAL (PENENTU UTAMA) ---
    // Default true (nyala). Jika user klik jeda, ini jadi false.
    let isMusicEnabled = true; 

    function playClick() {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.volume = 0.8;
            clickSound.play().catch(e => console.log('Click sound failed:', e));
        }
    }

    // --- 2. FUNGSI PENGATUR AUDIO PUSAT (LOGIKA BARU) ---
    // Fungsi ini dipanggil setiap kali pindah layar atau ubah setting
    function manageGlobalAudio() {
        const isArenaOpen = gameListContainer && gameListContainer.classList.contains('show-content');
        const isGameModalOpen = modal && modal.style.display === 'flex';

        // KONDISI 1: User mematikan musik lewat pengaturan
        if (!isMusicEnabled) {
            if (backgroundMusic) backgroundMusic.pause();
            if (arenaMusic) arenaMusic.pause();
            if (musicStatusEl) musicStatusEl.textContent = 'Dijeda';
            return; // STOP DI SINI. Jangan lanjut.
        }

        // KONDISI 2: User mengizinkan musik, tentukan musik mana yang main
        if (musicStatusEl) musicStatusEl.textContent = 'Diputar';

        if (isGameModalOpen) {
            // Sedang main game: Matikan BGM & Arena (fokus suara game)
            if (backgroundMusic) backgroundMusic.pause();
            if (arenaMusic) arenaMusic.pause();
        } 
        else if (isArenaOpen) {
            // Di daftar game: Mainkan Arena Music
            if (backgroundMusic) backgroundMusic.pause();
            if (arenaMusic && arenaMusic.paused) {
                arenaMusic.volume = (volumeSlider ? parseFloat(volumeSlider.value) / 100 : 0.5);
                arenaMusic.play().catch(e => console.log('Autoplay blocked'));
            }
        } 
        else {
            // Di Home: Mainkan Background Music
            if (arenaMusic) arenaMusic.pause();
            if (backgroundMusic && backgroundMusic.paused) {
                backgroundMusic.volume = (volumeSlider ? parseFloat(volumeSlider.value) / 100 : 0.5);
                backgroundMusic.play().catch(e => console.log('Autoplay blocked'));
            }
        }
    }

    function updateDateTime() {
        const dateEl = document.getElementById('date-display');
        const timeEl = document.getElementById('time-display');
        if (!dateEl || !timeEl) return;
        const now = new Date();
        const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        dateEl.textContent = now.toLocaleDateString('id-ID', dateOptions);
        timeEl.textContent = now.toLocaleTimeString('id-ID', timeOptions);
    }

    // Splash Screen Timeout
    setTimeout(() => {
        if (splashScreen) splashScreen.style.display = 'none';
        // Coba mainkan musik saat loading selesai (sesuai status default)
        manageGlobalAudio();
    }, 3000);

    // --- SETTINGS & MUSIK CONTROLS ---
    if (settingsButton) {
        settingsButton.addEventListener('click', () => {
            playClick();
            if (settingsModal) {
                settingsModal.style.display = 'flex';
                // Sinkronisasi status teks saat buka modal
                if (musicStatusEl) {
                    musicStatusEl.textContent = isMusicEnabled ? 'Diputar' : 'Dijeda';
                }
                // Sinkronisasi slider
                let currentActiveMusic = (!gameListContainer.classList.contains('hidden-content')) ? arenaMusic : backgroundMusic;
                if (volumeSlider && currentActiveMusic) {
                    volumeSlider.value = currentActiveMusic.volume * 100;
                }
            }
        });
    }

    if (closeSettingsModalBtn) {
        closeSettingsModalBtn.addEventListener('click', () => {
            playClick();
            if (settingsModal) settingsModal.style.display = 'none';
        });
    }

    // LOGIKA TOMBOL JEDA/PUTAR (DIPERBAIKI)
    if (toggleMusicBtn) {
        toggleMusicBtn.addEventListener('click', () => {
            playClick();
            // Balikkan status global
            isMusicEnabled = !isMusicEnabled;
            
            // Terapkan perubahan segera
            manageGlobalAudio();
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            const newVolume = parseFloat(volumeSlider.value) / 100;
            if (backgroundMusic) backgroundMusic.volume = newVolume;
            if (arenaMusic) arenaMusic.volume = newVolume;
        });
    }

    // --- NAVIGASI TOMBOL UTAMA ---
    if (startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            playClick();
            if (mainCta) mainCta.classList.add('hidden');
            if (sideGif) sideGif.style.display = 'none';
            if (rightSideGif) rightSideGif.style.display = 'none';

            if (gameListContainer) {
                gameListContainer.classList.remove('hidden-content');
                gameListContainer.classList.add('show-content');
            }
            if (backToCtaBtn) backToCtaBtn.classList.remove('hidden');

            // Panggil Manager Audio
            manageGlobalAudio();
        });
    }

    if (backToCtaBtn) {
        backToCtaBtn.addEventListener('click', () => {
            playClick();
            if (gameListContainer) {
                gameListContainer.classList.remove('show-content');
                gameListContainer.classList.add('hidden-content');
            }
            if (mainCta) mainCta.classList.remove('hidden');
            if (sideGif) sideGif.style.display = 'block';
            if (rightSideGif) rightSideGif.style.display = 'block';
            if (backToCtaBtn) backToCtaBtn.classList.add('hidden');

            // Panggil Manager Audio
            manageGlobalAudio();
        });
    }

    // --- THEME TOGGLE ---
    function applyTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        themeToggle.checked = (theme === 'light');
    }

    themeToggle.addEventListener('change', () => {
        playClick();
        const theme = themeToggle.checked ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
        applyTheme(theme);
    });
    applyTheme(localStorage.getItem('theme') || 'dark');

    // --- MODAL GAME LOGIC ---
    function openModal() {
        if (modal) modal.style.display = 'flex';
        // Saat modal game buka, manageAudio akan mematikan musik latar otomatis
        manageGlobalAudio();
    }

    function closeModal() {
        if (modal) modal.style.display = 'none';
        if (gamePlaceholder) gamePlaceholder.innerHTML = '';

        // Matikan suara internal game (seperti efek suara dalam game)
        document.querySelectorAll('audio').forEach(audioEl => {
            if (audioEl.id !== 'background-music' && audioEl.id !== 'arena-music' && audioEl.id !== 'click-sound') {
                audioEl.pause();
                audioEl.currentTime = 0;
            }
        });

        // Kembalikan musik sesuai halaman (Arena atau Home) via Manager
        manageGlobalAudio();
    }

    closeModalButton.addEventListener('click', () => {
        playClick();
        closeModal();
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            playClick();
            closeModal();
        }
    });

    // --- LOAD GAME HANDLER ---
    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', () => {
            playClick();
            const gameName = button.getAttribute('data-game');
            loadGame(gameName);
        });
    });

    function loadGame(gameName) {
        openModal(); // Ini akan memanggil manageGlobalAudio() -> mute BGM
        
        if (gamePlaceholder) gamePlaceholder.innerHTML = '';
        
        switch (gameName) {
            case 'tebak-angka': loadTebakAngka(); break;
            case 'tic-tac-toe': loadTicTacToe(); break;
            case 'batu-gunting-kertas': loadBatuGuntingKertas(); break;
            case 'ular-tangga': loadUlarTangga(); break;
            case 'tangkap-benda': loadTangkapBenda(); break;
            case 'cari-pasangan': loadCariPasangan(); break;
            case 'tebak-kata': loadTebakKata(); break;
            case 'snake-game': loadSnakeGame(); break;
            case 'quiz-umum': loadQuizUmum(); break;
            case 'cari-harta-karun': loadCariHartaKarun(); break;
            case 'maze-game': loadMazeGame(); break;
            case 'arcade-tenis': loadArcadeTenis(); break;
        }
    }

    // --- IMPLEMENTASI GAME (LOGIKA PERMAINAN TETAP SAMA) ---

    function loadTebakAngka() {
        gamePlaceholder.innerHTML = `
            <h2>Tebak Angka</h2>
            <p>Aku punya angka rahasia antara 1-100.</p>
            <input type="number" id="tebakanInput" placeholder="Tebakanmu?">
            <button id="tebakBtn" class="game-button">Tebak</button>
            <p id="game-status"></p>
        `;
        let angkaRahasia = Math.floor(Math.random() * 100) + 1;
        const tebakanInput = document.getElementById('tebakanInput');
        const tebakBtn = document.getElementById('tebakBtn');
        const status = document.getElementById('game-status');
        tebakBtn.addEventListener('click', () => {
            const tebakan = parseInt(tebakanInput.value);
            if (isNaN(tebakan)) status.textContent = 'Masukkan angka!';
            else if (tebakan < angkaRahasia) status.textContent = 'Terlalu RENDAH!';
            else if (tebakan > angkaRahasia) status.textContent = 'Terlalu TINGGI!';
            else {
                status.textContent = `🎉 Benar! Angkanya ${angkaRahasia}.`;
                tebakBtn.disabled = true;
            }
        });
    }

    function loadTicTacToe() {
        gamePlaceholder.innerHTML = `
            <h2>Tic-Tac-Toe</h2>
            <div id="tictactoe-setup">
                <label for="gameMode">Pilih Mode:</label>
                <select id="gameMode">
                    <option value="player">Pemain vs Pemain</option>
                    <option value="ai">Pemain vs Komputer</option>
                </select>
                <button id="startTicTacToeBtn" class="game-button">Mulai</button>
            </div>
            <div id="tictactoe-game" style="display: none;">
                <div class="tictactoe-board" id="board">
                    ${Array(9).fill().map((_, i) => `<div class="cell" data-index="${i}"></div>`).join('')}
                </div>
                <p id="game-status">Giliran Pemain X</p>
                <button id="restartBtn" class="game-button">Mulai Ulang</button>
            </div>
        `;
        const setupDiv = document.getElementById('tictactoe-setup');
        const gameDiv = document.getElementById('tictactoe-game');
        const startBtn = document.getElementById('startTicTacToeBtn');
        const gameModeSelect = document.getElementById('gameMode');
        const board = document.getElementById('board'); 
        const status = document.getElementById('game-status');
        const restartBtn = document.getElementById('restartBtn');
        const cells = document.querySelectorAll('#board .cell'); 
        
        let gameMode = 'player'; 
        let currentPlayer = 'X';
        let gameState = Array(9).fill(null);
        let gameActive = true;
        const winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8],[0, 3, 6], [1, 4, 7], [2, 5, 8],[0, 4, 8], [2, 4, 6]];

        startBtn.addEventListener('click', () => {
            gameMode = gameModeSelect.value;
            setupDiv.style.display = 'none';
            gameDiv.style.display = 'block';
            restartGame();
        });

        function handleCellClick(e) {
            const clickedCell = e.target.closest('.cell');
            if (!clickedCell) return;
            const clickedIndex = parseInt(clickedCell.dataset.index);
            if (gameState[clickedIndex] !== null || !gameActive) return;
            
            makeMove(clickedCell, clickedIndex, currentPlayer);
            if (checkResult()) return;
            
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            status.textContent = `Giliran Pemain ${currentPlayer}`;

            if (gameMode === 'ai' && currentPlayer === 'O' && gameActive) {
                board.style.pointerEvents = 'none'; 
                setTimeout(makeAIMove, 700); 
            }
        }
        
        function makeMove(cell, index, player) {
            gameState[index] = player;
            cell.textContent = player;
            cell.style.color = player === 'X' ? 'var(--highlight-color)' : 'var(--button-color)';
        }

        function makeAIMove() {
            board.style.pointerEvents = 'auto'; 
            const emptyCells = gameState.map((val, index) => val === null ? index : null).filter(val => val !== null);
            if (emptyCells.length === 0) return; 
            const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const cellToClick = board.querySelector(`.cell[data-index="${randomIndex}"]`);
            makeMove(cellToClick, randomIndex, 'O');
            if (checkResult()) return;
            currentPlayer = 'X';
            status.textContent = `Giliran Pemain ${currentPlayer}`;
        }

        function checkResult() {
            let roundWon = false;
            for (let i = 0; i < winConditions.length; i++) {
                const [a, b, c] = winConditions[i];
                if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                    roundWon = true;
                    [a, b, c].forEach(index => {
                        board.querySelector(`.cell[data-index="${index}"]`).style.backgroundColor = 'var(--highlight-color)';
                    });
                    break;
                }
            }
            if (roundWon) {
                status.textContent = `${currentPlayer === 'X' ? 'Pemain X' : (gameMode === 'ai' ? 'Komputer' : 'Pemain O')} Menang! 🎉`;
                gameActive = false;
                board.style.pointerEvents = 'none'; 
                return true;
            }
            if (!gameState.includes(null)) {
                status.textContent = 'Permainan Seri! 🤝';
                gameActive = false;
                board.style.pointerEvents = 'none'; 
                return true;
            }
            return false;
        }

        function restartGame() {
            gameState.fill(null);
            cells.forEach(cell => {
                cell.textContent = '';
                cell.style.color = 'var(--text-color)'; 
                cell.style.backgroundColor = 'var(--accent-color)'; 
            });
            currentPlayer = 'X';
            gameActive = true;
            board.style.pointerEvents = 'auto'; 
            status.textContent = `Giliran Pemain ${currentPlayer}`;
        }
        board.addEventListener('click', handleCellClick); 
        restartBtn.addEventListener('click', restartGame);
    }

    function loadBatuGuntingKertas() {
        gamePlaceholder.innerHTML = `
            <h2>Batu Gunting Kertas</h2>
            <p>Pilih jagoanmu!</p>
            <div class="bgk-choices">
                <button id="batu">✊</button>
                <button id="gunting">✌️</button>
                <button id="kertas">🖐️</button>
            </div>
            <div id="bgk-result">
                <p id="game-status">Kamu: ? vs Komputer: ?</p>
                <h3 id="winner-status"></h3>
            </div>
        `;
        const choices = ['batu', 'gunting', 'kertas'];
        const status = document.getElementById('game-status');
        const winnerStatus = document.getElementById('winner-status');
        const choiceButtons = document.querySelector('.bgk-choices');

        choiceButtons.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') return;
            const playerChoice = e.target.id;
            const computerChoice = choices[Math.floor(Math.random() * 3)];
            status.textContent = `Kamu: ${playerChoice} vs Komputer: ${computerChoice}`;
            if (playerChoice === computerChoice) winnerStatus.textContent = 'Seri! 🤝';
            else if ((playerChoice === 'batu' && computerChoice === 'gunting') ||
                (playerChoice === 'gunting' && computerChoice === 'kertas') ||
                (playerChoice === 'kertas' && computerChoice === 'batu')) {
                winnerStatus.textContent = 'Kamu Menang! 🎉';
            } else winnerStatus.textContent = 'Komputer Menang! 🤖';
        });
    }

    function loadUlarTangga() {
        gamePlaceholder.innerHTML = `
            <h2>Ular Tangga</h2>
            <div id="player-setup">
                <label for="numPlayers">Jumlah Pemain:</label>
                <select id="numPlayers"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>
                <button id="startSLBtn" class="game-button">Mulai Game</button>
            </div>
            <p id="current-player-status"></p>
            <p id="game-status">Posisi: -</p>
            <div id="dice-area" style="display:none;">
                <div id="dice" class="dice">?</div>
                <button id="rollDiceBtn" class="game-button">Gulirkan Dadu</button>
            </div>
            <p id="roll-display"></p>
            <div class="snake-ladder-game" style="display:none;"><div id="sl-board"></div></div>
        `;
        const boardEl = document.getElementById('sl-board');
        const setupDiv = document.getElementById('player-setup');
        const startBtn = document.getElementById('startSLBtn');
        const numPlayersSelect = document.getElementById('numPlayers');
        const diceArea = document.getElementById('dice-area');
        const rollDiceBtn = document.getElementById('rollDiceBtn');
        const statusEl = document.getElementById('game-status');
        const rollDisplayEl = document.getElementById('roll-display');
        const currentPlayerStatusEl = document.getElementById('current-player-status');

        let numPlayers = 2;
        let players = []; 
        let currentPlayerIndex = 0;
        let gameActive = false;
        const NUM_COLS = 25, NUM_ROWS = 4, TOTAL_CELLS = 100;
        const boardMap = { 4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 63: 81, 71: 91, 17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 };
        numPlayersSelect.value = '2';

        startBtn.addEventListener('click', () => {
            numPlayers = parseInt(numPlayersSelect.value);
            players = [];
            for (let i = 1; i <= numPlayers; i++) players.push({ id: i, position: 1, color: `p${i}`, won: false });
            currentPlayerIndex = 0;
            gameActive = true;
            setupDiv.style.display = 'none';
            diceArea.style.display = 'flex';
            boardEl.parentElement.style.display = 'flex';
            createBoard();
            updateGameStatus();
        });

        function createBoard() {
            let cellsHTML = '';
            for (let row = NUM_ROWS; row >= 1; row--) {
                const isOddRowFromTop = row % 2 !== 0; 
                const startCell = (row - 1) * NUM_COLS + 1;
                const endCell = row * NUM_COLS;
                if (isOddRowFromTop) { 
                    for (let i = startCell; i <= endCell; i++) cellsHTML += createCellHTML(i);
                } else { 
                    for (let i = endCell; i >= startCell; i--) cellsHTML += createCellHTML(i);
                }
            }
            boardEl.innerHTML = cellsHTML;
            updateTokenPosition(true); 
        }

        function createCellHTML(i) {
            let cellClass = '';
            let displayContent = `${i}`; 
            if (i === TOTAL_CELLS) { displayContent = '💰'; cellClass = 'cell-finish'; } 
            else if (boardMap[i]) {
                const target = boardMap[i];
                if (target > i) cellClass = 'cell-ladder'; else cellClass = 'cell-snake';
            }
            return `<div class="sl-cell ${cellClass}" data-number="${i}" data-players="0">${displayContent}</div>`;
        }

        function updateTokenPosition(isInitial = false) {
            const allCells = boardEl.querySelectorAll('.sl-cell');
            allCells.forEach(cell => {
                const cellNum = parseInt(cell.dataset.number);
                if (cellNum === TOTAL_CELLS) cell.innerHTML = '💰'; else cell.innerHTML = cellNum; 
                cell.dataset.players = 0;
            });
            players.filter(p => !p.won).forEach(player => {
                const targetCell = boardEl.querySelector(`[data-number="${player.position}"]`);
                if (targetCell) {
                    const token = document.createElement('div');
                    token.classList.add('player-token', player.color);
                    targetCell.appendChild(token);
                    targetCell.dataset.players = parseInt(targetCell.dataset.players) + 1;
                }
            });
            updateGameStatus();
        }

        function updateGameStatus() {
            const currentPlayer = players[currentPlayerIndex];
            currentPlayerStatusEl.innerHTML = `Giliran: <span style="color:var(--${currentPlayer.color}); font-weight:bold;">Pemain ${currentPlayer.id}</span>`;
            statusEl.textContent = players.map(p => `P${p.id}: ${p.position}${p.won ? ' (MENANG!)' : ''}`).join(' | ');
        }
        
        function checkBoard(newPos) {
            rollDisplayEl.style.color = 'var(--text-color)';
            if (boardMap[newPos]) {
                const target = boardMap[newPos];
                if (target > newPos) {
                    rollDisplayEl.style.color = 'var(--button-color)';
                    return `Selamat! Naik Tangga ke ${target}! 🪜`; 
                } else if (target < newPos) {
                    rollDisplayEl.style.color = 'var(--accent-color)';
                    return `Awas! Turun Ular ke ${target}! 🐍`; 
                }
            }
            return `Pindah ke ${newPos}.`;
        }

        function rollDice() {
            if (!gameActive || rollDiceBtn.disabled) return;
            const currentPlayer = players[currentPlayerIndex];
            if (currentPlayer.won) { nextTurn(); return; }

            rollDiceBtn.disabled = true;
            diceArea.querySelector('.dice').classList.add('dice-rolling');
            const rollAnimation = setInterval(() => { diceArea.querySelector('.dice').textContent = Math.floor(Math.random() * 6) + 1; }, 100);

            setTimeout(() => {
                clearInterval(rollAnimation);
                diceArea.querySelector('.dice').classList.remove('dice-rolling');
                const guliran = Math.floor(Math.random() * 6) + 1;
                diceArea.querySelector('.dice').textContent = guliran;
                let newPos = currentPlayer.position + guliran;

                if (newPos > TOTAL_CELLS) {
                    rollDisplayEl.textContent = `P${currentPlayer.id} Dadu: ${guliran}. Terlalu jauh! Tetap di ${currentPlayer.position}.`;
                    rollDiceBtn.disabled = false; nextTurn(); return;
                }
                
                rollDisplayEl.textContent = `P${currentPlayer.id} Dadu: ${guliran}. ${checkBoard(newPos)}`;
                currentPlayer.position = newPos;
                updateTokenPosition(); 

                setTimeout(() => {
                    if (boardMap[currentPlayer.position]) {
                        const originalPos = currentPlayer.position;
                        currentPlayer.position = boardMap[currentPlayer.position];
                        if (currentPlayer.position > originalPos) rollDisplayEl.textContent = `P${currentPlayer.id} Naik Tangga! Pindah ke ${currentPlayer.position}! 🟢`;
                        else rollDisplayEl.textContent = `P${currentPlayer.id} Turun Ular! ke ${currentPlayer.position}! 🔴`;
                        updateTokenPosition();
                    }

                    if (currentPlayer.position === TOTAL_CELLS) {
                        currentPlayer.won = true;
                        rollDisplayEl.textContent = `🎉 SELAMAT! P${currentPlayer.id} MENANG! 🎉`;
                        rollDisplayEl.style.color = 'var(--highlight-color)';
                        if (players.every(p => p.won)) {
                            rollDiceBtn.textContent = 'Game Selesai!';
                            rollDiceBtn.disabled = true;
                            gameActive = false;
                            return;
                        }
                    }
                    rollDiceBtn.disabled = false; nextTurn();
                }, 700);
            }, 1500); 
        }

        function nextTurn() {
            currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
            while (players[currentPlayerIndex].won && players.some(p => !p.won)) {
                currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
            }
            updateGameStatus();
        }
        rollDiceBtn.addEventListener('click', rollDice);
    }

    function loadTangkapBenda() {
        gamePlaceholder.innerHTML = `
            <h2>Tangkap Benda</h2>
            <p id="catch-status">Skor: 0 | Nyawa: 3</p>
            <div id="game-arena"><div id="paddle"></div></div>
            <p><button id="startCatchBtn" class="game-button">Mulai</button></p>
        `;
        const arena = document.getElementById('game-arena');
        const paddle = document.getElementById('paddle');
        const statusEl = document.getElementById('catch-status');
        const startBtn = document.getElementById('startCatchBtn');

        let score = 0, lives = 3, gameInterval, objectCreationInterval, gameRunning = false;
        const ARENA_WIDTH = 300, PADDLE_WIDTH = 60, PADDLE_HEIGHT = 10;
        const OBJECT_TYPES = [
            { name: 'kursi', type: 'good', symbol: '🪑', speedBase: 2.0 },
            { name: 'meja', type: 'good', symbol: '🍽️', speedBase: 1.5 },
            { name: 'koin', type: 'good', symbol: '🪙', speedBase: 2.5 },
            { name: 'kunci', type: 'good', symbol: '🔑', speedBase: 2.2 },  
            { name: 'bom', type: 'bad', symbol: '💣', speedBase: 3.0 },
            { name: 'bata', type: 'bad', symbol: '🧱', speedBase: 2.8},  
        ];
        
        let paddleX = (ARENA_WIDTH / 2) - (PADDLE_WIDTH / 2);
        paddle.style.width = `${PADDLE_WIDTH}px`; paddle.style.height = `${PADDLE_HEIGHT}px`; paddle.style.left = `${paddleX}px`;

        function updateStatus() { statusEl.textContent = `Skor: ${score} | Nyawa: ${lives}`; }
        function movePaddle(e) {
            if (!gameRunning) return;
            const mouseX = e.clientX;
            const arenaRect = arena.getBoundingClientRect();
            let newX = mouseX - arenaRect.left - (PADDLE_WIDTH / 2);
            if (newX < 0) newX = 0; if (newX > ARENA_WIDTH - PADDLE_WIDTH) newX = ARENA_WIDTH - PADDLE_WIDTH;
            paddleX = newX; paddle.style.left = `${paddleX}px`;
        }
        
        function createFallingObject() {
            const typeIndex = Math.floor(Math.random() * OBJECT_TYPES.length);
            const objData = OBJECT_TYPES[typeIndex];
            const obj = document.createElement('div');
            obj.classList.add('falling-object', `obj-${objData.name}`);
            obj.dataset.type = objData.type;
            obj.textContent = objData.symbol; 
            const startX = Math.random() * (ARENA_WIDTH - 30); 
            obj.style.left = `${startX}px`; obj.style.top = '0px';
            obj.speed = objData.speedBase + Math.random() * 0.5; 
            arena.appendChild(obj);
        }

        function updateGame() {
            if (!gameRunning) return;
            const fallingObjects = arena.querySelectorAll('.falling-object');
            fallingObjects.forEach(obj => {
                let currentY = parseFloat(obj.style.top);
                currentY += obj.speed; 
                obj.style.top = `${currentY}px`;

                if (currentY > arena.offsetHeight - PADDLE_HEIGHT - 30) { 
                    const objX = parseFloat(obj.style.left);
                    if (objX + 30 > paddleX && objX < paddleX + PADDLE_WIDTH) {
                        if (obj.dataset.type === 'bad') { endGame(true); return; }
                        score++; obj.remove();
                    } else if (currentY > arena.offsetHeight) {
                        if (obj.dataset.type === 'good') { lives--; if (lives <= 0) endGame(false); }
                        obj.remove();
                    }
                    updateStatus();
                }
            });
        }
        
        function startGame() {
            score = 0; lives = 3; gameRunning = true;
            startBtn.textContent = 'Game Sedang Berlangsung...'; startBtn.disabled = true;
            updateStatus();
            arena.querySelectorAll('.falling-object').forEach(obj => obj.remove());
            document.addEventListener('mousemove', movePaddle);
            gameInterval = setInterval(updateGame, 20); 
            objectCreationInterval = setInterval(createFallingObject, 800); 
        }
        
        function endGame(wasBomb) {
            gameRunning = false;
            clearInterval(gameInterval); clearInterval(objectCreationInterval);
            document.removeEventListener('mousemove', movePaddle);
            if (wasBomb) statusEl.textContent = `GAME OVER! Kena BOM! 💥 Skor Akhir: ${score}`;
            else statusEl.textContent = `GAME OVER! Nyawa Habis. Skor Akhir: ${score}`;
            startBtn.textContent = 'Main Lagi'; startBtn.disabled = false;
        }
        startBtn.addEventListener('click', startGame);
        updateStatus(); 
    }

    function loadCariPasangan() {
        gamePlaceholder.innerHTML = `
            <h2>Cari Pasangan</h2>
            <p id="match-status">Klik tombol Mulai untuk memulai game</p>
            <div id="match-board"></div>
            <button id="startMatchBtn" class="game-button">Mulai Game</button>
        `;
        const board = document.getElementById('match-board');
        const statusEl = document.getElementById('match-status');
        const startBtn = document.getElementById('startMatchBtn');
        const symbols = ['👾', '⭐', '🍎', '🧩', '🚀', '🔑', '💎', '👑']; 
        let gameCards = [], cardsFlipped = [], matchesFound = 0, lockBoard = false;
        const GRID_SIZE = 4; 

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        function setupGame() {
            gameCards = [...symbols, ...symbols]; shuffle(gameCards);
            board.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`; board.innerHTML = '';
            matchesFound = 0; cardsFlipped = []; lockBoard = false;
            gameCards.forEach((symbol, index) => {
                const card = document.createElement('div');
                card.classList.add('match-card', 'unmatched'); 
                card.dataset.symbol = symbol; card.dataset.index = index;
                card.innerHTML = `<span class="card-back">?</span><span class="card-front">${symbol}</span>`;
                card.addEventListener('click', flipCard); board.appendChild(card);
            });
            statusEl.textContent = `Pasangan ditemukan: 0/${symbols.length}`; startBtn.textContent = 'Mulai Ulang';
        }

        function flipCard() {
            if (lockBoard) return; if (this === cardsFlipped[0]) return; 
            this.classList.add('flipped'); cardsFlipped.push(this);
            if (cardsFlipped.length === 2) { lockBoard = true; checkForMatch(); }
        }

        function checkForMatch() {
            const [card1, card2] = cardsFlipped;
            const isMatch = card1.dataset.symbol === card2.dataset.symbol;
            if (isMatch) {
                card1.removeEventListener('click', flipCard); card2.removeEventListener('click', flipCard);
                card1.classList.remove('unmatched'); card2.classList.remove('unmatched');
                cardsFlipped = []; lockBoard = false; matchesFound++;
                statusEl.textContent = `Pasangan ditemukan: ${matchesFound}/${symbols.length}`;
                if (matchesFound === symbols.length) {
                    statusEl.textContent = `🎉 SELAMAT! Kamu berhasil menemukan semua pasangan! 🎉`;
                    startBtn.textContent = 'Main Lagi';
                }
            } else unflipCards();
        }

        function unflipCards() {
            setTimeout(() => {
                cardsFlipped.forEach(card => card.classList.remove('flipped'));
                cardsFlipped = []; lockBoard = false;
            }, 1000); 
        }
        startBtn.addEventListener('click', setupGame);
    }

    function loadTebakKata() {
        gamePlaceholder.innerHTML = `
            <h2>Tebak Kata</h2>
            <p id="hangman-status">Tebak kata, 6 kesalahan diperbolehkan.</p>
            <h3 id="hangman-timer">Waktu: 60</h3> <h3 id="word-display"></h3>
            <p id="guesses-left">Kesalahan Tersisa: 6</p>
            <div id="keyboard"></div>
            <p id="message"></p>
            <button id="restartHangmanBtn" class="game-button" style="display:none;">Mulai Ulang</button>
        `;
        const words = ['KODING', 'RETRO', 'JAVASCRIPT', 'ARCADE', 'KOMPUTER', 'PROGRAM', 'EMULATOR', 'HTML', 'WEBSITE'];
        let secretWord = '', guessedLetters = [], mistakes = 0;
        const maxMistakes = 6, initialTime = 60; 
        let gameActive = false, timerInterval;
        const timerEl = document.getElementById('hangman-timer');
        const wordDisplayEl = document.getElementById('word-display');
        const guessesLeftEl = document.getElementById('guesses-left');
        const keyboardEl = document.getElementById('keyboard');
        const messageEl = document.getElementById('message');
        const restartBtn = document.getElementById('restartHangmanBtn');

        function startTimer() { 
            clearInterval(timerInterval); 
            let timeLeft = initialTime;
            timerEl.textContent = `Waktu: ${timeLeft}`; timerEl.style.color = 'var(--text-color)';
            timerInterval = setInterval(() => {
                timeLeft--; timerEl.textContent = `Waktu: ${timeLeft}`;
                if (timeLeft <= 10) timerEl.style.color = 'var(--highlight-color)'; 
                if (timeLeft <= 0) { clearInterval(timerInterval); endGame(false, true); }
            }, 1000);
        }

        function setupGame() {
            secretWord = words[Math.floor(Math.random() * words.length)];
            guessedLetters = []; mistakes = 0; gameActive = true;
            messageEl.textContent = ''; restartBtn.style.display = 'none';
            updateDisplay(); createKeyboard(); startTimer(); 
        }

        function createKeyboard() {
            keyboardEl.innerHTML = '';
            for (let i = 65; i <= 90; i++) { 
                const letter = String.fromCharCode(i);
                const button = document.createElement('button');
                button.textContent = letter; button.classList.add('key-button');
                button.addEventListener('click', () => handleGuess(letter));
                keyboardEl.appendChild(button);
            }
        }

        function updateDisplay() {
            let displayedWord = ''; let wordGuessed = true;
            for (const letter of secretWord) {
                if (guessedLetters.includes(letter)) displayedWord += letter + ' ';
                else { displayedWord += '_ '; wordGuessed = false; }
            }
            wordDisplayEl.textContent = displayedWord.trim();
            guessesLeftEl.textContent = `Kesalahan Tersisa: ${maxMistakes - mistakes}`;
            if (wordGuessed && gameActive) endGame(true);
            else if (mistakes >= maxMistakes && gameActive) endGame(false);
        }

        function handleGuess(letter) {
            if (!gameActive || guessedLetters.includes(letter)) return;
            guessedLetters.push(letter);
            const button = Array.from(keyboardEl.children).find(btn => btn.textContent === letter);
            button.disabled = true;
            if (secretWord.includes(letter)) button.classList.add('correct');
            else { mistakes++; button.classList.add('incorrect'); }
            updateDisplay();
        }

        function endGame(win, timeout = false) { 
            gameActive = false; clearInterval(timerInterval); 
            Array.from(keyboardEl.children).forEach(btn => btn.disabled = true);
            restartBtn.style.display = 'block';
            if (timeout) messageEl.textContent = `⌛ WAKTU HABIS! Kata: ${secretWord}`;
            else if (win) messageEl.textContent = '🎉 SELAMAT! Kamu Menang! 🎉';
            else messageEl.textContent = `GAME OVER! Kata: ${secretWord}`;
        }
        restartBtn.addEventListener('click', setupGame); setupGame(); 
    }

    function loadSnakeGame() {
        gamePlaceholder.innerHTML = `
            <h2>Game Ular</h2>
            <div id="difficulty-controls">
                <p>Pilih Tingkat Kesulitan:</p>
                <button class="difficulty-btn" data-speed="200">MUDAH</button>
                <button class="difficulty-btn" data-speed="150">NORMAL</button>
                <button class="difficulty-btn" data-speed="100">SULIT</button>
            </div>
            <p id="snake-status">Skor: 0</p>
            <div id="snake-container" style="display:none;"><div id="snake-board"></div></div>
            <p id="message"></p>
            <button id="startSnakeBtn" class="game-button" style="display:none;">Mulai Game (Tekan Panah)</button>
        `;
        const boardEl = document.getElementById('snake-board');
        const statusEl = document.getElementById('snake-status');
        const messageEl = document.getElementById('message');
        const startBtn = document.getElementById('startSnakeBtn');
        const boardContainer = document.getElementById('snake-container');
        const difficultyControls = document.getElementById('difficulty-controls');

        const GRID_SIZE = 20; 
        let snake = [{x: 10, y: 10}]; let food = {x: 15, y: 15};    
        let dx = 0, dy = 0, score = 0, gameInterval, gameActive = false;
        let nextDx = 0, nextDy = 0, GAME_SPEED = 0, difficultySelected = false; 

        boardEl.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
        boardEl.style.gridTemplateRows = `repeat(${GRID_SIZE}, 1fr)`;

        difficultyControls.addEventListener('click', (e) => {
            const btn = e.target.closest('.difficulty-btn');
            if (!btn || gameActive) return; 
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            GAME_SPEED = parseInt(btn.dataset.speed); difficultySelected = true;
            startBtn.style.display = 'block'; 
            messageEl.textContent = `Kesulitan: ${btn.textContent} telah dipilih. Tekan "Mulai Game"!`;
            messageEl.style.color = 'var(--button-color)';
            updateStatus();
        });
      
        function drawBoard() {
             boardEl.innerHTML = '';
            for (let y = 0; y < GRID_SIZE; y++) {
                for (let x = 0; x < GRID_SIZE; x++) {
                    const cell = document.createElement('div');
                    cell.classList.add('snake-cell');
                    if (y % 2 === x % 2) cell.classList.add('cell-light'); 
                    cell.dataset.x = x; cell.dataset.y = y;
                    boardEl.appendChild(cell);
                }
            }
           snake.forEach((segment, index) => {
            const cell = boardEl.querySelector(`[data-x="${segment.x}"][data-y="${segment.y}"]`);
                if (cell) {
                    if (index === 0) { 
                        cell.classList.add('snake-head');
                        cell.querySelectorAll('.snake-eye').forEach(e => e.remove());
                        const eye1 = document.createElement('div'); eye1.classList.add('snake-eye', 'eye-left');
                        const eye2 = document.createElement('div'); eye2.classList.add('snake-eye', 'eye-right');
                        cell.appendChild(eye1); cell.appendChild(eye2);
                        if (dx === 1) cell.dataset.direction = 'right'; else if (dx === -1) cell.dataset.direction = 'left';
                        else if (dy === -1) cell.dataset.direction = 'up'; else if (dy === 1) cell.dataset.direction = 'down';
                    } else if (index === snake.length - 1) cell.classList.add('snake-tail');
                    else cell.classList.add('snake-body');
                }
            });
            const foodCell = boardEl.querySelector(`[data-x="${food.x}"][data-y="${food.y}"]`);
            if (foodCell) foodCell.classList.add('snake-food');
        }
        
        function updateStatus() { statusEl.textContent = `Skor: ${score}`; }
        
        function moveSnake() {
            if (!gameActive) return;
            dx = nextDx; dy = nextDy;
            const head = {x: snake[0].x + dx, y: snake[0].y + dy};
            if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) { endGame(false); return; }
            for (let i = 1; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) { endGame(false); return; }
            }
            snake.unshift(head);
            if (head.x === food.x && head.y === food.y) { score += 10; placeFood(); } 
            else snake.pop(); 
            drawBoard(); updateStatus();
        }

        function placeFood() {
            let newFood;
            do {
                newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
            } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)); 
            food = newFood;
        }

        function handleKeyPress(event) {
            if (!gameActive) return; 
            const keyPressed = event.key;
            if ((keyPressed === 'ArrowLeft' || keyPressed === 'a') && dx === 0) { nextDx = -1; nextDy = 0; } 
            else if ((keyPressed === 'ArrowRight' || keyPressed === 'd') && dx === 0) { nextDx = 1; nextDy = 0; } 
            else if ((keyPressed === 'ArrowUp' || keyPressed === 'w') && dy === 0) { nextDx = 0; nextDy = -1; } 
            else if ((keyPressed === 'ArrowDown' || keyPressed === 's') && dy === 0) { nextDx = 0; nextDy = 1; }
        }
        
        function startGame() {
            if (!difficultySelected || gameActive) {
                messageEl.textContent = '⚠️ Pilih tingkat kesulitan terlebih dahulu!';
                messageEl.style.color = 'var(--highlight-color)'; return; 
            }
            snake = [{x: 10, y: 10}]; dx = 1; dy = 0; nextDx = 1; nextDy = 0; score = 0; gameActive = true;
            boardContainer.style.display = 'block'; boardContainer.classList.remove('game-over'); 
            messageEl.textContent = 'Gunakan tombol panah untuk bergerak!'; messageEl.style.color = 'var(--text-color)';
            startBtn.style.display = 'none'; difficultyControls.style.display = 'none'; 
            placeFood(); drawBoard(); updateStatus();
            document.removeEventListener('keydown', handleKeyPress); document.addEventListener('keydown', handleKeyPress);
            clearInterval(gameInterval); gameInterval = setInterval(moveSnake, GAME_SPEED);
        }

        function endGame(win) {
            gameActive = false; clearInterval(gameInterval);
            document.removeEventListener('keydown', handleKeyPress); 
            messageEl.textContent = `GAME OVER! Skor Akhir: ${score}`; messageEl.style.color = 'var(--highlight-color)';
            startBtn.textContent = 'Main Lagi'; startBtn.style.display = 'block'; startBtn.disabled = false;
            difficultyControls.style.display = 'block'; 
            boardContainer.classList.add('game-over'); 
            difficultySelected = false; document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
        }
        startBtn.addEventListener('click', startGame); 
        updateStatus(); messageEl.textContent = 'Pilih tingkat kesulitan untuk mengaktifkan tombol "Mulai Game"!'; messageEl.style.color = 'var(--button-color)';
    }

    function loadQuizUmum() {
        gamePlaceholder.innerHTML = `
            <h2>Quiz Pengetahuan Umum</h2>
            <p id="quiz-status">Siap untuk memulai?</p>
            <div id="quiz-area" style="display:none;">
                <h3 id="question-text"></h3>
                <div id="answer-options" style="display:flex; flex-direction:column; gap:10px; margin-top:20px;"></div>
            </div>
            <button id="startQuizBtn" class="game-button">Mulai Quiz!</button>
            <p id="result-message" style="margin-top:20px; font-size:1.2em; color:var(--highlight-color);"></p>
        `;
        const quizArea = document.getElementById('quiz-area');
        const questionTextEl = document.getElementById('question-text');
        const optionsEl = document.getElementById('answer-options');
        const statusEl = document.getElementById('quiz-status');
        const startBtn = document.getElementById('startQuizBtn');
        const resultMessageEl = document.getElementById('result-message');
        const quizData = [
            { question: "Apa nama karakter tukang ledeng ikonik dari Nintendo?", options: ["Link", "Sonic", "Mario", "Pac-Man"], answer: "Mario" },
            { question: "Pada konsol mana game 'The Legend of Zelda' pertama kali dirilis?", options: ["Atari", "NES", "SNES", "Sega Genesis"], answer: "NES" },
            { question: "Organ mana yang mengeluarkan insulin?", options: ["Hati", "Pankreas", "Ginjal", "Jantung"], answer: "Pankreas" },
            { question: "Ibukota negara Indonesia adalah...", options: ["Kuala Lumpur", "Jakarta", "Bandung", "Surabaya"], answer: "Jakarta" },
            { question: "Siapa musuh utama Pac-Man yang berwarna merah?", options: ["Blinky", "Pinky", "Inky", "Clyde"], answer: "Blinky" },
            { question: "Berapa banyak bit yang dimiliki konsol Nintendo 64?", options: ["8 bit", "16 bit", "32 bit", "64 bit"], answer: "64 bit" },
            { question: "Siapa penulis dari teori relativitas?", options: ["Isaac Newton", "Galileo Galilei", "Albert Einstein", "Nikola Tesla"], answer: "Albert Einstein" },
            { question: "Gas yang paling banyak terdapat di atmosfer Bumi adalah?", options: ["Oksigen", "Hidrogen", "Nitrogen", "Karbon Dioksida"], answer: "Nitrogen" },
            { question: "Simbol kimia untuk emas adalah?", options: ["Ag", "Au", "Fe", "Cu"], answer: "Au" },
        ];
        let currentQuestionIndex = 0; let score = 0; let gameActive = false;

        function startQuiz() {
            currentQuestionIndex = 0; score = 0; gameActive = true;
            resultMessageEl.textContent = ''; startBtn.style.display = 'none';
            quizArea.style.display = 'flex'; quizArea.style.flexDirection = 'column'; 
            statusEl.textContent = `Soal: 1/${quizData.length}`; loadQuestion();
        }

        function loadQuestion() {
            if (currentQuestionIndex >= quizData.length) { endGame(); return; }
            const data = quizData[currentQuestionIndex];
            questionTextEl.textContent = data.question; optionsEl.innerHTML = '';
            data.options.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('game-button'); button.textContent = option;
                button.addEventListener('click', () => handleAnswer(option, data.answer));
                optionsEl.appendChild(button);
            });
        }

        function handleAnswer(selectedAnswer, correctAnswer) {
            if (!gameActive) return;
            Array.from(optionsEl.children).forEach(btn => btn.disabled = true);
            let isCorrect = selectedAnswer === correctAnswer;
            if (isCorrect) { score++; resultMessageEl.textContent = 'BENAR! 🎉'; resultMessageEl.style.color = 'var(--button-color)'; } 
            else { resultMessageEl.textContent = `SALAH! Jawaban: ${correctAnswer}`; resultMessageEl.style.color = 'var(--highlight-color)'; }
            Array.from(optionsEl.children).forEach(btn => {
                if (btn.textContent === correctAnswer) { btn.style.backgroundColor = 'var(--button-color)'; btn.style.color = 'var(--card-bg)'; }
            });
            setTimeout(() => {
                currentQuestionIndex++; statusEl.textContent = `Soal: ${Math.min(currentQuestionIndex + 1, quizData.length)}/${quizData.length}`;
                resultMessageEl.textContent = ''; loadQuestion();
            }, 1500); 
        }

        function endGame() {
            gameActive = false; quizArea.style.display = 'none';
            statusEl.textContent = `QUIZ SELESAI!`;
            resultMessageEl.textContent = `Skor Akhir: ${score} dari ${quizData.length} pertanyaan!`;
            if (score === quizData.length) resultMessageEl.textContent += ' Sempurna! 🏆';
            else if (score >= quizData.length / 2) resultMessageEl.textContent += ' Bagus! 👍';
            else resultMessageEl.textContent += ' Coba lagi! 🤔';
            startBtn.textContent = 'Main Lagi'; startBtn.style.display = 'block';
        }
        startBtn.addEventListener('click', startQuiz);
    }

    function loadCariHartaKarun() {
        gamePlaceholder.innerHTML = `
            <h2>Cari Harta Karun</h2>
            <p id="grid-status">Klik petak untuk memulai! Harta Karun: 5 | Ranjau: 3</p>
            <p id="score-display" class="game-score">Skor: 0</p>
            <div id="treasure-grid"></div>
            <button id="restartTreasureBtn" class="game-button hidden-content">Mulai Ulang</button>
        `;
        const GRID_SIZE = 5; const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
        const NUM_TREASURES = 5; const NUM_MINES = 3;
        const gridEl = document.getElementById('treasure-grid');
        const statusEl = document.getElementById('grid-status');
        const scoreDisplayEl = document.getElementById('score-display');
        const restartBtn = document.getElementById('restartTreasureBtn');
        let board = []; let treasuresFound = 0; let score = 0; let gameActive = true;

        function initializeBoard() {
            board = Array(TOTAL_CELLS).fill('empty');
            let positions = Array.from({length: TOTAL_CELLS}, (_, i) => i);
            for (let i = 0; i < NUM_MINES; i++) {
                const index = positions.splice(Math.floor(Math.random() * positions.length), 1)[0];
                board[index] = 'mine';
            }
            for (let i = 0; i < NUM_TREASURES; i++) {
                const index = positions.splice(Math.floor(Math.random() * positions.length), 1)[0];
                board[index] = 'treasure';
            }
            score = 0; treasuresFound = 0; scoreDisplayEl.textContent = 'Skor: 0';
        }

        function drawGrid() {
            gridEl.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
            gridEl.innerHTML = board.map((item, index) => 
                `<div class="treasure-cell closed" data-index="${index}" data-content="${item}"><span>?</span></div>`
            ).join('');
            gridEl.removeEventListener('click', handleCellClick);
            gridEl.addEventListener('click', handleCellClick);
        }

        function handleCellClick(e) {
            if (!gameActive) return;
            const cell = e.target.closest('.treasure-cell');
            if (!cell || cell.classList.contains('open')) return;
            cell.classList.remove('closed'); cell.classList.add('open');
            const index = parseInt(cell.dataset.index); const content = board[index];
            if (content === 'mine') {
                cell.textContent = '💣'; cell.style.backgroundColor = 'var(--highlight-color)';
                statusEl.textContent = 'GAME OVER! Kamu menginjak ranjau! 💥'; endGame(false);
            } else if (content === 'treasure') {
                cell.textContent = '💰'; cell.style.backgroundColor = 'var(--button-color)';
                treasuresFound++; score += 100; scoreDisplayEl.textContent = `Skor: ${score}`;
                statusEl.textContent = `Harta Karun: ${treasuresFound}/${NUM_TREASURES} | Lanjutkan!`;
                if (treasuresFound === NUM_TREASURES) {
                    statusEl.textContent = '🎉 SELAMAT! Kamu menemukan semua harta karun! 🎉'; endGame(true);
                }
            } else {
                cell.textContent = '🌿'; cell.style.backgroundColor = '#4CAF50'; score += 10; scoreDisplayEl.textContent = `Skor: ${score}`;
            }
        }

        function endGame(win) {
            gameActive = false; restartBtn.classList.remove('hidden-content');
            document.querySelectorAll('.treasure-cell').forEach(cell => {
                const content = cell.dataset.content;
                if (content === 'mine' && !cell.classList.contains('open')) {
                    cell.textContent = '💣'; cell.style.backgroundColor = 'var(--highlight-color)';
                }
                cell.style.cursor = 'default';
            });
        }

        function restartGame() {
            treasuresFound = 0; score = 0; gameActive = true;
            restartBtn.classList.add('hidden-content');
            statusEl.textContent = 'Klik petak untuk memulai! Harta Karun: 5 | Ranjau: 3';
            initializeBoard(); drawGrid();
        }
        restartBtn.addEventListener('click', restartGame); initializeBoard(); drawGrid();
    }

    function loadMazeGame() {
        gamePlaceholder.innerHTML = `
           <h2>Labirin</h2>
            <p id="maze-status">Gunakan tombol panah atau W-A-S-D untuk bergerak:</p>
            <div id="maze-container"><div id="maze-board"></div></div>
            <button id="startMazeBtn" class="game-button">Mulai Labirin</button>
        `;
        const boardEl = document.getElementById('maze-board');
        const statusEl = document.getElementById('maze-status');
        const startBtn = document.getElementById('startMazeBtn');
        const CELL_SIZE = 30, MAZE_SIZE = 10, MAZE_ROWS = MAZE_SIZE, MAZE_COLS = MAZE_SIZE;
        let MAZE = [], player = { x: 0, y: 0 }, gameActive = false;

        function generateMaze() {
            MAZE = Array.from({ length: MAZE_ROWS }, () => Array(MAZE_COLS).fill(0));
            const visited = Array.from({ length: MAZE_ROWS }, () => Array(MAZE_COLS).fill(false));
            const stack = [];
            let startX = 1; let startY = 1;
            stack.push([startX, startY]); visited[startY][startX] = true; MAZE[startY][startX] = 1; 
            const directions = [[0, -2], [0, 2], [-2, 0], [2, 0]]; 
            while (stack.length > 0) {
                const [cx, cy] = stack[stack.length - 1];
                let unvisitedNeighbors = [];
                for (const [dx, dy] of directions) {
                    const nx = cx + dx; const ny = cy + dy;
                    if (nx > 0 && nx < MAZE_COLS - 1 && ny > 0 && ny < MAZE_ROWS - 1 && !visited[ny][nx]) {
                        unvisitedNeighbors.push([nx, ny, cx + dx / 2, cy + dy / 2]); 
                    }
                }
                if (unvisitedNeighbors.length > 0) {
                    const [nx, ny, wallX, wallY] = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
                    MAZE[wallY][wallX] = 1; MAZE[ny][nx] = 1;
                    visited[ny][nx] = true; stack.push([nx, ny]);
                } else stack.pop();
            }
            MAZE[1][1] = 2;
            let finishX = MAZE_COLS - 2; let finishY = MAZE_ROWS - 2;
            while (MAZE[finishY][finishX] === 0 || (finishY === 1 && finishX === 1)) {
                 finishX--; if (finishX <= 1) { finishX = MAZE_COLS - 2; finishY--; }
                 if (finishY <= 1) return generateMaze();
            }
            MAZE[finishY][finishX] = 3;
            return [1, 1];
        }

        function findStart() {
            for (let y = 0; y < MAZE_ROWS; y++) {
                for (let x = 0; x < MAZE_COLS; x++) {
                    if (MAZE[y][x] === 2) { player.x = x; player.y = y; return; }
                }
            }
        }
        
        function drawMaze() {
            boardEl.classList.remove('maze-win'); 
            boardEl.style.width = `${MAZE_COLS * CELL_SIZE}px`; boardEl.style.height = `${MAZE_ROWS * CELL_SIZE}px`;
            boardEl.style.gridTemplateColumns = `repeat(${MAZE_COLS}, ${CELL_SIZE}px)`;
            boardEl.style.gridTemplateRows = `repeat(${MAZE_ROWS}, ${CELL_SIZE}px)`;
            boardEl.innerHTML = '';
            for (let y = 0; y < MAZE_ROWS; y++) {
                for (let x = 0; x < MAZE_COLS; x++) {
                    const cell = document.createElement('div'); cell.classList.add('maze-cell');
                    if (MAZE[y][x] === 0) cell.classList.add('maze-wall'); 
                    else if (MAZE[y][x] === 2) cell.classList.add('maze-start'); 
                    else if (MAZE[y][x] === 3) { cell.classList.add('maze-finish'); cell.textContent = '🏁'; } 
                    else cell.classList.add('maze-path'); 
                    if (player.x === x && player.y === y) { cell.classList.add('maze-player'); cell.textContent = '👾'; }
                    boardEl.appendChild(cell);
                }
            }
        }

        function handleKeyPress(e) {
            if (!gameActive) return;
            const key = e.key.toLowerCase();
            let newX = player.x, newY = player.y;
            if (key === 'arrowup' || key === 'w') newY--; else if (key === 'arrowdown' || key === 's') newY++;
            else if (key === 'arrowleft' || key === 'a') newX--; else if (key === 'arrowright' || key === 'd') newX++;
            if (newX < 0 || newX >= MAZE_COLS || newY < 0 || newY >= MAZE_ROWS) return; 
            const targetCell = MAZE[newY][newX];
            if (targetCell === 0) { statusEl.textContent = '❌ Dinding! Cari jalan lain.'; statusEl.style.color = 'var(--highlight-color)'; return; }
            statusEl.textContent = 'Bergerak: W/⬆️ (Atas), S/⬇️ (Bawah), A/⬅️ (Kiri), D/➡️ (Kanan)';
            statusEl.style.color = 'var(--text-color)';
            player.x = newX; player.y = newY; drawMaze();
            if (targetCell === 3) endGame(true);
        }
        
        function startGame() {
            gameActive = true; generateMaze(); findStart(); drawMaze();
            statusEl.textContent = 'Bergerak: W/⬆️ (Atas), S/⬇️ (Bawah), A/⬅️ (Kiri), D/➡️ (Kanan)';
            statusEl.style.color = 'var(--text-color)'; startBtn.textContent = 'Mulai Ulang';
            document.removeEventListener('keydown', handleKeyPress); document.addEventListener('keydown', handleKeyPress);
        }

        function endGame(win) {
            gameActive = false; document.removeEventListener('keydown', handleKeyPress);
            if (win) {
                statusEl.textContent = '🎉 SELAMAT! Kamu berhasil menemukan jalan keluar! 🎉';
                statusEl.style.color = 'var(--button-color)'; boardEl.classList.add('maze-win');
            } else { statusEl.textContent = 'Game Over. Coba lagi!'; statusEl.style.color = 'var(--highlight-color)'; }
            startBtn.textContent = 'Main Lagi';
        }
        startBtn.addEventListener('click', startGame); generateMaze(); findStart(); drawMaze(); 
    }

    function loadArcadeTenis() {
        gamePlaceholder.innerHTML = `
            <h2>Arcade Tenis</h2>
            <p id="tenis-status">Skor: Pemain 0 - 0 Komputer</p>
            <div id="tenis-arena">
                <div id="player-paddle" class="paddle"></div><div id="computer-paddle" class="paddle"></div><div id="game-ball"></div>
            </div>
            <p id="tenis-message"></p>
            <button id="startTenisBtn" class="game-button">Mulai Game</button>
        `;
        const arena = document.getElementById('tenis-arena');
        const playerPaddle = document.getElementById('player-paddle');
        const computerPaddle = document.getElementById('computer-paddle');
        const ball = document.getElementById('game-ball');
        const statusEl = document.getElementById('tenis-status');
        const messageEl = document.getElementById('tenis-message');
        const startBtn = document.getElementById('startTenisBtn');
        const ARENA_WIDTH = 300, ARENA_HEIGHT = 400, PADDLE_HEIGHT = 50, PADDLE_WIDTH = 10, BALL_SIZE = 10;
        let playerY = ARENA_HEIGHT / 2 - PADDLE_HEIGHT / 2, computerY = ARENA_HEIGHT / 2 - PADDLE_HEIGHT / 2;
        let ballX = ARENA_WIDTH / 2 - BALL_SIZE / 2, ballY = ARENA_HEIGHT / 2 - BALL_SIZE / 2;
        let ballDX = 2, ballDY = 2, gameInterval, gameActive = false;
        let playerScore = 0, computerScore = 0; const WIN_SCORE = 5;

        arena.style.width = `${ARENA_WIDTH}px`; arena.style.height = `${ARENA_HEIGHT}px`;
        [playerPaddle, computerPaddle].forEach(p => { p.style.width = `${PADDLE_WIDTH}px`; p.style.height = `${PADDLE_HEIGHT}px`; });
        ball.style.width = `${BALL_SIZE}px`; ball.style.height = `${BALL_SIZE}px`;
        playerPaddle.style.left = '5px'; computerPaddle.style.right = '5px';

        function updatePositions() {
            playerPaddle.style.top = `${playerY}px`; computerPaddle.style.top = `${computerY}px`;
            ball.style.left = `${ballX}px`; ball.style.top = `${ballY}px`;
        }

        function updateScore() {
            statusEl.textContent = `Skor: Pemain ${playerScore} - ${computerScore} Komputer`;
            if (playerScore >= WIN_SCORE || computerScore >= WIN_SCORE) endGame();
        }

        function moveBall() {
            ballX += ballDX; ballY += ballDY;
            if (ballY <= 0 || ballY >= ARENA_HEIGHT - BALL_SIZE) ballDY *= -1;
            if (ballX <= PADDLE_WIDTH + 5) {
                if (ballY + BALL_SIZE > playerY && ballY < playerY + PADDLE_HEIGHT) { ballDX *= -1; ballDX *= 1.05; } 
                else if (ballX < 0) { computerScore++; resetBall('kanan'); return; }
            }
            if (ballX >= ARENA_WIDTH - PADDLE_WIDTH - BALL_SIZE - 5) {
                if (ballY + BALL_SIZE > computerY && ballY < computerY + PADDLE_HEIGHT) { ballDX *= -1; ballDX *= 1.05; } 
                else if (ballX > ARENA_WIDTH - BALL_SIZE) { playerScore++; resetBall('kiri'); return; }
            }
            updatePositions();
        }

        function resetBall(arah) {
            clearInterval(gameInterval);
            ballX = ARENA_WIDTH / 2 - BALL_SIZE / 2; ballY = ARENA_HEIGHT / 2 - BALL_SIZE / 2;
            ballDX = (arah === 'kiri' ? 2 : -2); ballDY = Math.random() > 0.5 ? 2 : -2; 
            updateScore();
            if (gameActive) {
                 messageEl.textContent = 'Gol! Lanjut dalam 1 detik...';
                 setTimeout(() => { messageEl.textContent = ''; gameInterval = setInterval(updateGame, 20); }, 1000);
            }
        }

        function moveComputerPaddle() {
            const centerOfBall = ballY + BALL_SIZE / 2; const centerOfPaddle = computerY + PADDLE_HEIGHT / 2;
            if (centerOfBall < centerOfPaddle) computerY = Math.max(0, computerY - 2); 
            else if (centerOfBall > centerOfPaddle) computerY = Math.min(ARENA_HEIGHT - PADDLE_HEIGHT, computerY + 2); 
        }
        
        function movePlayerPaddle(e) {
            if (!gameActive) return;
            const arenaRect = arena.getBoundingClientRect(); const mouseY = e.clientY;
            let newY = mouseY - arenaRect.top - PADDLE_HEIGHT / 2;
            if (newY < 0) newY = 0; if (newY > ARENA_HEIGHT - PADDLE_HEIGHT) newY = ARENA_HEIGHT - PADDLE_HEIGHT;
            playerY = newY;
        }

        function updateGame() { if (!gameActive) return; moveBall(); moveComputerPaddle(); updatePositions(); }

        function startGame() {
            playerScore = 0; computerScore = 0; gameActive = true;
            startBtn.style.display = 'none'; messageEl.textContent = '';
            playerY = ARENA_HEIGHT / 2 - PADDLE_HEIGHT / 2; computerY = ARENA_HEIGHT / 2 - PADDLE_HEIGHT / 2;
            updateScore(); resetBall('kiri'); 
            document.addEventListener('mousemove', movePlayerPaddle);
        }

        function endGame() {
            gameActive = false; clearInterval(gameInterval); document.removeEventListener('mousemove', movePlayerPaddle);
            if (playerScore > computerScore) { messageEl.textContent = '🎉 KAMU MENANG! 🎉'; messageEl.style.color = 'var(--button-color)'; } 
            else { messageEl.textContent = 'GAME OVER! Komputer Menang. 🤖'; messageEl.style.color = 'var(--highlight-color)'; }
            startBtn.textContent = 'Main Lagi'; startBtn.style.display = 'block';
        }
        startBtn.addEventListener('click', startGame); updatePositions(); messageEl.textContent = `Capai skor ${WIN_SCORE} untuk menang!`;
    }
    
    setInterval(updateDateTime, 1000);
});