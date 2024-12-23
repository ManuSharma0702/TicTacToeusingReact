
import './App.css';
import { useState } from "react";

function calculateWinner({currState}){
  
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
    if (currState[a] && currState[a] === currState[b] && currState[a] === currState[c]) {
      return [currState[a], a, b, c];
    }
  }
  return null;
  
}


function Square({value, onSquareclick, cellColor}){

  return (
    <button className="square" onClick={onSquareclick} style={{backgroundColor: cellColor}} >{value}</button>
  );
}

function Grid({history, setHistory, turn, setturn}){


  
  function handleClick(i){
    const currState = history[history.length - 1]
    
    if (calculateWinner({ currState }) || currState[i]) {
      return;
    }
    const tmparray = currState.slice();
    
    tmparray[i] = turn;
    setHistory([...history, tmparray]);
    setturn(turn === 'X' ? 'O' : 'X');
  }
 

  const currState = history[history.length - 1]
  //We calculate the winner outside handle click because the history is updated async so if we call calculate winner inside handle click it will always get the older copy of history
  let win, ind1, ind2, ind3;
  const colorArr = Array(9).fill('white');
  if (calculateWinner({currState}) !== null){
    [win, ind1, ind2, ind3] = calculateWinner({currState});
    for (let index = 0; index < colorArr.length; index++) {
      if (index === ind1 || index === ind2 || index === ind3){
        colorArr[index] = 'red';
      }
    }
  }
  else{
    win = null;
  }
  // const win = calculateWinner({currState});
  
  let stat;
  if (win) {
    stat = 'Winner: ' + win;
  } else {
    stat = 'Next player: ' + (turn);
  }

  //check for draw\
  if (!win){
  if (currState.every((element) =>{
    if (element !== null){
      return true
    }
    return false
  })){
    stat = 'Draw'
  }
  }

  //return
  return (
    <>
    <div className="status">{stat}</div>
      
    {/* <Square value={squares[0]} onSquareClick={handleClick(0)} /> */}
    {/* Here is why this doesn’t work. The handleClick(0) call will be a part of rendering the board component. Because handleClick(0) alters the state of the board component by calling setSquares, your entire board component will be re-rendered again. But this runs handleClick(0) again, leading to an infinite loop: */}
      
    

    <div className="row">
      
      <Square value={currState[0]} onSquareclick={() => { handleClick(0) }} cellColor = {colorArr[0]}/>
      <Square value={currState[1]} onSquareclick={() => { handleClick(1) }} cellColor = {colorArr[1]}/>
      <Square value={currState[2]} onSquareclick={() => { handleClick(2) }} cellColor = {colorArr[2]}/>

    </div>
    <div className="row">
      <Square value={currState[3]} onSquareclick={() => { handleClick(3) }} cellColor = {colorArr[3]}/>
      <Square value={currState[4]} onSquareclick={() => { handleClick(4) }} cellColor = {colorArr[4]}/>
      <Square value={currState[5]} onSquareclick={() => { handleClick(5) }} cellColor = {colorArr[5]}/>
    </div>
    <div className="row">
      <Square value={currState[6]} onSquareclick={() => { handleClick(6) }} cellColor = {colorArr[6]}/>
      <Square value={currState[7]} onSquareclick={() => { handleClick(7) }} cellColor = {colorArr[7]}/>
      <Square value={currState[8]} onSquareclick={() => { handleClick(8) }} cellColor = {colorArr[8]}/>
    </div>
    </>
  );
}



function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [turn, setturn] = useState('X');

  function jumpTo(move){
   
    setHistory(history.slice(0, move + 1))
    if (move % 2 !== 0){
      setturn('O');
    }
    else{
      setturn('X');
    }
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });


  return (
    <>
      <h1>Current Player: {turn}</h1>
      <div>
      <Grid history={history} setHistory={setHistory} turn={turn} setturn={setturn} />
      </div>
      <ul>
        {moves}
      </ul>

    </>
  );
}

export default App;
