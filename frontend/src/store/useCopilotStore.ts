import { create } from 'zustand';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface CopilotState {
  isOpen: boolean;
  messages: Message[];
  isTyping: boolean;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  addMessage: (message: Message) => void;
  appendChunkToLastMessage: (chunk: string) => void;
  setTyping: (typing: boolean) => void;
  clearMessages: () => void;
}

export const useCopilotStore = create<CopilotState>((set) => ({
  isOpen: false,
  messages: [],
  isTyping: false,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (isOpen) => set({ isOpen }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  appendChunkToLastMessage: (chunk) => set((state) => {
    const newMessages = [...state.messages];
    if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
      newMessages[newMessages.length - 1].content += chunk;
    } else {
      newMessages.push({ role: 'assistant', content: chunk });
    }
    return { messages: newMessages };
  }),
  setTyping: (isTyping) => set({ isTyping }),
  clearMessages: () => set({ messages: [] })
}));
