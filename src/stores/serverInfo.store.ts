import create from 'zustand';

export type infoValue = {
  description: string;
  externalLinks: Record<string, string>;
  logo: string;
};

export type infoType = Record<string, infoValue>;

type state = {
  info: infoType;
  updateAllInfo: (info: infoType) => void;
  updateInfo: (ip: string, port: number, value: infoValue) => void;
};

export const useServerInfoStore = create<state>((set, get) => ({
  info: {},

  updateAllInfo(info) {
    set(state => {
      return {
        ...state,
        info,
      };
    });
  },

  updateInfo(ip, port, value) {
    set(state => {
      return {
        ...state,
        [`${ip}:${port}`]: value,
      };
    });
  },
}));
