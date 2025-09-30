import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const tileVariants = cva(
  "flex h-14 w-14 items-center justify-center border-2 font-bold text-lg uppercase transition-all duration-200 ease-in-out",
  {
    variants: {
      state: {
        empty: "bg-tile-empty border-tile-border-empty text-wordle-text",
        filled: "bg-tile-filled border-tile-border-filled text-wordle-text",
        correct: "bg-tile-correct border-tile-correct text-white",
        present: "bg-tile-present border-tile-present text-white",
        absent: "bg-tile-absent border-tile-absent text-white",
      },
    },
    defaultVariants: {
      state: "empty",
    },
  }
);

export interface LetterTileProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tileVariants> {
  letter?: string;
  state?: "empty" | "filled" | "correct" | "present" | "absent";
  animation?: "flip" | "bounce" | "shake" | null;
}

const LetterTile = ({
  className,
  state = "empty",
  letter = "",
  animation,
  ...props
}: LetterTileProps) => {
  const animationClass = animation ? `${animation}-animation` : "";
  
  return (
    <div
      className={cn(tileVariants({ state }), animationClass, className)}
      {...props}
    >
      {letter}
    </div>
  );
};

export { LetterTile, tileVariants };