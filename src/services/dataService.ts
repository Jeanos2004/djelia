export type Story = {
  id: string;
  title: string;
  category: string;
  region: string;
  ethnicGroup: string;
  content: string;
  imageUrl: string;
  audioUrl?: string;
};

const MOCK_STORIES: Story[] = [
  {
    id: '1',
    title: 'Soundiata Keïta, l\'épopée mandingue',
    category: 'Conte',
    region: 'Kankan',
    ethnicGroup: 'Mandingue',
    content: 'Voici l\'histoire de Soundiata Keïta, le fondateur de l\'Empire du Mali...',
    imageUrl: 'https://images.unsplash.com/photo-1542304874-5c91f0a20e40?q=80&w=600&auto=format&fit=crop', // Placeholder baobab
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Mock audio
  },
  {
    id: '2',
    title: 'Le lièvre et l\'hyène',
    category: 'Fable',
    region: 'Labé',
    ethnicGroup: 'Peul',
    content: 'Un jour, le lièvre très rusé rencontra l\'hyène affamée...',
    imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=600&auto=format&fit=crop', // Placeholder african landscape
  },
  {
    id: '3',
    title: 'La légende du Nimba',
    category: 'Coutume',
    region: 'Nzérékoré',
    ethnicGroup: 'Baga',
    content: 'Le masque Nimba est le symbole de la fertilité et de la fécondité...',
    imageUrl: 'https://images.unsplash.com/photo-1501862700950-18382cd414a1?q=80&w=600&auto=format&fit=crop', // Placeholder statue/art
  }
];

export const getStories = async (): Promise<Story[]> => {
  // Simulate network request
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_STORIES);
    }, 800);
  });
};

export const searchStories = async (query: string, regionFilter?: string, ethnicFilter?: string, categoryFilter?: string): Promise<Story[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let results = MOCK_STORIES;
      if (query) {
        results = results.filter(s => s.title.toLowerCase().includes(query.toLowerCase()) || s.content.toLowerCase().includes(query.toLowerCase()));
      }
      if (regionFilter) {
        results = results.filter(s => s.region === regionFilter);
      }
      if (ethnicFilter) {
        results = results.filter(s => s.ethnicGroup === ethnicFilter);
      }
      if (categoryFilter) {
        // Simple plural/singular matching for flexible search
        results = results.filter(s => 
          s.category.toLowerCase() === categoryFilter.toLowerCase() || 
          s.category.toLowerCase() + 's' === categoryFilter.toLowerCase()
        );
      }
      resolve(results);
    }, 500);
  });
};

export const getStoryById = async (id: string): Promise<Story | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_STORIES.find(s => s.id === id));
    }, 300);
  });
};
