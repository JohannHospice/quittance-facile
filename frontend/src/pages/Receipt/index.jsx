import { CircularProgress, Fab, Grid, Typography } from "@mui/material";
import { useState } from "react";
import Layout from "../../component/Layout";
import ReceiptCard from "../../component/ReceiptCard";
import { getReceipts } from "../../service/airtable/receipt";
import { Box } from "@mui/system";
import Add from "@mui/icons-material/Add";
import ReceiptDialog from "../../component/ReceiptDialog";
import useFetch from "../../hooks/useFetch";
import moment from "moment";

export default function ReceiptPage() {
  const { data: records, error, loading } = useFetch([], getReceipts);
  const [selected, setSelected] = useState();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);

  return (
    <Layout>
      <Box mb={3}>
        <Typography variant="h4">Les quittances</Typography>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {records.map((record, index) => (
            <Grid item xs={2} sm={4} md={4} key={index}>
              <ReceiptCard
                surtitle={
                  moment(record.data.on).format("DD/MM/YYYY") +
                  " - " +
                  moment(record.data.to).format("DD/MM/YYYY")
                }
                title={record.data.tenantName}
                subtitle={record.data.locationName}
                description={record.data.type}
                onClick={() => {
                  setSelected(record);
                  setOpen(true);
                  setEdit(false);
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <ReceiptDialog edit={edit} receipt={selected} open={open} onClose={() => setOpen(false)} />

      <Box position="fixed" bottom="72px" right={0} margin={3}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => {
            setSelected({ data: {} });
            setOpen(true);
            setEdit(true);
          }}
        >
          <Add />
        </Fab>
      </Box>
    </Layout>
  );
}
