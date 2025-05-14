import { TbReload } from "react-icons/tb";
import { Player, WinningCombinations} from "./constants";
import { useState, useRef } from "react";
import {motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

const Square = ({ children, updateBoard, index }) => {
  
  const handleClick = () => {
    updateBoard(index);
  }

  const ROTATION_RANGE = 25;
  const HALF_ROTATION_RANGE = 25 / 2;

  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return [0, 0];

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      onClick={handleClick}>
      <div 
      className="border-cyan-100 border-1 rounded-2xl shadow-[inset_0px_0px_40px_10px_#ebf4ff] w-45 h-45 grid place-items-center text-5xl"
      style={{
        transform: "translateZ(10px)",
        transformStyle: "preserve-3d",
      }}>
      {children}
      </div>
    </motion.div>
  )
}

function App() {
  
  const [board, setBoard] = useState(Array(9).fill(null))

  const [currentPlayer, setCurrentPlayer] = useState(Player.X)

  const [winner, setWinner] = useState(null)

  const [turn, setTurn] = useState(0)

  const checkWinner = (boardCheck) => {
    for (const combo of WinningCombinations) {
      const [a, b, c] = combo
      if (
        boardCheck[a] &&
        boardCheck[a] === boardCheck[b] &&
        boardCheck[a] === boardCheck[c]
      )
      {
        return boardCheck[a]
      }
    }
    return null
  }

  const updateBoard = (index) => { 

    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    const newPlayer = currentPlayer === Player.X ? Player.O : Player.X
    setCurrentPlayer(newPlayer)

    setTurn(turn + 1)

    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      setWinner(newWinner)
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer(Player.X)
    setWinner(null)
    setTurn(0)
  }

  return (

    <main className="bg-linear-to-bl from-cyan-400 to-green-300 h-svh flex flex-col">

      <h1 className='text-5xl text-cyan-100 grid place-items-center m-auto'>Tic Tac Toe</h1>

      <button onClick={resetGame} className="text-5xl h-[45px] text-cyan-100 grid place-items-center"><TbReload /></button>

      <section className="h-150 w-150 flex flex-wrap place-items-center gap-7 m-auto">

        {board.map((_, index) => {
          return(
            <Square 
              key={index} 
              index={index}
              updateBoard={updateBoard}
            >
              {board[index]}
            </Square>
          )
        })}

      </section>

      { turn<9 && !winner ? (

        <section className="grid place-items-center gap-7 mt-10 m-auto" >

          <h2 className="text-4xl text-cyan-100 grid place-items-center">Turn</h2>

          <Square>     
              <div>
                {currentPlayer}
              </div>          
          </Square>

        </section>
        

      ) : turn===9 && !winner ? (

        <section className="grid place-items-center gap-7 mt-10 m-auto" >

          <h2 className="text-4xl text-cyan-100 grid place-items-center">Empate</h2>

          <Square>     
          </Square>

        </section>

      ) : (

        <section className="grid place-items-center gap-7 mt-10 m-auto" >

          <h2 className="text-4xl text-cyan-100 grid place-items-center">Winner</h2>

          <Square>     
            <div>
              {winner}
            </div>          
          </Square>

        </section>

      )}

    </main>
  )
}

export default App;