import { useRef } from "react";
import { useConfirm, ConfirmOptions } from "material-ui-confirm";
import { Box, TextField, Typography } from "@mui/material";
import { TextFieldProps } from "@mui/material/TextField";

export function usePrompt() {
  const confirm = useConfirm();
  const ref = useRef<HTMLInputElement>(null);

  return (
    options?: ConfirmOptions & { textFieldProps?: TextFieldProps }
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      confirm({
        ...options,
        confirmationButtonProps: {
          ...options?.confirmationButtonProps,
          variant: "contained",
          color: "primary",
        },
        cancellationButtonProps: {
          ...options?.confirmationButtonProps,
          variant: "contained",
          color: "error",
        },
        description: (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1em",
            }}
          >
            {options?.description}
            <TextField
              inputRef={ref}
              fullWidth
              size="small"
              {...options?.textFieldProps}
            />
          </Box>
        ),
      })
        .then(() => resolve(String(ref.current?.value)))
        .catch(reject);
    });
  };
}
