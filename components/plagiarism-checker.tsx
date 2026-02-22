"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export function PlagiarismChecker() {
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<number | null>(null)

  const checkPlagiarism = () => {
    setChecking(true)
    setResult(null)
    // Simulate API call
    setTimeout(() => {
      setChecking(false)
      setResult(Math.floor(Math.random() * 15)) // Random low percentage for demo
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plagiarism Checker</CardTitle>
        <CardDescription>Scan your document for potential originality issues.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-8 border-2 border-dashed rounded-xl bg-muted/50">
          {checking ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Scanning academic databases...</p>
            </div>
          ) : result !== null ? (
            <div className="flex flex-col items-center space-y-2">
              {result < 10 ? (
                <CheckCircle className="h-12 w-12 text-green-500" />
              ) : (
                <AlertCircle className="h-12 w-12 text-yellow-500" />
              )}
              <h3 className="text-2xl font-bold">{result}% Similarity</h3>
              <p className="text-sm text-muted-foreground">
                {result < 10 ? "Great job! Your content appears original." : "Some similarities found. Review highlighted sections."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Ready to scan current document</p>
              <Button onClick={checkPlagiarism}>Start Scan</Button>
            </div>
          )}
        </div>

        {result !== null && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Originality Score</span>
              <span>{100 - result}% Unique</span>
            </div>
            <Progress value={100 - result} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
