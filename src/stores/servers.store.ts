import create from 'zustand';
import { Server } from '@/types';

type state = {
  servers: Server[];
};

type actions = {
  replace(servers: Server[]): void;
  replaceSingleServer(server: Server): void;
};

export const useServersStore = create<state & actions>(set => ({
  servers: [],

  replace: (servers: Server[]) => set((state) => {
    return { ...state, servers };
  }),

  replaceSingleServer: (server: Server) => set((state) => {
    const newServers = state.servers.map((s) => {
      if (s.ip === server.ip && s.port === server.port) {
        return { ...s, ...server };
      }
      return s;
    });

    return { ...state, servers: newServers };
  }),
}));
