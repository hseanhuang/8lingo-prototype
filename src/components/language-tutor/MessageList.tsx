import React from "react";
import { CharacterPractice } from "./CharacterPractice";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { TrueFalseQuestion } from "./TrueFalseQuestion";
import { Message } from "./types";

interface MessageListProps {
  messages: Message[];
  onAnswerSubmit: (answer: string | boolean) => void;
}

export function MessageList({ messages, onAnswerSubmit }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-4 rounded-lg ${
            message.sender === "user" ? "bg-blue-100" : "bg-green-100"
          }`}
        >
          {message.responseType === "text" && (
            <div>
              {message.content.text && (
                <p className="whitespace-pre-line">{message.content.text}</p>
              )}
            </div>
          )}
          {message.responseType === "multipleChoice" && (
            <MultipleChoiceQuestion
              message={message}
              onAnswerSubmit={onAnswerSubmit}
            />
          )}
          {message.responseType === "trueFalse" && (
            <TrueFalseQuestion
              message={message}
              onAnswerSubmit={onAnswerSubmit}
            />
          )}
          {message.responseType === "characterPractice" &&
            message.content.character && (
              <CharacterPractice message={message} />
            )}
        </div>
      ))}
    </div>
  );
}

export default MessageList;
