import { useState, useCallback, useEffect } from "react";
import { GameBoard } from "./game-board";
import { Keyboard } from "./keyboard";
import { GameState, createNewGame, makeGuess, updateCurrentGuess, getUsedLetters, isValidWord } from "@/lib/game-logic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface GameContainerProps {
  onGameEnd?: (gameState: GameState) => void;
}

const GameContainer = ({ onGameEnd }: GameContainerProps) => {
  const [gameState, setGameState] = useState<GameState>(() => createNewGame());
  const { toast } = useToast();

  const handleKeyPress = useCallback((key: string) => {
    setGameState(prev => updateCurrentGuess(prev, prev.currentGuess + key));
  }, []);

  const handleBackspace = useCallback(() => {
    setGameState(prev => updateCurrentGuess(prev, prev.currentGuess.slice(0, -1)));
  }, []);

  const handleEnter = useCallback(() => {
    if (gameState.currentGuess.length !== 5) {
      toast({
        title: "Not enough letters",
        description: "Please enter a 5-letter word",
        variant: "destructive",
      });
      return;
    }

    if (!isValidWord(gameState.currentGuess)) {
      toast({
        title: "Invalid word",
        description: "Please enter a valid word",
        variant: "destructive",
      });
      return;
    }

    const newGameState = makeGuess(gameState, gameState.currentGuess);
    setGameState(newGameState);

    if (newGameState.status === "won") {
      toast({
        title: "Congratulations!",
        description: `You guessed the word in ${newGameState.guesses.length} tries!`,
      });
      onGameEnd?.(newGameState);
    } else if (newGameState.status === "lost") {
      toast({
        title: "Game Over",
        description: `The word was ${newGameState.targetWord}`,
        variant: "destructive",
      });
      onGameEnd?.(newGameState);
    }
  }, [gameState, toast, onGameEnd]);

  const handleNewGame = () => {
    setGameState(createNewGame());
  };

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState.status !== "playing") return;

      const key = event.key.toUpperCase();
      
      if (key === "ENTER") {
        handleEnter();
      } else if (key === "BACKSPACE") {
        handleBackspace();
      } else if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState.status, handleEnter, handleBackspace, handleKeyPress]);

  const usedLetters = getUsedLetters(gameState.guesses);
  const isGameOver = gameState.status !== "playing";

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-wide">WORDLE</CardTitle>
          <p className="text-muted-foreground">
            Guess {gameState.guesses.length}/{gameState.maxGuesses}
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <GameBoard
            guesses={gameState.guesses}
            currentGuess={gameState.currentGuess}
            maxGuesses={gameState.maxGuesses}
            isGameOver={isGameOver}
          />
          
          {isGameOver && (
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold mb-2">
                {gameState.status === "won" ? "🎉 You Won!" : "😞 Game Over"}
              </p>
              {gameState.status === "lost" && (
                <p className="text-muted-foreground mb-4">
                  The word was: <span className="font-bold">{gameState.targetWord}</span>
                </p>
              )}
              <Button onClick={handleNewGame} className="mb-4">
                Play Again
              </Button>
            </div>
          )}
          
          <Keyboard
            onKeyPress={handleKeyPress}
            onEnter={handleEnter}
            onBackspace={handleBackspace}
            usedLetters={usedLetters}
            disabled={isGameOver}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export { GameContainer };