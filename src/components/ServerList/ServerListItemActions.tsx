import { IconButton, CircularProgress } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReplayIcon from "@mui/icons-material/RestartAlt";
import { useServersList } from "@/hooks/useServersList";
import { Server } from "@/types";
import { Box } from "@mui/material";
import { useGameJoiner } from "@/hooks/useServerJoiner";
import { useState } from 'react';
import { useServerProfileStore } from '@/stores/server-profile.store';

type ServerListItemActionsProps = {
  server: Server;
};

export function ServerListItemActions(props: ServerListItemActionsProps) {
  const [refreshing, setRefreshing] = useState(false);
  const joinServer = useGameJoiner();

  const { fetchServer } = useServersList();
  const { fetchProfile } = useServerProfileStore();
  const { server } = props;

  async function handleRefresh() {
    setRefreshing(true);

    await Promise.allSettled([
      new Promise((resolve) => setTimeout(resolve, 1000)),
      fetchServer(server.ip, server.port),
      fetchProfile(server.ip, server.port),
    ]);

    setRefreshing(false);
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: "0.1rem",
      }}
    >
      <IconButton onClick={() => handleRefresh()} disabled={refreshing}>
        {
          refreshing
            ? <CircularProgress size="1em" />
            : <ReplayIcon />
        }
      </IconButton>
      <IconButton onClick={() => joinServer(server)}>
        <PlayArrowIcon />
      </IconButton>
    </Box>
  );
}
