import { Box, Typography, Tooltip } from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";

import { Server } from "@/types";

type ServerListItemNameProps = {
  server: Server;
};

export function ServerListItemName(props: ServerListItemNameProps) {
  const { server } = props;
  const connectionString = `mtasa://${server.ip}:${server.port}`;

  const isVIP = false;

  function getColor() {
    if (isVIP) {
      return "success.light";
    }

    if (server.passworded) {
      return "error.light";
    }

    return "text.primary";
  }

  const color = getColor();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        {server.passworded && (
          <Tooltip title="This server is password protected">
            <KeyIcon sx={{ color }} />
          </Tooltip>
        )}
        <Typography variant="body2" color={color}>
          {server.name}
        </Typography>
      </Box>
      <Typography variant="caption" color={color}>
        {connectionString}
      </Typography>
    </Box>
  );
}
