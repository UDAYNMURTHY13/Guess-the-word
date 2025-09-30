import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for admin reports
const mockDailyReport = {
  "2025-09-29": { usersPlayed: 145, correctGuesses: 89 },
  "2025-09-28": { usersPlayed: 132, correctGuesses: 76 },
  "2025-09-27": { usersPlayed: 156, correctGuesses: 94 },
};

const mockUserReport = {
  "john_doe": [
    { date: "2025-09-29", wordsTried: 2, correctGuesses: 1 },
    { date: "2025-09-28", wordsTried: 3, correctGuesses: 2 },
    { date: "2025-09-27", wordsTried: 1, correctGuesses: 0 },
  ],
  "jane_smith": [
    { date: "2025-09-29", wordsTried: 3, correctGuesses: 3 },
    { date: "2025-09-28", wordsTried: 2, correctGuesses: 1 },
  ],
};

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [selectedDate, setSelectedDate] = useState("2025-09-29");
  const [selectedUser, setSelectedUser] = useState("john_doe");

  const dailyReport = mockDailyReport[selectedDate as keyof typeof mockDailyReport];
  const userReport = mockUserReport[selectedUser as keyof typeof mockUserReport] || [];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-wide">WORDLE ADMIN</h1>
            <p className="text-muted-foreground">Game analytics and user reports</p>
          </div>
          <Button onClick={onLogout} variant="outline">
            Logout
          </Button>
        </div>

        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily Reports</TabsTrigger>
            <TabsTrigger value="user">User Reports</TabsTrigger>
            <TabsTrigger value="words">Word Management</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity Report</CardTitle>
                <CardDescription>View daily game statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Select Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-fit"
                  />
                </div>

                {dailyReport ? (
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Users Played</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary">
                          {dailyReport.usersPlayed}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Correct Guesses</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-wordle-correct">
                          {dailyReport.correctGuesses}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No data available for this date</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="user" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Performance Report</CardTitle>
                <CardDescription>View individual user statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user">Select User</Label>
                  <select
                    id="user"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-fit px-3 py-2 border border-input rounded-md"
                  >
                    <option value="john_doe">john_doe</option>
                    <option value="jane_smith">jane_smith</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {userReport.length > 0 ? (
                    userReport.map((report, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-center">
                            <div className="font-medium">{report.date}</div>
                            <div className="text-sm text-muted-foreground">
                              Words Tried: <span className="font-semibold">{report.wordsTried}</span> |
                              Correct: <span className="font-semibold text-wordle-correct">{report.correctGuesses}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No data available for this user</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="words" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Word Management</CardTitle>
                <CardDescription>Add and manage word database</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newWord">Add New Word</Label>
                  <div className="flex gap-2">
                    <Input
                      id="newWord"
                      placeholder="Enter 5-letter word"
                      maxLength={5}
                      className="uppercase"
                    />
                    <Button>Add Word</Button>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Current Word List</h3>
                  <div className="grid grid-cols-5 gap-2 text-sm">
                    {["REACT", "TOWER", "MUSIC", "WORLD", "HAPPY", "DANCE", "LIGHT", "SPACE", "MAGIC", "DREAM"].map((word) => (
                      <div key={word} className="p-2 bg-muted rounded text-center font-mono">
                        {word}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export { AdminDashboard };