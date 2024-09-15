export interface Message {
  id: number;
  sender: "user" | "tutor";
  content: {
    text: string;
    correctAnswer?: string;
    options?: string[];
    character?: {
      hanzi: string;
      pinyin?: string;
      meaning?: string;
      etymology?: string;
      usage?: string;
    };
  };
  responseType?: "text" | "multipleChoice" | "trueFalse" | "characterPractice";
}
