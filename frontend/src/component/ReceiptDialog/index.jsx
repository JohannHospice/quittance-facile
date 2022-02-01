import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getLeases, ReceiptFields } from "../../service/airtable/receipt";
import CloseIcon from "@mui/icons-material/Close";
import useFetch from "../../hooks/useFetch";

export default function ReceiptDialog({ receipt, open, onClose, edit }) {
  const [isEditing, setIsEditing] = useState();

  // const getLeaseById = useCallback(() => {
  //   const lease = receipt?.data?.lease;
  //   if (lease?.length > 0) {
  //     return getLease(lease[0]);
  //   }
  //   return null;
  // }, [receipt?.id]);

  // const { data: lease, error, loading } = useFetch(undefined, getLeaseById);
  const {
    data: leases,
    error: leasesError,
    loading: leasesLoading,
  } = useFetch(undefined, getLeases);

  const spacing = 3;

  function handleEdit() {
    setIsEditing(true);
  }
  function handleSubmit() {
    setIsEditing(false);
  }

  useEffect(() => {
    setIsEditing(edit);
  }, [edit]);

  return (
    <Dialog fullWidth={true} maxWidth={"sm"} open={open} onClose={onClose}>
      <DialogTitle id="scroll-dialog-title">
        {isEditing ? "Edition de la " : "Lecture de la"} quittance
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={scroll !== "paper"}>
        {leasesLoading ? (
          <CircularProgress />
        ) : leasesError ? (
          leasesError
        ) : receipt ? (
          <Grid
            container
            spacing={spacing}
            sx={{
              "& .MuiTextField-root": { width: "100%" },
            }}
          >
            {leases && (
              <>
                <Grid item xs={12}>
                  <FormControl fullWidth disabled={!isEditing}>
                    <InputLabel>Bails</InputLabel>
                    <Select
                      value={receipt.data.lease?.length > 0 ? receipt.data.lease[0] : ""}
                      label="Bails"
                    >
                      {leases.map((lease, i) => (
                        <MenuItem value={lease.id} key={i}>
                          {lease.data.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Grid container spacing={spacing}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label={ReceiptFields.from}
                    disabled={!isEditing}
                    variant="outlined"
                    value={receipt.data.from}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label={ReceiptFields.to}
                    disabled={!isEditing}
                    variant="outlined"
                    value={receipt.data.to}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={ReceiptFields.type}
                disabled={!isEditing}
                variant="outlined"
                value={receipt.data.type}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={ReceiptFields.paidOn}
                disabled={!isEditing}
                variant="outlined"
                value={receipt.data.paidOn}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={spacing}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label={ReceiptFields.on}
                    disabled={!isEditing}
                    variant="outlined"
                    value={receipt.data.on}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label={ReceiptFields.at}
                    disabled={!isEditing}
                    variant="outlined"
                    value={receipt.data.at}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : undefined}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEdit} disabled={isEditing}>
          Modifier
        </Button>
        <Button onClick={handleSubmit} disabled={!isEditing}>
          Envoyer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
