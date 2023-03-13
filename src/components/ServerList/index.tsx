import { useEffect, useState } from 'react';
import { useServersList } from '@/hooks/useServersList';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Box, IconButton, Tooltip, Typography, Dialog } from '@mui/material';
import { useMemo } from 'react';
import { Server } from '@/types';
import { ServerListItemActions } from './ServerListItemActions';
import { ServerListItemFavorite } from './ServerListItemFavorite';
import { ServerListItemName } from './ServerListItemName';
import { usePlayedServersStore } from '@/stores/playedServers.store';
import { useServerProfileStore } from '@/stores/server-profile.store';
import Info from '@mui/icons-material/Info';
import { ServerInfoDialog } from './ServerInfoDialog';
import moment from 'moment';

export function ServerList() {
  const [selectedServerToSeeInfo, setSelectedServerToSeeInfo] =
    useState<Server | null>(null);

  const { getPlayedDate } = usePlayedServersStore();

  const { fetchProfiles, getProfile } = useServerProfileStore();

  const { error, loading, servers, fetchServers } = useServersList();

  useEffect(() => {
    fetchServers();
    fetchProfiles();
  }, []);

  const rows: GridRowsProp = useMemo(
    () =>
      servers.map((server) => ({
        id: `${server.ip}:${server.port}`,
        ...server,
      })),
    [servers],
  );

  const columns: GridColDef[] = [
    {
      field: 'fav',
      headerName: 'Fav',
      width: 50,
      align: 'center',
      headerAlign: 'center',
      disableReorder: true,
      disableColumnMenu: true,
      disableExport: true,
      renderCell: (params) => {
        const server = params.row as Server;
        return <ServerListItemFavorite server={server} />;
      },
    },
    {
      field: 'icon',
      headerName: 'Icon',
      width: 60,
      align: 'center',
      headerAlign: 'center',
      disableReorder: true,
      disableColumnMenu: true,
      disableExport: true,
      renderCell: (params) => {
        const server = params.row as Server;
        const serverInfo = getProfile(server.ip, server.port);
        return (
          <img
            src={
              serverInfo?.logo
                ? serverInfo.logo
                : '/logo.png'}
            onError={({ currentTarget }) => {
              if (currentTarget.src === '/logo.png') {
                return;
              }
              currentTarget.src = '/logo.png';
            }}
            alt='Logo'
          />
        );
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      disableReorder: true,
      disableColumnMenu: true,
      disableExport: true,
      renderCell: (params) => {
        const server = params.row as Server;
        return <ServerListItemName server={server} />;
      },
    },
    {
      field: 'info',
      headerName: 'Info',
      width: 50,
      align: 'center',
      headerAlign: 'center',
      disableReorder: true,
      disableColumnMenu: true,
      disableExport: true,

      renderCell(params) {
        const server = params.row as Server;

        if (!getProfile(server.ip, server.port)) {
          return null;
        }

        return (
          <Tooltip title='See server informations'>
            <IconButton onClick={() => setSelectedServerToSeeInfo(server)}>
              <Info />
            </IconButton>
          </Tooltip>
        );
      },
    },
    {
      field: 'played',
      headerName: 'Played',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      disableReorder: true,
      disableColumnMenu: true,
      disableExport: true,
      valueGetter(params) {
        const server: Server = params.row;
        return getPlayedDate(server.ip, server.port);
      },

      valueFormatter(params) {
        if (!params.value) {
          return null;
        }

        return moment(params.value).fromNow();
      },

      renderCell(params) {
        if (!params.value) {
          return null;
        }

        return (
          <Tooltip title={new Date(params.value).toLocaleString()}>
            <Typography variant='body2'>{params.formattedValue}</Typography>
          </Tooltip>
        );
      },
    },
    {
      field: 'players',
      headerName: 'Players',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      disableReorder: true,
      disableColumnMenu: true,
      disableExport: true,
      valueGetter(params) {
        const server: Server = params.row;
        return `${server.playerCount}/${server.playerSlots}`;
      },
      sortComparator: (a, b) => {
        const [aPlayerCount] = a.split('/');
        const [bPlayerCount] = b.split('/');
        return Number(aPlayerCount) - Number(bPlayerCount);
      },
    },
    {
      field: 'ping',
      headerName: 'Ping',
      width: 75,
      align: 'center',
      headerAlign: 'center',
      disableReorder: true,
      disableColumnMenu: true,
      disableExport: true,
      hide: true,
      // renderCell: (params) => {
      //   const server = params.row as Server;
      //   return <ServerListItemPing server={server} />;
      // },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      disableReorder: true,
      disableColumnMenu: true,
      disableExport: true,
      renderCell: (params) => {
        const server = params.row as Server;
        return <ServerListItemActions server={server} />;
      },
    },
  ];

  if (error) {
    return <Typography>Error!</Typography>;
  }

  return (
    <Box
      sx={{
        height: '100%',
        flexGrow: '1',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ height: '100%', width: '100%' }}>
        <DataGrid
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
          }}
          loading={loading}
          rows={rows}
          columns={columns}
          // density="compact"
          onCellClick={(params, event) => {
            event.defaultMuiPrevented = true;
          }}
          disableSelectionOnClick
        />
      </Box>
      <Dialog
        open={!!selectedServerToSeeInfo}
        onClose={() => setSelectedServerToSeeInfo(null)}
        maxWidth='md'
        sx={{
          borderRadius: '28px',
          overflow: 'hidden',
        }}
      >
        {selectedServerToSeeInfo && (
          <ServerInfoDialog
            server={selectedServerToSeeInfo}
            setOpen={() => setSelectedServerToSeeInfo(null)}
          />
        )}
      </Dialog>
    </Box>
  );
}
