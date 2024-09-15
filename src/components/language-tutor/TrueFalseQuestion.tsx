import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Message } from "./types";

interface TrueFalseQuestionProps {
  message: Message;
  onAnswerSubmit: (answer: boolean) => void;
}

export function TrueFalseQuestion({
  message,
  onAnswerSubmit,
}: TrueFalseQuestionProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswerSubmit = (value: string) => {
    setSelectedAnswer(value);
    const userAnswer = value === "true";
    if (!message.content.correctAnswer) {
      onAnswerSubmit(userAnswer);
      return;
    }
    const isCorrect = userAnswer === (message.content.correctAnswer === "true");
    if (isCorrect) {
      onAnswerSubmit(userAnswer);
      setFeedback("Correct!");
    } else {
      setFeedback("Incorrect. Please try again.");
      setSelectedAnswer(null);
    }
  };

  return (
    <div className="mt-2">
      <p>{message.content.text}</p>
      <RadioGroup
        onValueChange={handleAnswerSubmit}
        value={selectedAnswer || undefined}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="true" />
          <Label htmlFor="true">True</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="false" />
          <Label htmlFor="false">False</Label>
        </div>
      </RadioGroup>
      {message.content.correctAnswer && (
        <Alert className="mt-2 bg-yellow-100">
          <AlertDescription>
            Answer: {message.content.correctAnswer}
          </AlertDescription>
        </Alert>
      )}
      {feedback && (
        <Alert
          className={`mt-2 ${
            feedback.startsWith("Correct") ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <AlertDescription>{feedback}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
