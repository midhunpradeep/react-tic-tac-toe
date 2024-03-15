import { useState } from "react";

export default function TicTacToe() {
  const [moves, setMoves] = useState([]);
  const [movesToDisplay, setMovesToDisplay] = useState(0);
  const [players, setPlayers] = useState(["X", "O"]);
  const [scores, setScores] = useState(
    players.reduce((o, key) => {
      o[key] = 0;
      return o;
    }, {}),
  );

  const displayedMoves = moves.slice(0, movesToDisplay);
  const board = getBoardArray(players, displayedMoves);
  const winningCells = getWinningCells(board);
  const winner = winningCells === null ? null : board[winningCells[0]];

  function playMove(index) {
    if (winner !== null) {
      return;
    }
    if (displayedMoves.includes(index)) {
      return;
    }

    const newMoves = [...displayedMoves, index];

    setMoves(newMoves);
    setMovesToDisplay(newMoves.length);
  }

  function newGame() {
    setMoves([]);
    setMovesToDisplay(0);
    setPlayers(["X", "O"]);
    setScores({ X: 0, O: 0 });
  }

  function nextRound() {
    setMoves([]);
    setMovesToDisplay(0);
    setPlayers(players.reverse());

    const newScores = { ...scores };
    if (winner) {
      newScores[winner]++;
    }
    setScores(newScores);
  }

  const nextRoundButton = (
    <button
      disabled={winner === null && displayedMoves.length < 9}
      type="button"
      onClick={nextRound}
    >
      Next Round
    </button>
  );

  return (
    <div data-winner={winner} className="ttt-game">
      <Board
        board={board}
        winningCells={winningCells}
        playMoveCallback={playMove}
      />
      <Menu>
        <Status
          players={players}
          moves={displayedMoves}
          winner={winner}
          scores={scores}
        />
        <div>
          <button type="button" onClick={newGame}>
            New Game
          </button>
          {nextRoundButton}
        </div>
        <MoveList moves={moves} setMovesToDisplayCallback={setMovesToDisplay} />
      </Menu>
    </div>
  );
}

function Board({ board, winningCells, playMoveCallback }) {
  if (winningCells === null) {
    winningCells = [];
  }

  const cells = board.map((value, index) => {
    return (
      <li
        className="ttt-cell"
        onClick={() => playMoveCallback(index)}
        key={index + 1}
        data-value={value}
        data-winning-cell={winningCells.includes(index) ? true : null}
      >
        {value}
      </li>
    );
  });

  return <ol className="ttt-board">{cells}</ol>;
}

function Menu({ children }) {
  return <div className="ttt-menu">{children}</div>;
}

function Status({ players, moves, winner, scores }) {
  const turnItem =
    winner === null ? (
      <p className="ttt-status">Next player: {players[moves.length % 2]}</p>
    ) : (
      <p className="ttt-status">{winner} wins!</p>
    );

  const scoreItems = [];
  for (const scoresKey in scores) {
    let playerScore = scores[scoresKey];
    if (scoresKey === winner) {
      playerScore++;
    }
    scoreItems.push(
      <p>
        {scoresKey}: {playerScore}
      </p>,
    );
  }

  return (
    <div>
      {turnItem}
      {scoreItems}
    </div>
  );
}

function MoveList({ moves, setMovesToDisplayCallback }) {
  const moveItems = moves.map((value, index) => {
    return (
      <li onClick={() => setMovesToDisplayCallback(index + 1)} key={index + 1}>
        Go to move #{index + 1}
      </li>
    );
  });

  return (
    <ol className="ttt-moves">
      <li onClick={() => setMovesToDisplayCallback(0)}>Go to game start</li>
      {moveItems}
    </ol>
  );
}

function getBoardArray(players, moves) {
  const board = [];
  for (let i = 0; i < 9; i++) {
    board.push(null);
  }

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    board[move] = players[i % 2];
  }

  return board;
}

function getWinningCells(boardArray) {
  function flattenIndex(x, y) {
    return 3 * x + y;
  }
  function getItemAt(x, y) {
    return boardArray[flattenIndex(x, y)];
  }

  // Check rows
  for (let y = 0; y < 3; y++) {
    const firstItem = getItemAt(0, y);
    if (firstItem === null) continue;

    if (firstItem === getItemAt(1, y) && firstItem === getItemAt(2, y)) {
      return [flattenIndex(0, y), flattenIndex(1, y), flattenIndex(2, y)];
    }
  }

  // Check columns
  for (let x = 0; x < 3; x++) {
    const firstItem = getItemAt(x, 0);
    if (firstItem === null) continue;

    if (firstItem === getItemAt(x, 1) && firstItem === getItemAt(x, 2)) {
      return [flattenIndex(x, 0), flattenIndex(x, 1), flattenIndex(x, 2)];
    }
  }

  // Check diagonals
  const middleItem = getItemAt(1, 1);
  if (middleItem === null) return null;

  if (getItemAt(0, 0) === middleItem && getItemAt(2, 2) === middleItem) {
    return [flattenIndex(0, 0), flattenIndex(1, 1), flattenIndex(2, 2)];
  }
  if (getItemAt(2, 0) === middleItem && getItemAt(0, 2) === middleItem) {
    return [flattenIndex(2, 0), flattenIndex(1, 1), flattenIndex(0, 2)];
  }

  return null;
}
