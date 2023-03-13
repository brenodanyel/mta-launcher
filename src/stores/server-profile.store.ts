import create from 'zustand';
import { axiosInstance } from '@/services';

export type Profile = {
  id: string;
  ip: string;
  port: number;
  description: string;
  logo: string;
  externalLinks: {
    id: string;
    name: string;
    url: string;
  }[],
  active: boolean;
  createdAt: Date;
  removeAt: Date | null;
  ownerId: string;
  onwer?: {
    email: string;
    id: string;
    username: string;
  };
};

type State = {
  profiles: Record<string, Profile>;
  setProfiles: (profiles: State["profiles"]) => void;

  getProfile: (ip: string, port: number) => Profile | null;
  setProfile: (ip: string, port: number, profile: Profile | null) => void;

  fetchProfiles(): Promise<void>;
  fetchProfile(ip: string, port: number): Promise<void>;
};

export const useServerProfileStore = create<State>(
  (set, get) => (
    {
      profiles: {},

      async fetchProfiles() {
        try {
          const { status, data } = await axiosInstance<Profile[]>({
            url: 'server-profile',
            method: 'get',
          });

          if (status !== 200) {
            throw new Error('invalid response');
          }

          const profiles = data.reduce<Record<string, Profile>>((prev, curr) => {
            const key = `${curr.ip}:${curr.port}`;
            prev[key] = curr;
            return prev;
          }, {});

          set({ profiles });
        }
        catch (e) {
          console.log(e);
        }
      },

      async fetchProfile(ip, port) {
        try {
          const { status, data } = await axiosInstance<Profile>({
            url: 'server-profile',
            method: 'get',
            params: { ip, port }
          });

          if (status !== 200) {
            throw new Error('invalid response');
          }

          const key = `${ip}:${port}`;
          const { profiles } = get();

          profiles[key] = data;

          set({ profiles });
        }
        catch (e) {
          console.log(e);
        }
      },

      setProfiles(profiles) {
        set({ profiles });
      },

      getProfile(ip, port) {
        const { profiles } = get();
        const key = `${ip}:${port}`;
        return profiles[key] || null;
      },

      setProfile(ip, port, profile) {
        const { profiles } = get();

        const key = `${ip}:${port}`;

        delete profiles[key];

        if (profile) {
          profiles[key] = profile;
        }

        set({ profiles });
      },
    }
  )
);
