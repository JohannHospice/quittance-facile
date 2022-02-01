import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import React from "react";
import { Box } from "@mui/system";

export default function ReceiptCard({ surtitle, title, subtitle, description, onClick }) {
  return (
    <Card variant="outlined">
      <Box position="relative">
        <CardActionArea onClick={onClick}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              {surtitle}
            </Typography>

            <Typography variant="h5" component="div">
              {title}
            </Typography>

            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {subtitle}
            </Typography>

            <Typography variant="body2">{description}</Typography>
          </CardContent>
        </CardActionArea>
      </Box>
    </Card>
  );
}
