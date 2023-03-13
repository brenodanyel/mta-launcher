import { invoke } from '@tauri-apps/api';
import { Command } from '@tauri-apps/api/shell';
import { XMLParser } from 'fast-xml-parser';

export class MTAConfig {
  private regPath = "(Get-ItemProperty -Path 'HKLM:/SOFTWARE/WOW6432Node/Multi Theft Auto: San Andreas All/1.5').'Last Install Location'";
  private mtaPath = '';

  constructor(
    private xmlParser = new XMLParser()
  ) {
    this.exec();
  }

  private async exec() {
    await this.findMTAInstallationPath();
  }

  private async findMTAInstallationPath() {
    try {
      const { stdout } = await new Command('find-mta-installation', this.regPath).execute();

      if (!stdout) {
        throw new Error();
      }

      this.mtaPath = stdout.replaceAll('\r', '').replaceAll('\\', '/');

    } catch (e) {
      console.log(e);
    }
  }

  public async readConfigFile() {
    if (!this.mtaPath) return {};

    try {
      const res = await invoke('read_config_file', { path: `${this.mtaPath}/MTA/config/coreconfig.xml` }) as string;
      const parsed = this.xmlParser.parse(res);
      return parsed?.mainconfig?.settings;
    } catch (e) {
      console.log(e);
      return {};
    }
  }
};
