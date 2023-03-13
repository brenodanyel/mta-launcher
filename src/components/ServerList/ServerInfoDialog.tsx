import { open } from '@tauri-apps/api/shell';
import { Server } from "@/types";
import { Box, Button, Link, Paper, Stack, Typography } from "@mui/material";
import { useServerProfileStore } from '@/stores/server-profile.store';
import ReplyIcon from "@mui/icons-material/Reply";
import { useGameJoiner } from "@/hooks/useServerJoiner";
import MuiMarkdown from "mui-markdown";
import { useConfirm } from 'material-ui-confirm';

type ServerInfoDialogProps = {
  server: Server;
  setOpen: (open: boolean) => void;
};

export function ServerInfoDialog(props: ServerInfoDialogProps) {
  const confirm = useConfirm();

  const joinServer = useGameJoiner();
  const { getProfile } = useServerProfileStore();
  const { setOpen, server } = props;

  function handleConnect() {
    setOpen(false);
    joinServer(server);
  }

  const profile = getProfile(server.ip, server.port);

  if (!profile) {
    return null;
  }

  return (
    <Paper
      sx={{
        padding: '1.5em',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100vh',
        gap: '1em',
      }}
      elevation={0}
      variant="outlined"
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5em',
          }}
        >
          <Box>
            <Typography variant='h6'>{server.name}</Typography>
            <Typography variant='caption'>
              mtasa://{profile.ip}:{profile.port}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: '0.5em',
            }}
          >
            {profile.externalLinks.map((link) => (
              <Button
                key={link.id}
                variant="outlined"
                size="small"
                startIcon={<ReplyIcon />}
                onClick={() => {
                  confirm({
                    title: `Open external link?`,
                    content: (
                      <Stack>
                        <Typography>Are you sure you want to open "{link.name}"?</Typography>
                        <Typography variant="caption">(you will be redirected to "{link.url}")</Typography>
                      </Stack>
                    ),
                    confirmationText: "Open Link",
                    confirmationButtonProps: { variant: 'contained' },
                    cancellationButtonProps: { variant: 'contained', color: "error" }
                  })
                    .then(() => {
                      open(link.url);
                    })
                    .catch(() => { });
                }}
              >
                {link.name}
              </Button>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            width: '128px',
            height: '128px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0.5em',
          }}
        >
          <img
            src={
              profile.logo
                ? profile.logo
                : '/logo.png'
            }
            onError={({ currentTarget }) => {
              if (currentTarget.src === "/logo.png") {
                return;
              }
              currentTarget.src = "/logo.png";
            }}
            alt="Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '10px',
            }}
          />
        </Box>
      </Box>
      <Paper
        sx={{
          overflow: 'hidden',
          padding: '0.5em',
          flexGrow: 1,
        }}
        elevation={0}
        variant="outlined"
      >
        <Box sx={{
          height: '100%',
          padding: '0.5em',
          overflow: 'auto',
        }}>
          <MuiMarkdown
            options={{
              overrides: {
                iframe: { component: 'div', props: { hidden: true } },
                a: { component: Link, props: { href: null } },
                h1: {
                  component: Typography,
                  props: { variant: 'h1', fontSize: '2.5em' },
                },
                h2: {
                  component: Typography,
                  props: { variant: 'h2', fontSize: '2em' },
                },
                h3: {
                  component: Typography,
                  props: { variant: 'h3', fontSize: '1.75em' },
                },
                h4: {
                  component: Typography,
                  props: { variant: 'h4', fontSize: '1.5em' },
                },
                h5: {
                  component: Typography,
                  props: { variant: 'h5', fontSize: '1.25em' },
                },
                h6: {
                  component: Typography,
                  props: { variant: 'h6', fontSize: '1em' },
                },
              },
            }}
          >
            {profile.description}
          </MuiMarkdown>
        </Box>
      </Paper>

      <Box
        sx={{
          mt: 'auto',
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.5em",
        }}
      >
        <Button variant="contained" color="error" onClick={() => {
          setOpen(false);
        }}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={() => {
          handleConnect();
        }}>
          Play
        </Button>
      </Box>
    </Paper >
  );
}
