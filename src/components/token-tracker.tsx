
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
      <CardHeader className="text-center pb-4">
        <CardTitle>Live Queue Status</CardTitle>
        <CardDescription>Real-time clinic waiting information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-6">
        <div className="flex flex-col items-center justify-between h-[22rem] gap-2">
          
          {/* Current Token */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">
              Current Token
            </p>
            <p className="text-6xl font-bold text-primary">{currentToken}</p>
          </div>

          {/* Progress Bar & Queue Info */}
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="relative h-full flex items-center justify-center">
              <Progress value={progress} className="w-3 h-full" orientation="vertical" />
              <div className="absolute top-1/2 -translate-y-1/2 left-8 bg-background px-2 py-1 rounded-md shadow-md text-center">
                  <p className="text-sm font-medium text-muted-foreground">Queue</p>
                  <p className="text-lg font-bold">{tokensRemaining > 0 ? `${tokensRemaining}` : 'Go'}</p>
                  <Users className="h-4 w-4 text-muted-foreground mx-auto mt-1" />
              </div>
            </div>
          </div>
          
          {/* Your Token */}
          <div className="flex flex-col items-center gap-2">
             <p className="text-sm font-medium text-muted-foreground">
              Your Token
            </p>
            <p className="text-6xl font-bold" style={{ color: '#FFC64F' }}>{yourToken}</p>
          </div>
        </div>
        
        {/* Estimated Time */}
        <div className="flex items-center justify-center gap-2 rounded-lg bg-background p-3 text-sm font-medium shadow-md">
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
