import { forwardRef } from "react";
import { Dialog, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Settings } from "./Settings";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type SettingsDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function SettingsDialog(props: SettingsDialogProps) {
  const { open, setOpen } = props;

  function handleClose() {
    setOpen(false);
  }

  return (
    <Dialog open={open} TransitionComponent={Transition} onClose={handleClose}>
      <Settings setOpen={setOpen} />
    </Dialog>
  );
}
