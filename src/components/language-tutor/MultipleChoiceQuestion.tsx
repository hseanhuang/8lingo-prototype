import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Message } from "./types";

interface MultipleChoiceQuestionProps {
  message: Message;
  onAnswerSubmit: (answer: string) => void;
}

export function MultipleChoiceQuestion({
  message,
  onAnswerSubmit,
}: MultipleChoiceQuestionProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswerSubmit = (answer: string) => {
    setSelectedAnswer(answer);
    if (!message.content.correctAnswer) {
      onAnswerSubmit(answer);
      return;
    }
    const isCorrect = answer === message.content.correctAnswer;
    if (isCorrect) {
      onAnswerSubmit(answer);
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
        {message.content.options?.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`option-${index}`} />
            <Label htmlFor={`option-${index}`}>{option}</Label>
          </div>
        ))}
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
