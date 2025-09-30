import { LetterTile } from "@/components/ui/letter-tile";

export interface Guess {
  word: string;
  result: Array<"correct" | "present" | "absent">;
}

interface GameBoardProps {
  guesses: Guess[];
  currentGuess: string;
  maxGuesses: number;
  isGameOver: boolean;
}

const GameBoard = ({ guesses, currentGuess, maxGuesses, isGameOver }: GameBoardProps) => {
  const renderRow = (rowIndex: number) => {
    // If this row has a submitted guess
    if (rowIndex < guesses.length) {
      const guess = guesses[rowIndex];
      return (
        <div key={rowIndex} className="flex gap-1">
          {guess.word.split("").map((letter, colIndex) => (
            <LetterTile
              key={colIndex}
              letter={letter}
              state={guess.result[colIndex]}
              animation="flip"
            />
          ))}
        </div>
      );
    }
    
    // If this is the current guess row
    if (rowIndex === guesses.length && !isGameOver) {
      return (
        <div key={rowIndex} className="flex gap-1">
          {Array.from({ length: 5 }).map((_, colIndex) => (
            <LetterTile
              key={colIndex}
              letter={currentGuess[colIndex] || ""}
              state={currentGuess[colIndex] ? "filled" : "empty"}
            />
          ))}
        </div>
      );
    }
    
    // Empty row
    return (
      <div key={rowIndex} className="flex gap-1">
        {Array.from({ length: 5 }).map((_, colIndex) => (
          <LetterTile key={colIndex} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-1 p-4">
      {Array.from({ length: maxGuesses }).map((_, index) => renderRow(index))}
    </div>
  );
};

export { GameBoard };