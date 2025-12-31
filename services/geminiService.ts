
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ReadingTest, WritingFeedback, ListeningExercise } from "../types";

export const generateReadingTest = async (topic?: string, context?: { book: number, test: number }): Promise<ReadingTest> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const contextPrompt = context 
    ? `Strictly simulate the style, difficulty, and complexity level of Cambridge IELTS Book ${context.book}, Test ${context.test}.`
    : "";
    
  const prompt = `Generate a full IELTS Academic Reading Test. ${contextPrompt}
  This test must contain exactly 3 academic passages.
  Passage 1: Easy-Medium (Questions 1-13) - Include some 'Fill in the gaps' (Sentence Completion) questions.
  Passage 2: Medium (Questions 14-26) - Include 'Matching Headings' or 'True/False/Not Given'.
  Passage 3: Difficult (Questions 27-40) - Include 'Multiple Choice'.
  
  For 'Fill in the gaps' questions, DO NOT provide an options array. The answer must be a short string (1-3 words).
  Return as JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          testTitle: { type: Type.STRING },
          passages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING },
                      options: { 
                        type: Type.ARRAY, 
                        items: { type: Type.STRING },
                        description: "Provide options for Multiple Choice. Leave empty or omit for Fill in the Gaps questions."
                      },
                      answer: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    },
                    required: ["id", "text", "answer", "explanation"]
                  }
                }
              },
              required: ["title", "content", "questions"]
            }
          }
        },
        required: ["testTitle", "passages"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateListeningExercise = async (topic?: string, context?: { book: number, test: number }): Promise<ListeningExercise> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const contextPrompt = context 
    ? `This must exactly mirror the format and difficulty of Cambridge IELTS Book ${context.book}, Test ${context.test}.`
    : "Generate a realistic IELTS Listening full practice test.";

  const prompt = `Generate a full IELTS Listening Test with 4 Sections (Parts), 10 questions each, total 40 questions. ${contextPrompt}
  Section 1: Social Context (Dialogue) - Completion.
  Section 2: Social Context (Monologue) - Multiple Choice / Map.
  Section 3: Educational Context (Dialogue) - Matching / Completion.
  Section 4: Academic Lecture (Monologue) - Note Completion.
  
  Provide transcripts for all 4 parts. Return as JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          testTitle: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                title: { type: Type.STRING },
                instructions: { type: Type.STRING },
                context: { type: Type.STRING },
                transcript: { type: Type.STRING },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      answer: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    },
                    required: ["id", "text", "answer", "explanation"]
                  }
                }
              },
              required: ["id", "title", "instructions", "context", "transcript", "questions"]
            }
          }
        },
        required: ["testTitle", "sections"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateWritingPrompt = async (taskType: 'Task 1' | 'Task 2', context?: { book: number, test: number }): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const contextPrompt = context 
    ? `Simulate a prompt from Cambridge IELTS Book ${context.book}, Test ${context.test}.` 
    : "Generate a standard high-quality IELTS Writing prompt.";
    
  const prompt = `${contextPrompt} Task type: ${taskType}. Return only the prompt text.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });

  return response.text || '';
};

export const generateSpeakingCueCard = async (context?: { book: number, test: number }): Promise<{ topic: string, bulletPoints: string[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const contextPrompt = context 
    ? `Simulate a Part 2 cue card from Cambridge IELTS Book ${context.book}, Test ${context.test}.` 
    : "Generate a standard high-quality IELTS Speaking Part 2 cue card topic.";
    
  const prompt = `${contextPrompt} Return a JSON object with 'topic' and 'bulletPoints' (array of 4 strings).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["topic", "bulletPoints"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const gradeWritingTask = async (prompt: string, submission: string, taskType: 'Task 1' | 'Task 2'): Promise<WritingFeedback> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const instruction = `You are an official IELTS Writing Examiner. Grade the following ${taskType} submission strictly according to the IELTS criteria.
  Prompt: ${prompt}
  Submission: ${submission}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: instruction,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          bandScore: { type: Type.NUMBER },
          taskResponse: { type: Type.STRING },
          coherenceAndCohesion: { type: Type.STRING },
          lexicalResource: { type: Type.STRING },
          grammaticalRange: { type: Type.STRING },
          overallComments: { type: Type.STRING },
          suggestedCorrection: { type: Type.STRING }
        },
        required: ["bandScore", "taskResponse", "coherenceAndCohesion", "lexicalResource", "grammaticalRange", "overallComments", "suggestedCorrection"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateListeningAudio = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  
  const base64Audio = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
  return base64Audio || '';
};
