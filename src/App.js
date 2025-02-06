import "./App.css";
import { useState, useEffect } from "react";

function isFull(board) {
  return board.every((cell) => cell !== null);
}

function calculateScore(currState) {
  const winner = calculateWinner(currState);
  if (winner !== null) {
    return winner[0] === "O" ? 10 : -10;
  }
  return 0;
}

function findBestMove(board) {
  let bestVal = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = "O";
      let moveVal = minmax(board, 0, false);
      board[i] = null;

      if (moveVal > bestVal) {
        bestVal = moveVal;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

function minmax(currState, depth, isMax) {
  let score = calculateScore(currState);
  if (score === 10 || score === -10) return score;
  if (isFull(currState)) return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < currState.length; i++) {
      if (currState[i] === null) {
        currState[i] = "O";
        best = Math.max(best, minmax(currState, depth + 1, false));
        currState[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < currState.length; i++) {
      if (currState[i] === null) {
        currState[i] = "X";
        best = Math.min(best, minmax(currState, depth + 1, true));
        currState[i] = null;
      }
    }
    return best;
  }
}

function calculateWinner(currState) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (currState[a] && currState[a] === currState[b] && currState[a] === currState[c]) {
      return [currState[a], a, b, c];
    }
  }
  return null;
}

function Square({ value, onClick, cellColor }) {
  return (
    <button className="square" onClick={onClick} style={{ backgroundColor: cellColor }}>
      {value}
    </button>
  );
}

function Grid({ history, setHistory, turn, setTurn, isAI }) {
  const currState = history[history.length - 1];
  const winnerInfo = calculateWinner(currState);
  let winner = null;
  let colorArr = Array(9).fill("white");

  if (winnerInfo) {
    [winner, colorArr[winnerInfo[1]], colorArr[winnerInfo[2]], colorArr[winnerInfo[3]]] = ["red", "red", "red", "red"];
  }

  function handleClick(i) {
    if (winner || currState[i]) return;

    const newBoard = currState.slice();
    newBoard[i] = turn;
    setHistory([...history, newBoard]);
    setTurn(turn === "X" ? "O" : "X");
  }

  // AI move
  useEffect(() => {
    if (isAI && turn === "O" && !winner) {
      const aiMove = findBestMove(currState);
      if (aiMove !== -1) {
        handleClick(aiMove);
      }
    }
  }, [turn, isAI]);

  let status = winner ? `Winner: ${winner}` : `Next player: ${turn}`;
  if (!winner && isFull(currState)) status = "Draw";

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {currState.map((cell, i) => (
          <Square key={i} value={cell} onClick={() => handleClick(i)} cellColor={colorArr[i]} />
        ))}
      </div>
    </>
  );
}

function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [turn, setTurn] = useState("X");
  const [isAI, setIsAI] = useState(false);

  function jumpTo(move) {
    setHistory(history.slice(0, move + 1));
    setTurn(move % 2 === 0 ? "X" : "O");
  }

  return (
    <>
      <label>
        <input type="checkbox" checked={isAI} onChange={(e) => setIsAI(e.target.checked)} /> AI?
      </label>
      <h1>Current Player: {turn}</h1>
      <Grid history={history} setHistory={setHistory} turn={turn} setTurn={setTurn} isAI={isAI} />
      <ul>
        {history.map((_, move) => (
          <li key={move}>
            <button onClick={() => jumpTo(move)}>
              {move > 0 ? `Go to move #${move}` : "Go to game start"}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
