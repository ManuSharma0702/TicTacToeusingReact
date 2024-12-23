
import './App.css';
import { useState } from "react";

function calculateWinner({history}){
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (history[a] && history[a] === history[b] && history[a] === history[c]) {
      return history[a];
    }
  }
  return null;
  
}


function Square({value, onSquareclick}){
  return (
    <button className="square" onClick={onSquareclick}>{value}</button>
  );
}

function Grid({history, setHistory, turn, setturn, winner, setwinner}){
  function handleClick(i){
    
    if (calculateWinner({history}) || history[i]) {
      return;
    }
    const tmparray = history.slice();
   
    tmparray[i] = turn;
    setHistory(tmparray);
    setturn(turn === 'X' ? 'O' : 'X');
  }
  //We calculate the winner outside handle click because the history is updated async so if we call calculate winner inside handle click it will always get the older copy of history
  const win = calculateWinner({history});
  let stat;
  if (win) {
    stat = 'Winner: ' + win;
  } else {
    stat = 'Next player: ' + (turn);
  }

  //check for draw
  if (history.every((element) =>{
    if (element !== null){
      return true
    }
    return false
  })){
    stat = 'Draw'
  }
  return (
    <>
    <div className="status">{stat}</div>
    <div className="row">
      <Square value={history[0]} onSquareclick={() => { handleClick(0) }} />
      <Square value={history[1]} onSquareclick={() => { handleClick(1) }}/>
      <Square value={history[2]} onSquareclick={() => { handleClick(2) }}/>

    </div>
    <div className="row">
      <Square value={history[3]} onSquareclick={() => { handleClick(3) }}/>
      <Square value={history[4]} onSquareclick={() => { handleClick(4) }}/>
      <Square value={history[5]} onSquareclick={() => { handleClick(5) }}/>
    </div>
    <div className="row">
      <Square value={history[6]} onSquareclick={() => { handleClick(6) }}/>
      <Square value={history[7]} onSquareclick={() => { handleClick(7) }}/>
      <Square value={history[8]} onSquareclick={() => { handleClick(8) }}/>
    </div>
    </>
  );
}


function App() {
  const [history, setHistory] = useState(Array(9).fill(null));
  const [turn, setturn] = useState('X');
  
  return (
    <>
      <h1>Current Player: {turn}</h1>

      <Grid history={history} setHistory={setHistory} turn={turn} setturn={setturn} />


    </>
  );
}

export default App;
