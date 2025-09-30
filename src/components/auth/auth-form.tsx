import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
  onAuth: (user: { username: string; role: "player" | "admin" }) => void;
}

const AuthForm = ({ onAuth }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { toast } = useToast();

  const validateUsername = (username: string): boolean => {
    // At least 5 characters with both upper and lower case
    return username.length >= 5 && /[a-z]/.test(username) && /[A-Z]/.test(username);
  };

  const validatePassword = (password: string): boolean => {
    // At least 5 chars, include alpha, numeric and one special from {$, %, *, +, @}
    return password.length >= 5 && 
           /[a-zA-Z]/.test(password) && 
           /[0-9]/.test(password) && 
           /[$%*+@]/.test(password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin) {
      if (!validateUsername(formData.username)) {
        toast({
          title: "Invalid Username",
          description: "Username must be at least 5 characters with both upper and lower case letters",
          variant: "destructive",
        });
        return;
      }

      if (!validatePassword(formData.password)) {
        toast({
          title: "Invalid Password",
          description: "Password must be at least 5 characters with letters, numbers, and one of: $ % * + @",
          variant: "destructive",
        });
        return;
      }
    }

    // In a real app, this would make an API call
    // For demo purposes, admin users have "admin" in their username
    const role = formData.username.toLowerCase().includes("admin") ? "admin" : "player";
    
    toast({
      title: isLogin ? "Welcome back!" : "Account created!",
      description: `Logged in as ${formData.username}`,
    });

    onAuth({ username: formData.username, role });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-wide">WORDLE</CardTitle>
          <CardDescription>
            {isLogin ? "Welcome back! Please sign in." : "Create your account to start playing."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                required
              />
              {!isLogin && (
                <p className="text-xs text-muted-foreground">
                  At least 5 characters with both upper and lower case letters
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
              {!isLogin && (
                <p className="text-xs text-muted-foreground">
                  At least 5 characters with letters, numbers, and one of: $ % * + @
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </div>

          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              Demo: Use "admin" in username for admin access
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { AuthForm };