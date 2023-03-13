import create from 'zustand';
import { Store } from '@/services/storage';
export const store = new Store('favorites.json');

export type State = {
  playedServers: Record<string, Date>;
  updatePlayedServer(ip: string, port: number): void;
  getPlayedDate(ip: string, port: number): Date | null;
};

export const usePlayedServersStore = create<State>(
  (set, get) => {
    store.get('playedServers', {})
      .then(playedServers => set({ playedServers }));

    return {
      playedServers: {},

      updatePlayedServer: (ip, port) => set((state) => {
        const newPlayedServers = {
          ...state.playedServers,
          [`${ip}:${port}`]: new Date(),
        };

        store.set('playedServers', newPlayedServers);

        return {
          ...state,
          playedServers: newPlayedServers,
        };
      }),

      getPlayedDate(ip, port) {
        const { playedServers } = get();
        const key = `${ip}:${port}`;
        return playedServers?.[key] || null;
      },
    };
  }
);
