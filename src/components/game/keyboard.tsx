import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  usedLetters: Record<string, "correct" | "present" | "absent">;
  disabled?: boolean;
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

const Keyboard = ({ onKeyPress, onEnter, onBackspace, usedLetters, disabled }: KeyboardProps) => {
  const getKeyState = (key: string) => {
    if (key === "ENTER" || key === "BACKSPACE") return "default";
    return usedLetters[key] || "default";
  };

  const getKeyVariant = (state: string) => {
    switch (state) {
      case "correct":
        return "default";
      case "present":
        return "secondary";
      case "absent":
        return "ghost";
      default:
        return "outline";
    }
  };

  const handleKeyClick = (key: string) => {
    if (disabled) return;
    
    if (key === "ENTER") {
      onEnter();
    } else if (key === "BACKSPACE") {
      onBackspace();
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1">
          {row.map((key) => {
            const state = getKeyState(key);
            const isSpecialKey = key === "ENTER" || key === "BACKSPACE";
            
            return (
              <Button
                key={key}
                variant={getKeyVariant(state)}
                size="sm"
                onClick={() => handleKeyClick(key)}
                disabled={disabled}
                className={cn(
                  "h-12 font-bold text-sm",
                  isSpecialKey ? "px-3" : "w-10",
                  state === "correct" && "bg-tile-correct border-tile-correct text-white hover:bg-tile-correct/90",
                  state === "present" && "bg-tile-present border-tile-present text-white hover:bg-tile-present/90",
                  state === "absent" && "bg-tile-absent border-tile-absent text-white hover:bg-tile-absent/90"
                )}
              >
                {key === "BACKSPACE" ? "⌫" : key}
              </Button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export { Keyboard };