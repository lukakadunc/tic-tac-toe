import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={()=> this.props.onClick(i)} 
      />
    )
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
  
class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history:[{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      player1: ['X','X'],
      player2: ['O','O'],
    }
  }

  handleClick(i, current){
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]){
      return
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(move){
    this.setState({
      stepNumber: move,
      xIsNext: (move % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];   
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    });

    let status;
    if(winner){
      let nameOfWinner = this.state.player1[1] === winner ? this.state.player1 : this.state.player2
      status = 'Winner: ' + nameOfWinner[0] + '(' + nameOfWinner[1] + ')';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? this.state.player1[0] : this.state.player2[0]);
    }

    return (
      <div className="game">
        <div className="userName">
          <label>
            Igralec 'X': 
            <input type="text" onChange={event => this.setState({player1: [event.target.value, 'X']})}></input>
          </label>
          <label>
            Igralec 'O': 
            <input type="text" onChange={event => this.setState({player2: [event.target.value, 'O']})}></input>
          </label>
        </div>

        <div className="holder">
          <div className="game-board">
            <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i, current)}
            />
          </div>

          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>  
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


// Helper functions

// Calculates winner for tic tac toe game.
function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
