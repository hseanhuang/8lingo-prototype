"use client";

import { sendMessage } from "@/actions/tutor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MessageList } from "./MessageList";
import { Message } from "./types";
import { toast } from "sonner";

export function LanguageTutor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const newUserMessage: Message = {
      id: messages.length,
      sender: "user",
      content: { text: inputMessage },
      responseType: "text",
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputMessage("");

    try {
      const tutorResponse = await sendMessage(updatedMessages);
      setMessages((prevMessages) => [...prevMessages, tutorResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Opps! Something went wrong. Please try again.");
    }
  };

  const handleAnswerSubmit = async (answer: string | boolean) => {
    const newUserMessage: Message = {
      id: messages.length,
      sender: "user",
      content: { text: String(answer) },
      responseType: "text",
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);

    try {
      const tutorResponse = await sendMessage(updatedMessages);
      setMessages((prevMessages) => [...prevMessages, tutorResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Opps! Something went wrong. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle>AI Chinese Language Tutor</CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-[calc(100vh-200px)] overflow-y-auto flex flex-col">
        <MessageList messages={messages} onAnswerSubmit={handleAnswerSubmit} />
        <div className="mt-4 flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}
