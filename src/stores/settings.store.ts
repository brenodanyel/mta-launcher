import create from 'zustand';
import { Store } from '@/services/storage';
import { handler } from '@/samples/discord-presence';

const store = new Store('settings.json');

type State = {
  nickname: string;
  useRichPresence: boolean;
};

store.debug();

type Actions = {
  updateNickname: (nickname: State['nickname']) => Promise<void>;
  updateUseRichPresence: (useRichPresence: State['useRichPresence']) => Promise<void>;
};

export const useSettingsStore = create<State & Actions>(
  (set) => {
    store.get('nickname', '')
      .then(nickname => set({ nickname }));

    store.get('useRichPresence', true)
      .then(useRichPresence => set({ useRichPresence }));

    return {
      nickname: '',
      useRichPresence: true,

      updateNickname: async (nickname: string) => {
        await store.set('nickname', nickname);
        set({ nickname });
      },

      updateUseRichPresence: async (useRichPresence: boolean) => {
        await store.set('useRichPresence', useRichPresence);

        console.log(useRichPresence);

        useRichPresence
          ? handler.updateActivity()
          : handler.removeActivity();

        set({ useRichPresence });
      }
    };
  }
);
