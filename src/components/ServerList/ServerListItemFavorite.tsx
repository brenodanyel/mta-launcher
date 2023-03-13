import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { Server } from "@/types";
import { useFavoritesStore } from '@/stores/favorites.store';

type ServerListItemFavoriteProps = {
  server: Server;
};

export function ServerListItemFavorite(props: ServerListItemFavoriteProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const { server } = props;

  const bool = isFavorite(server.ip, server.port);

  function handleClick() {
    bool
      ? removeFavorite(server.ip, server.port)
      : addFavorite(server.ip, server.port);
  }

  return (
    <IconButton onClick={() => handleClick()}>
      {bool ? <FavoriteIcon /> : <FavoriteBorder />}
    </IconButton>
  );
}
