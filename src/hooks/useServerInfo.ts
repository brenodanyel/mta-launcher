import { axiosInstance } from '@/services';
import { useServerInfoStore } from '@/stores/serverInfo.store';
import { infoType } from '@/stores/serverInfo.store';

export function useServerInfo() {
  const { info, updateAllInfo, updateInfo } = useServerInfoStore();

  function getServerInfo(ip: string, port: number) {
    return info[`${ip}:${port}`] || null;
  }

  async function refreshAllServersInfo() {
    try {
      const { data } = await axiosInstance({
        url: '/server-info',
        method: 'get',
      });

      const result = data.reduce((acc: infoType, curr: any) => {
        acc[`${curr.ip}:${curr.port}`] = {
          description: curr.description,
          externalLinks: curr.externalLinks,
          logo: curr.logo,
        };
        return acc;
      }, {});

      updateAllInfo(result);

    } catch (e) {
      console.log(e);
    }
  }

  async function refreshServerInfo(ip: string, port: number) {
    try {
      const { data } = await axiosInstance({
        url: `/server-info/${ip}/${port}`,
        method: 'get',
        params: { ip, port },
      });

      // updateInfo(ip, port, data);
    } catch (e) {
      console.log(e);
    }
  }

  return {
    getServerInfo,
    refreshAllServersInfo,
    refreshServerInfo,
  };
}
