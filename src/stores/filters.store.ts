import create from 'zustand';

type state = {
  name: string;
  showFavoritesOnly: boolean;
  playedOn: boolean;
  notPasswordProtected: boolean;
  sponsoring: boolean;
};

type actions = {
  updateFilter: (key: keyof state, value: any) => void;
  resetFilters: () => void;
};

export const useFiltersStore = create<state & actions>(set => ({
  name: '',
  showFavoritesOnly: false,
  playedOn: false,
  notPasswordProtected: false,
  sponsoring: false,

  updateFilter: (key: keyof state, value: any) => set((state) => {
    return { ...state, [key]: value };
  }),

  resetFilters: () => set((state) => {
    return {
      ...state,
      name: '',
      showFavoritesOnly: false,
      playedOn: false,
      notPasswordProtected: false,
      sponsoring: false,
    };
  }),
}));
