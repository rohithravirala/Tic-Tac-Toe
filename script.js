document.addEventListener('DOMContentLoaded', () => {
            // Game state variables
            let board = ['', '', '', '', '', '', '', '', ''];
            let currentPlayer = 'X';
            let gameActive = true;
            let gameMode = 'pvp'; // 'pvp' or 'pvc'
            let difficulty = 'hard'; // 'easy' or 'hard'
            let soundEnabled = true;
            
            // Scores
            let scores = {
                X: 0,
                O: 0,
                draw: 0
            };
            
            // DOM elements
            const gameBoard = document.getElementById('gameBoard');
            const currentPlayerDisplay = document.getElementById('currentPlayer');
            const scoreXDisplay = document.getElementById('scoreX');
            const scoreODisplay = document.getElementById('scoreO');
            const scoreDrawDisplay = document.getElementById('scoreDraw');
            const winModal = document.getElementById('winModal');
            const winTitle = document.getElementById('winTitle');
            const winMessage = document.getElementById('winMessage');
            const winModalBtn = document.getElementById('winModalBtn');
            const pvpBtn = document.getElementById('pvpBtn');
            const pvcBtn = document.getElementById('pvcBtn');
            const easyBtn = document.getElementById('easyBtn');
            const hardBtn = document.getElementById('hardBtn');
            const difficultyContainer = document.getElementById('difficultyContainer');
            const newGameBtn = document.getElementById('newGameBtn');
            const resetScoreBtn = document.getElementById('resetScoreBtn');
            const soundToggle = document.getElementById('soundToggle');
            const soundStatus = document.getElementById('soundStatus');
            const clickSound = document.getElementById('clickSound');
            const winSound = document.getElementById('winSound');
            const drawSound = document.getElementById('drawSound');
            
            // Initialize game board
            function initializeBoard() {
                gameBoard.innerHTML = '';
                board = ['', '', '', '', '', '', '', '', ''];
                
                for (let i = 0; i < 9; i++) {
                    const tile = document.createElement('div');
                    tile.classList.add('game-tile');
                    tile.dataset.index = i;
                    tile.addEventListener('click', () => handleTileClick(i));
                    
                    const symbol = document.createElement('div');
                    symbol.classList.add(i % 2 === 0 ? 'x-symbol' : 'o-symbol');
                    symbol.id = `tile-${i}`;
                    
                    tile.appendChild(symbol);
                    gameBoard.appendChild(tile);
                }
                
                currentPlayer = 'X';
                updateCurrentPlayerDisplay();
                gameActive = true;
                
                // Remove any winning line animations
                document.querySelectorAll('.winning-line').forEach(el => {
                    el.classList.remove('winning-line');
                });
            }
            
            // Update current player display
            function updateCurrentPlayerDisplay() {
                currentPlayerDisplay.textContent = currentPlayer;
                if (currentPlayer === 'X') {
                    currentPlayerDisplay.className = 'text-3xl font-bold neon-blue';
                } else {
                    currentPlayerDisplay.className = 'text-3xl font-bold neon-pink';
                }
            }
            
            // Handle tile click
            function handleTileClick(index) {
                if (!gameActive || board[index] !== '') return;
                
                // Play click sound
                if (soundEnabled) {
                    clickSound.currentTime = 0;
                    clickSound.play();
                }
                
                // Make move for human player
                makeMove(index, currentPlayer);
                
                // Check for winner
                const winner = checkWinner();
                if (winner) {
                    gameActive = false;
                    announceWinner(winner);
                    return;
                }
                
                // Check for draw
                if (!board.includes('')) {
                    gameActive = false;
                    announceDraw();
                    return;
                }
                
                // Switch player
                currentPlayer = currentPlayer === 'X' ? 'O' : 'O';
                
                // If PvC and computer's turn, make computer move
                if (gameMode === 'pvc' && currentPlayer === 'O' && gameActive) {
                    setTimeout(() => {
                        const computerMove = getComputerMove();
                        makeMove(computerMove, 'O');
                        
                        const computerWinner = checkWinner();
                        if (computerWinner) {
                            gameActive = false;
                            announceWinner(computerWinner);
                            return;
                        }
                        
                        if (!board.includes('')) {
                            gameActive = false;
                            announceDraw();
                            return;
                        }
                        
                        currentPlayer = 'X';
                        updateCurrentPlayerDisplay();
                    }, 500);
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    updateCurrentPlayerDisplay();
                }
            }
            
            // Make a move on the board
            function makeMove(index, player) {
                board[index] = player;
                const tileSymbol = document.getElementById(`tile-${index}`);
                
                if (player === 'X') {
                    tileSymbol.textContent = '✖';
                    tileSymbol.classList.add('neon-blue');
                } else {
                    tileSymbol.textContent = '◯';
                    tileSymbol.classList.add('neon-pink');
                }
                
                // Add glow effect to the symbol
                tileSymbol.style.animation = 'fadeIn 0.5s forwards';
            }
            
            // Check for winner
            function checkWinner() {
                const winPatterns = [
                    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
                    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
                    [0, 4, 8], [2, 4, 6]             // diagonals
                ];
                
                for (const pattern of winPatterns) {
                    const [a, b, c] = pattern;
                    if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
                        // Highlight winning tiles
                        pattern.forEach(index => {
                            document.querySelector(`[data-index="${index}"]`).classList.add('winning-line');
                        });
                        
                        return board[a];
                    }
                }
                
                return null;
            }
            
            // Announce winner
            function announceWinner(winner) {
                // Play win sound
                if (soundEnabled) {
                    winSound.currentTime = 0;
                    winSound.play();
                }
                
                // Update scores
                scores[winner]++;
                updateScores();
                
                // Show win modal
                winTitle.textContent = `Player ${winner} Wins!`;
                winTitle.className = winner === 'X' ? 'text-3xl font-bold neon-blue' : 'text-3xl font-bold neon-pink';
                winMessage.textContent = winner === 'X' ? 'X marks the spot!' : 'O victorious!';
                winModal.classList.remove('hidden');
            }
            
            // Announce draw
            function announceDraw() {
                // Play draw sound
                if (soundEnabled) {
                    drawSound.currentTime = 0;
                    drawSound.play();
                }
                
                // Update scores
                scores.draw++;
                updateScores();
                
                // Show draw modal
                winTitle.textContent = "It's a Draw!";
                winTitle.className = 'text-3xl font-bold';
                winMessage.textContent = "The game ended in a tie. Try again!";
                winModal.classList.remove('hidden');
            }
            
            // Update score displays
            function updateScores() {
                scoreXDisplay.textContent = scores.X;
                scoreODisplay.textContent = scores.O;
                scoreDrawDisplay.textContent = scores.draw;
            }
            
            // Computer AI logic
            function getComputerMove() {
                // Easy mode - random move
                if (difficulty === 'easy') {
                    return getRandomMove();
                }
                
                // Hard mode - minimax algorithm
                return getBestMove();
            }
            
            // Get random available move
            function getRandomMove() {
                const availableMoves = [];
                for (let i = 0; i < board.length; i++) {
                    if (board[i] === '') {
                        availableMoves.push(i);
                    }
                }
                return availableMoves[Math.floor(Math.random() * availableMoves.length)];
            }
            
            // Minimax algorithm for smart AI
            function getBestMove() {
                // Check for immediate win
                for (let i = 0; i < board.length; i++) {
                    if (board[i] === '') {
                        board[i] = 'O';
                        if (checkWinner() === 'O') {
                            board[i] = '';
                            return i;
                        }
                        board[i] = '';
                    }
                }
                
                // Block immediate win for opponent
                for (let i = 0; i < board.length; i++) {
                    if (board[i] === '') {
                        board[i] = 'X';
                        if (checkWinner() === 'X') {
                            board[i] = '';
                            return i;
                        }
                        board[i] = '';
                    }
                }
                
                // Take center if available
                if (board[4] === '') {
                    return 4;
                }
                
                // Take a corner if available
                const corners = [0, 2, 6, 8];
                const availableCorners = corners.filter(i => board[i] === '');
                if (availableCorners.length > 0) {
                    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
                }
                
                // Take any available edge
                const edges = [1, 3, 5, 7];
                const availableEdges = edges.filter(i => board[i] === '');
                if (availableEdges.length > 0) {
                    return availableEdges[Math.floor(Math.random() * availableEdges.length)];
                }
                
                // Fallback to random move (shouldn't happen)
                return getRandomMove();
            }
            
            // Event listeners
            pvpBtn.addEventListener('click', () => {
                gameMode = 'pvp';
                difficultyContainer.classList.add('hidden');
                pvpBtn.classList.remove('btn-secondary');
                pvpBtn.classList.add('btn');
                pvcBtn.classList.remove('btn');
                pvcBtn.classList.add('btn-secondary');
                initializeBoard();
            });
            
            pvcBtn.addEventListener('click', () => {
                gameMode = 'pvc';
                difficultyContainer.classList.remove('hidden');
                pvcBtn.classList.remove('btn-secondary');
                pvcBtn.classList.add('btn');
                pvpBtn.classList.remove('btn');
                pvpBtn.classList.add('btn-secondary');
                initializeBoard();
            });
            
            easyBtn.addEventListener('click', () => {
                difficulty = 'easy';
                easyBtn.classList.remove('btn-secondary');
                easyBtn.classList.add('btn');
                hardBtn.classList.remove('btn');
                hardBtn.classList.add('btn-secondary');
            });
            
            hardBtn.addEventListener('click', () => {
                difficulty = 'hard';
                hardBtn.classList.remove('btn-secondary');
                hardBtn.classList.add('btn');
                easyBtn.classList.remove('btn');
                easyBtn.classList.add('btn-secondary');
            });
            
            newGameBtn.addEventListener('click', initializeBoard);
            
            resetScoreBtn.addEventListener('click', () => {
                scores = { X: 0, O: 0, draw: 0 };
                updateScores();
            });
            
            winModalBtn.addEventListener('click', () => {
                winModal.classList.add('hidden');
                initializeBoard();
            });
            
            soundToggle.addEventListener('change', (e) => {
                soundEnabled = e.target.checked;
                soundStatus.textContent = soundEnabled ? 'ON' : 'OFF';
            });
            
            // Initialize the game
            initializeBoard();
        });