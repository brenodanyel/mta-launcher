import { invoke } from '@tauri-apps/api/tauri';
import { appWindow } from '@tauri-apps/api/window';
import { MTAConfig } from './helpers/mta-configs';
import { axiosInstance, apiAxiosInstance } from '@/services';
import { Store } from '@/services/storage';
const store = new Store('settings.json');

type IActivicty = {
  state?: string,
  details?: string,
  largeImage?: string,
  largeText?: string,
  smallImage?: string,
  smallText?: string,
  startAt?: number,
  currentPlayers?: number,
  maxPlayers?: number,
  serverIp?: string,
  profile?: string,
};

class DiscordHandler {
  private startAt = Date.now();
  private timeout: NodeJS.Timeout | null = null;

  constructor(
    private mtaConfig = new MTAConfig()
  ) {
    this.updateActivity();
  }

  private async getServerProfile(ip: string, port: number) {
    try {
      const { status, data } = await axiosInstance({
        url: `/server-profile`,
        method: 'get',
        params: { ip, port },
        validateStatus: () => true,
      });

      if (status !== 200) throw new Error();

      return data;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  private async getPlayingServer(ip: string, port: number, nick: string) {
    try {
      const { status, data } = await apiAxiosInstance({
        url: '/server',
        params: {
          ip,
          asePort: port + 123,
        },
        method: 'get',
        validateStatus: () => true,
      });

      if (status !== 200) {
        throw new Error();
      }

      const launcherNickname = await store.get('nickname', '');

      const found = data.players?.some((player: any) => [launcherNickname, nick].includes(player.name));

      if (!found) {
        return null;
      }

      return data;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  private async getActiveServer() {
    const result = {};

    const settings = await this.mtaConfig.readConfigFile();

    if (!settings) {
      return null;
    }

    if (!settings.host || !settings.port) {
      return null;
    }

    const server = await this.getPlayingServer(settings.host, settings.port, settings.nick);

    if (!server) {
      return null;
    }

    const profile = await this.getServerProfile(settings.host, settings.port);

    return {
      ip: settings.host,
      port: settings.port,
      name: server.name,
      players: {
        current: server.playerCount,
        max: server.playerSlots,
      },
      gameType: server.gameType,
      profile,
    };
  }

  private async getActivity() {
    const result: IActivicty = {
      state: 'Idle',
      largeImage: 'https://mtasa-launcher.s3.amazonaws.com/mta-logo.png',
      smallImage: "https://mtasa-launcher.s3.amazonaws.com/mta-logo.png",
      startAt: this.startAt,
    };

    result.smallText = "Multi Theft Auto";

    const server = await this.getActiveServer();

    if (server) {
      result.state = 'Playing';
      result.details = server.name;
      result.currentPlayers = server.players.current;
      result.maxPlayers = server.players.max;
      result.largeText = server.gameType;
      result.serverIp = `mtasa://${server.ip}:${server.port}`;


      if (server.profile) {
        result.profile = `https://mta-launcher.com/profile/${server.ip}/${server.port}`;

        if (server.profile.logo) {
          result.largeImage = server.profile.logo + '?' + Date.now();
        }
      }
    }

    console.log(result);

    return result;
  }

  public async updateActivity() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    const activity = await this.getActivity();

    if (!await store.get('useRichPresence', true)) {
      return;
    }

    return invoke('set_discord_presence', activity)
      .then(() => console.log('updated rich presence'))
      .catch((e) => console.log('failed to update rich presence', e))
      .finally(() => {
        this.timeout = setTimeout(() => {
          this.updateActivity();
        }, 5000);
      });
  }

  public async removeActivity() {
    return invoke('disable_rich_presence')
      .then(() => console.log('removed rich presence'))
      .catch(() => console.log('failed to remove rich presence'));
  }
}

export const handler = new DiscordHandler();

appWindow.onCloseRequested(() => {
  handler.removeActivity();
});
