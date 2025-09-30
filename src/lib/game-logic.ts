export type LetterState = "correct" | "present" | "absent";
export type GameStatus = "playing" | "won" | "lost";

export interface GameState {
  id: string;
  targetWord: string;
  guesses: Array<{
    word: string;
    result: LetterState[];
  }>;
  currentGuess: string;
  status: GameStatus;
  maxGuesses: number;
  startTime: Date;
  endTime?: Date;
}

// Sample word list - in a real app this would come from the backend
const WORD_LIST = [
  "REACT", "TOWER", "MUSIC", "WORLD", "HAPPY", "DANCE", "LIGHT", "SPACE", "MAGIC", "DREAM",
  "OCEAN", "SMILE", "PEACE", "BRAVE", "FOCUS", "LEARN", "TRUST", "POWER", "GRACE", "HEART",
  "SHINE", "BLOOM", "FRESH", "NOBLE", "SWIFT", "CLEAR", "SMART", "FLAME", "VOICE", "QUIET"
];

export function evaluateGuess(target: string, guess: string): LetterState[] {
  const result: LetterState[] = Array(5).fill("absent");
  const targetChars = target.split("");
  const guessChars = guess.split("");

  // First pass: mark correct letters (green)
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === targetChars[i]) {
      result[i] = "correct";
      targetChars[i] = ""; // Mark as used
    }
  }

  // Second pass: mark present letters (yellow)
  for (let i = 0; i < 5; i++) {
    if (result[i] === "absent") {
      const targetIndex = targetChars.indexOf(guessChars[i]);
      if (targetIndex !== -1) {
        result[i] = "present";
        targetChars[targetIndex] = ""; // Mark as used
      }
    }
  }

  return result;
}

export function getRandomWord(): string {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
}

export function isValidWord(word: string): boolean {
  // In a real app, this would check against a dictionary API
  return word.length === 5 && /^[A-Z]+$/.test(word);
}

export function createNewGame(id: string = crypto.randomUUID()): GameState {
  return {
    id,
    targetWord: getRandomWord(),
    guesses: [],
    currentGuess: "",
    status: "playing",
    maxGuesses: 5,
    startTime: new Date(),
  };
}

export function makeGuess(gameState: GameState, guess: string): GameState {
  if (gameState.status !== "playing" || guess.length !== 5) {
    return gameState;
  }

  const result = evaluateGuess(gameState.targetWord, guess);
  const newGuesses = [...gameState.guesses, { word: guess, result }];
  
  let status: GameStatus = "playing";
  let endTime: Date | undefined;

  // Check if won
  if (result.every(state => state === "correct")) {
    status = "won";
    endTime = new Date();
  }
  // Check if lost (used all guesses)
  else if (newGuesses.length >= gameState.maxGuesses) {
    status = "lost";
    endTime = new Date();
  }

  return {
    ...gameState,
    guesses: newGuesses,
    currentGuess: "",
    status,
    endTime,
  };
}

export function updateCurrentGuess(gameState: GameState, currentGuess: string): GameState {
  if (gameState.status !== "playing") {
    return gameState;
  }

  return {
    ...gameState,
    currentGuess: currentGuess.toUpperCase().slice(0, 5),
  };
}

export function getUsedLetters(guesses: GameState["guesses"]): Record<string, LetterState> {
  const used: Record<string, LetterState> = {};

  guesses.forEach(guess => {
    guess.word.split("").forEach((letter, index) => {
      const state = guess.result[index];
      
      // Priority: correct > present > absent
      if (!used[letter] || 
          (used[letter] === "absent" && state !== "absent") ||
          (used[letter] === "present" && state === "correct")) {
        used[letter] = state;
      }
    });
  });

  return used;
}