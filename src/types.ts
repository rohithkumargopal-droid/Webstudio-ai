export interface Message {
  role: 'user' | 'assistant';
  content: string;
  isInitial?: boolean;
}

export interface GeneratorState {
  code: string;
  messages: Message[];
  status: 'idle' | 'generating' | 'error';
}

export interface Project {
  id: string;
  name: string;
  code: string;
  userId: string;
  createdAt: any;
  updatedAt: any;
}
