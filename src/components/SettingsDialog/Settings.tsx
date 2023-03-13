import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { useSettingsStore } from '@/stores/settings.store';
import { useState } from 'react';

type SettingsProps = {
  setOpen: (open: boolean) => void;
};

export function Settings(props: SettingsProps) {
  const { setOpen } = props;

  const settingsStore = useSettingsStore();

  const [localState, setLocalState] =
    useState<typeof settingsStore>(settingsStore);

  async function handleSave() {
    await settingsStore.updateNickname(localState.nickname);
    await settingsStore.updateUseRichPresence(localState.useRichPresence);
    setOpen(false);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      onReset={() => setOpen(false)}
    >
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ paddingTop: '0.5em' }}>
          <TextField
            fullWidth
            size='small'
            label='Nickname'
            value={localState.nickname}
            onChange={(e) =>
              setLocalState((s) => ({ ...s, nickname: e.target.value }))
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={localState.useRichPresence}
                onChange={(e) =>
                  setLocalState((s) => ({
                    ...s,
                    useRichPresence: e.target.checked,
                  }))
                }
              />
            }
            label='Enable Discord Rich Presence'
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='error' type='reset'>
          Cancel
        </Button>
        <Button variant='contained' color='primary' type='submit'>
          Save
        </Button>
      </DialogActions>
    </form>
  );
}
