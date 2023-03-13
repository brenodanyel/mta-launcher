import axios from 'axios';
import { open } from '@tauri-apps/api/shell';
import { ask } from '@tauri-apps/api/dialog';
import { getVersion } from '@tauri-apps/api/app';

export interface GithubResponse {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: UploaderOrAuthor;
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets?: (AssetsEntity)[] | null;
  tarball_url: string;
  zipball_url: string;
  body: string;
}

export interface UploaderOrAuthor {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface AssetsEntity {
  url: string;
  id: number;
  node_id: string;
  name: string;
  label?: null;
  uploader: UploaderOrAuthor;
  content_type: string;
  state: string;
  size: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  browser_download_url: string;
}

class Updater {
  public async tryToUpdate(): Promise<void> {
    const latest = await this.fetchLatestUpdate();

    if (!latest) {
      return;
    }

    if (await this.checkIfUpdateAvailable(latest) !== 1) {
      return;
    }

    if (!await ask(`A new version was found (${latest.tag_name})\nDo you want to download it now?\n`, { title: latest.name, type: 'warning' })) {
      return;
    }

    const [asset] = latest.assets || [];

    open(asset.browser_download_url);
  }

  public async fetchLatestUpdate(): Promise<GithubResponse | null> {
    try {
      const url = 'https://api.github.com/repos/MTALauncher/Releases/releases/latest';

      const { status, data } = await axios<GithubResponse>({ url, method: 'GET' });

      if (status !== 200) {
        throw new Error('Could not fetch update');
      }

      return data;
    }
    catch (error) {
      console.log(error);
      return null;
    }
  }

  private async checkIfUpdateAvailable(data: GithubResponse): Promise<number> {
    const currentVersion = await getVersion();
    const latestVersion = data.tag_name;

    console.log('Checking if should update: ', { currentVersion, latestVersion });

    let vnum1 = 0, vnum2 = 0;

    for (let i = 0, j = 0; i < latestVersion.length || j < currentVersion.length;) {
      while (i < latestVersion.length && latestVersion[i] !== '.') {
        vnum1 = vnum1 * 10 + (latestVersion.charCodeAt(i) - 48);
        i++;
      }

      while (j < currentVersion.length && currentVersion[j] !== '.') {
        vnum2 = vnum2 * 10 + (currentVersion.charCodeAt(j) - 48);
        j++;
      }

      if (vnum1 > vnum2) return 1;
      if (vnum2 > vnum1) return -1;

      vnum1 = vnum2 = 0;
      i++;
      j++;
    }

    return 0;
  }
}

const updater = new Updater();
updater.tryToUpdate();
