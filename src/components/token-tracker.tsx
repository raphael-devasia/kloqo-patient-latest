
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Clock } from "lucide-react";

export default function TokenTracker() {
  const [currentToken, setCurrentToken] = useState(58);
  const yourToken = 65;
  const [estimatedTime, setEstimatedTime] = useState(0);

  useEffect(() => {
    const tokensRemaining = yourToken - currentToken;
    const avgTimePerToken = 3; // minutes
    setEstimatedTime(Math.max(0, tokensRemaining * avgTimePerToken));

    const interval = setInterval(() => {
      setCurrentToken((prevToken) => {
        if (prevToken < yourToken) {
          const newToken = prevToken + 1;
          const newTokensRemaining = yourToken - newToken;
          setEstimatedTime(Math.max(0, newTokensRemaining * avgTimePerToken));
          return newToken;
        }
        clearInterval(interval);
        return prevToken;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [currentToken, yourToken]);

  const progress =
    yourToken > currentToken ? ((currentToken - 50) / (yourToken - 50)) * 100 : 100;
  
  const tokensRemaining = yourToken - currentToken;

  return (
    <Card className="border-0 shadow-lg w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>Live Queue Status</CardTitle>
        <CardDescription>Real-time clinic waiting information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center items-center gap-8 text-center h-64">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="rounded-lg bg-secondary/50 p-4 w-40">
                <p className="text-sm font-medium text-muted-foreground">
                  Current Token
                </p>
                <p className="text-4xl font-bold text-primary">{currentToken}</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between h-full">
                <div className="w-16 text-center">
                    <p className="text-sm font-medium text-muted-foreground">Queue</p>
                    <p className="text-lg font-bold">{tokensRemaining > 0 ? `${tokensRemaining}` : 'Go'}</p>
                </div>
                <Progress value={progress} className="w-3 h-full" orientation="vertical" />
                <Users className="h-6 w-6 text-muted-foreground" />
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
              <div className="rounded-lg bg-primary/10 p-4 w-40">
                <p className="text-sm font-medium text-muted-foreground">
                  Your Token
                </p>
                <p className="text-4xl font-bold">{yourToken}</p>
              </div>
            </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 rounded-lg border bg-background p-3 text-sm font-medium">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <span>Estimated Wait Time:</span>
          <span className="font-bold text-primary">
            {estimatedTime > 0 ? `~${estimatedTime} mins` : "Now"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
