import { appWindow } from '@tauri-apps/api/window';
import { getVersion } from '@tauri-apps/api/app';
import { apiAxiosInstance, axiosInstance } from '@/services';

const stats = {
  currentVersion: '',
  playerCount: 0,
  playersUsingLauncherCount: 0,
};

getVersion()
  .then((version) => {
    stats.currentVersion = version;
  })
  .catch((e) => console.log(e))
  .finally(() => {
    syncTitle();
  });

async function updatePlayerCount() {
  apiAxiosInstance({
    url: '/stats',
    method: 'get',
  })
    .then((res) => res.data)
    .then((data) => {
      stats.playerCount = data.playerCount;
    })
    .catch(e => console.error(e))
    .finally(() => {
      syncTitle();
      setTimeout(() => {
        updatePlayerCount();
      }, 60000);
    });
}
updatePlayerCount();

async function updatePlayersUsingLauncherCount() {
  axiosInstance({
    url: '/pulse',
    method: 'get',
  })
    .then((res) => res.data)
    .then((data) => {
      stats.playersUsingLauncherCount = data;
    })
    .catch(e => console.error(e))
    .finally(() => {
      syncTitle();
      setTimeout(() => {
        updatePlayersUsingLauncherCount();
      }, 60000);
    });
}
updatePlayersUsingLauncherCount();

function syncTitle() {
  let str = 'MTA Launcher';

  if (stats.currentVersion) {
    str += ` - v${stats.currentVersion}`;
  }

  if (stats.playerCount > 0) {
    str += ` - ${Intl.NumberFormat().format(stats.playerCount)} players online`;
  }

  if (stats.playersUsingLauncherCount > 0) {
    str += ` - ${Intl.NumberFormat().format(stats.playersUsingLauncherCount)} ${stats.playersUsingLauncherCount > 1 ? 'players' : 'player'} using launcher`;
  }

  appWindow.setTitle(str);
}
