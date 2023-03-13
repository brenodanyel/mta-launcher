import { ReactNode } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ConfirmProvider } from "material-ui-confirm";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

type MUIWrapperProps = {
  children: ReactNode;
};

const globalStyles = (
  <GlobalStyles
    styles={{
      img: {
        maxWidth: "100%",
      },
      "*::-webkit-scrollbar": {
        width: "8px",
      },
      "*::-webkit-scrollbar-track": {
        background: "#ffffff",
      },
      "*::-webkit-scrollbar-thumb": {
        background: "#90caf9",
        borderRadius: "8px",
      },
    }}
  />
);

export function MUIWrapper(props: MUIWrapperProps) {
  const { children } = props;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ConfirmProvider>
        {globalStyles}
        {children}
      </ConfirmProvider>
    </ThemeProvider>
  );
}
