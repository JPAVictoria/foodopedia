import { create } from 'zustand';

interface ContentItem {
  id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
}

interface ContentStore {
  contents: ContentItem[];
  setContents: (contents: ContentItem[]) => void;
  addContent: (content: ContentItem) => void;
  updateContent: (id: string, updatedContent: Partial<ContentItem>) => void;
  deleteContent: (id: string) => void;
}

export const useContentStore = create<ContentStore>((set) => ({
  contents: [],
  setContents: (contents) => set({ contents }),
  addContent: (content) => set((state) => ({ contents: [...state.contents, content] })),
  updateContent: (id, updatedContent) => 
    set((state) => ({
      contents: state.contents.map(item => 
        item.id === id ? { ...item, ...updatedContent } : item
      )
    })),
  deleteContent: (id) => 
    set((state) => ({ contents: state.contents.filter(item => item.id !== id) })),
}));