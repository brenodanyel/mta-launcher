import create from 'zustand';
import { Store } from '@/services/storage';
export const store = new Store('favorites.json');

type State = {
  favorites: string[];
};

type Actions = {
  addFavorite: (ip: string, port: number) => Promise<void>;
  removeFavorite: (ip: string, port: number) => Promise<void>;
  isFavorite: (ip: string, port: number) => Boolean;
};

export const useFavoritesStore = create<State & Actions>(
  (set, get) => {
    store.get('favorites', [])
      .then(favorites => set({ favorites }));

    return {
      favorites: [],

      addFavorite: async (ip: string, port: number) => {
        const { favorites } = get();
        const newFavorites = [...favorites, `${ip}:${port}`];
        await store.set('favorites', newFavorites);
        set({ favorites: newFavorites });
      },

      removeFavorite: async (ip: string, port: number) => {
        const { favorites } = get();
        const newFavorites = favorites.filter(favorite => favorite !== `${ip}:${port}`);
        await store.set('favorites', newFavorites);
        set({ favorites: newFavorites });
      },

      isFavorite(ip, port) {
        const { favorites } = get();
        return favorites.includes(`${ip}:${port}`);
      }
    };
  }
);
