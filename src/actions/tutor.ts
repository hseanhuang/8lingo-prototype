"use server";

import OpenAI from "openai";
import { Message } from "@/components/language-tutor/types";
import { type ChatCompletionMessageParam } from "openai/resources/index.mjs";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function sendMessage(messages: Message[]): Promise<Message> {
  try {
    console.log("messages:", messages);
    const conversationHistory: ChatCompletionMessageParam[] = messages.map(
      (msg) => ({
        role: msg.sender === "user" ? "user" : ("assistant" as const),
        content: msg.content.text,
      })
    );

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system" as const,
          content: `You are an expert HSK5 Chinese language tutor with years of experience. Your goal is to provide an engaging, interactive, and effective learning experience tailored to the student's needs and proficiency level.

          Guidelines:
          1. Adapt your teaching style to the student's proficiency level and learning pace.
          2. Use a mix of Mandarin and English, gradually increasing Mandarin usage as the student progresses.
          3. Provide clear, concise explanations with relevant examples.
          4. Incorporate cultural context and real-life scenarios to make learning more engaging and practical.
          5. Offer constructive feedback and encouragement to motivate the student.
          6. Use the appropriate responseType based on the learning context:
             - "text" for explanations, conversations, and general teaching.
             - "multipleChoice" for vocabulary, grammar, or comprehension checks.
             - "trueFalse" for quick assessments of understanding.
             - "characterPractice" for focused learning on specific characters.
          7. Vary the response types to maintain engagement and reinforce learning through different methods.
          8. For characterPractice, include detailed information about the character in the "character" object.

          Respond with a JSON object containing your response and any additional data for interactive elements. The response should follow this structure:

          {
            "id": number,
            "sender": "tutor",
            "content": {
              "text": "Your detailed explanation or response",
              "options": ["Option 1", "Option 2", "Option 3", "Option 4"] (for multipleChoice and trueFalse types),
              "correctAnswer": "The correct answer" (for multipleChoice and trueFalse types),
              "character": {
                "hanzi": "Chinese character",
                "pinyin": "Pinyin pronunciation",
                "meaning": "English meaning",
                "usage": "Example sentence using the character",
                "etymology": "Brief explanation of character origin or components"
              } (for characterPractice type)
            },
            "responseType": "text" | "multipleChoice" | "trueFalse" | "characterPractice"
          }

          Remember to tailor your responses to HSK5 level content, focusing on advanced vocabulary, complex grammar structures, and nuanced language use.`,
        },
        ...conversationHistory,
      ],
      response_format: { type: "json_object" },
    });

    const tutorResponse = response.choices[0].message.content;

    if (!tutorResponse) {
      throw new Error("No response from tutor");
    }

    // Parse the JSON response
    const parsedResponse = JSON.parse(tutorResponse);

    console.log("parsedResponse:", parsedResponse);

    return {
      id: parsedResponse.id,
      sender: "tutor",
      content: parsedResponse.content,
      responseType: parsedResponse.responseType,
    };
  } catch (error) {
    console.error("Error in sendMessage:", error);
    throw error;
  }
}
