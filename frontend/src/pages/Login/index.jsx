import { Button, Card, CardContent, Container, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useUser } from "../../providers/LoginProvider";

export default function LoginPage() {
  const { login } = useUser();
  const [key, setKey] = useState();
  const [base, setBase] = useState();

  function handleClick() {
    login({ key, base });
  }

  return (
    <Box
      height={"100vh"}
      bgcolor={"primary.main"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Container maxWidth={"sm"} fullWidth>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h4">Connexion</Typography>
            <Typography variant="body1">
              Saisissez votre clée d&apos;api airtable pour acceder à vos quittances
            </Typography>
            <TextField
              id="airtable-key"
              label="Clée d'api airtable"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={(e) => setKey(e.target.value)}
            />
            <TextField
              id="airtable-base"
              label="Clée d'api airtable"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={(e) => setBase(e.target.value)}
            />
            <Box mt={2}>
              <Button variant="contained" onClick={handleClick}>
                Se connecter
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
