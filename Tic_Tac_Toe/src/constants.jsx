export const Player = {
  X: <img src="src\assets\X_01.webp" alt="X"/>,
  O: <img src="src\assets\O_01.webp" alt="O"/>
};

export const WinningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];