import {
  Box,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
} from '@mui/material';
import RestartIcon from '@mui/icons-material/RestartAlt';

import { useFiltersStore } from '@/stores/filters.store';

export function Filters() {
  const filters = useFiltersStore();

  return (
    <Box
      sx={{
        width: '15em',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5em',
      }}
    >
      <Typography variant='h5'>Filters</Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.1em',
        }}
      >
        <TextField
          fullWidth
          size='small'
          label='Server Name'
          value={filters.name}
          onChange={(e) => filters.updateFilter('name', e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.showFavoritesOnly}
              onChange={(e) =>
                filters.updateFilter('showFavoritesOnly', e.target.checked)
              }
            />
          }
          label='Show favorites only'
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.playedOn}
              onChange={(e) =>
                filters.updateFilter('playedOn', e.target.checked)
              }
            />
          }
          label='Played on'
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.notPasswordProtected}
              onChange={(e) =>
                filters.updateFilter('notPasswordProtected', e.target.checked)
              }
            />
          }
          label='Is not password protected'
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.sponsoring}
              onChange={(e) =>
                filters.updateFilter('sponsoring', e.target.checked)
              }
            />
          }
          label='Sponsoring'
        />
      </Box>
      <Button
        variant='contained'
        onClick={filters.resetFilters}
        startIcon={<RestartIcon />}
      >
        Reset
      </Button>
    </Box>
  );
}
