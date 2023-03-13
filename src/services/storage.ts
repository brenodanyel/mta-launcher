import { fs, path } from '@tauri-apps/api';

export class Store {
  private dir = fs.BaseDirectory.AppCache;

  constructor(
    private name: string
  ) {
  };

  async getAll() {
    if (!await fs.exists(this.name, { dir: this.dir })) {
      await fs.writeTextFile(this.name, '{}', { dir: this.dir });
    }

    const all = await fs.readTextFile(this.name, { dir: this.dir });
    try {
      return JSON.parse(all);
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  async get<T>(key: string, _default: T): Promise<T> {
    const all = await this.getAll();
    return all[key] ?? _default;
  }

  async set(key: string, value: any) {
    const all = await this.getAll();
    all[key] = value;

    console.log(all);

    await fs.writeTextFile(this.name, JSON.stringify(all, null, 2), { dir: this.dir });

    const localPath = await path.appCacheDir();
    console.log(`saved ${this.name} into ${localPath}`);
  }

  public async debug() {
    console.log(this.name, await path.appCacheDir());
  }
}
