import { Typography } from "@mui/material";

import { Server } from "@/types";
import { useEffect, useState } from "react";
import { apiAxiosInstance } from "@/services";

type ServerListItemPingProps = {
  server: Server;
};

export function ServerListItemPing(props: ServerListItemPingProps) {
  const { server } = props;
  const [ping, setPing] = useState<number | undefined>();

  return <Typography>{ping}</Typography>;
}
