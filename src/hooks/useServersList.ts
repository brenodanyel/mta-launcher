import { useCallback, useState } from 'react';
import { Server } from '@/types';
import { apiAxiosInstance } from '@/services';
import { useServersStore } from '@/stores/servers.store';
import { useFiltersStore } from '@/stores/filters.store';
import { usePlayedServersStore } from '@/stores/playedServers.store';
import { useFavoritesStore } from '@/stores/favorites.store';
import { useServerProfileStore } from '@/stores/server-profile.store';

export function useServersList() {
  const filters = useFiltersStore();
  const { getProfile } = useServerProfileStore();
  const { isFavorite } = useFavoritesStore();
  const { getPlayedDate } = usePlayedServersStore();
  const { servers, replace, replaceSingleServer } = useServersStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchServers = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await apiAxiosInstance<Server[]>({
        url: '/servers',
        method: 'get'
      });

      const sorted = data
        .filter(server => !server.version.includes('n'))
        .sort((a, b) => b.playerCount - a.playerCount);

      replace(sorted);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchServer = useCallback(async (ip: string, port: number) => {
    try {
      setLoading(true);

      const { data } = await apiAxiosInstance({
        url: '/server',
        method: 'get',
        params: {
          ip,
          asePort: port + 123,
        }
      });

      const server = data as Server;

      replaceSingleServer(server);

    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  function applyFilters() {
    const filtered = servers.filter((server) => {
      if (filters.name && !server.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }

      if (filters.showFavoritesOnly && !isFavorite(server.ip, server.port)) {
        return false;
      }

      if (filters.playedOn && !getPlayedDate(server.ip, server.port)) {
        return false;
      }

      if (filters.notPasswordProtected && server.passworded) {
        return false;
      }

      if (filters.sponsoring && !getProfile(server.ip, server.port)) {
        return false;
      }

      return true;
    });

    return filtered;
  }

  return {
    servers: applyFilters(),
    loading,
    error,
    fetchServers,
    fetchServer,
  };
}
