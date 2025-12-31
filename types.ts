export enum IELTSModule {
  READING = 'Reading',
  LISTENING = 'Listening',
  WRITING = 'Writing',
  SPEAKING = 'Speaking'
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  answer: string;
  explanation: string;
  passageIndex?: number;
}

export interface ListeningSection {
  id: number;
  title: string;
  instructions: string;
  context: string;
  transcript: string;
  questions: Question[];
  audioUrl?: string; // Manual audio file path/URL
}

export interface ListeningExercise {
  testTitle: string;
  sections: ListeningSection[];
}

export interface ReadingPassage {
  title: string;
  content: string;
  questions: Question[];
}

export interface ReadingTest {
  testTitle: string;
  passages: ReadingPassage[];
}

export interface WritingFeedback {
  bandScore: number;
  taskResponse: string;
  coherenceAndCohesion: string;
  lexicalResource: string;
  grammaticalRange: string;
  overallComments: string;
  suggestedCorrection: string;
}

export interface UserProgress {
  readingScore: number;
  listeningScore: number;
  writingScore: number;
  speakingScore: number;
  sessionsCompleted: number;
}