import { useSettingsStore } from '@/stores/settings.store';
import { sendNotification } from '@/services/notification';
import { open } from '@tauri-apps/api/shell';
import { usePlayedServersStore } from '@/stores/playedServers.store';
import { usePrompt } from './usePrompt';
import { Server } from '@/types';

export function useGameJoiner() {
  const nickname = useSettingsStore((s) => s.nickname);
  const { updatePlayedServer } = usePlayedServersStore();
  const prompt = usePrompt();

  function getConnectionString(ip: string, port: number, password?: string) {
    let str = '';
    str += 'mtasa://';
    str += nickname;
    if (password) {
      str += ':';
      str += password;
    }
    str += '@';
    str += ip;
    str += ':';
    str += port;
    return str;
  }

  async function joinServer(server: Server) {
    const { ip, port } = server;

    let password: string | undefined;

    if (server.passworded) {
      await prompt(
        {
          title: server.name,
          description: 'Enter the password for this server',
          confirmationText: 'Join',
          textFieldProps: {
            type: 'password',
          },
        }
      )
        .then((value) => {
          password = value;
        })
        .catch(() => { });

      if (!password) return;
    }

    const url = getConnectionString(ip, port, password);
    console.log(`joing server with connection string: "${url}"`);

    await open(url);

    updatePlayedServer(ip, port);

    sendNotification({
      title: 'MTA Launcher',
      body: `You have joined the server! now go to MTA window and play!`,
    });
  }

  return joinServer;
}
