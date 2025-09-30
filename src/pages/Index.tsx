import { useState } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { GameContainer } from "@/components/game/game-container";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  username: string;
  role: "player" | "admin";
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showGame, setShowGame] = useState(false);

  const handleAuth = (userData: User) => {
    setUser(userData);
    if (userData.role === "player") {
      setShowGame(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setShowGame(false);
  };

  const handleGameEnd = () => {
    // In a real app, this would save game results to the database
    console.log("Game ended");
  };

  if (!user) {
    return <AuthForm onAuth={handleAuth} />;
  }

  if (user.role === "admin") {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (showGame) {
    return (
      <div>
        <div className="fixed top-4 right-4 z-10">
          <Button onClick={handleLogout} variant="outline" size="sm">
            Logout
          </Button>
        </div>
        <GameContainer onGameEnd={handleGameEnd} />
      </div>
    );
  }

  // Player dashboard
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-wide">WORDLE</h1>
            <p className="text-muted-foreground">Welcome, {user.username}!</p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Ready to Play?</CardTitle>
            <CardDescription>
              You can play up to 3 games per day
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Games played today: <span className="font-semibold">0/3</span>
              </p>
              <Button onClick={() => setShowGame(true)} className="w-full">
                Start New Game
              </Button>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">How to Play:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Guess the 5-letter word in 6 tries</li>
                <li>• Green = correct letter, correct position</li>
                <li>• Yellow = correct letter, wrong position</li>
                <li>• Grey = letter not in word</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
