﻿import { Grid, Typography } from "@mui/material";

const NotFound = () => {
    return (
        <Grid item xs={12} container alignItems="center" justifyContent="center">
            <Typography textAlign="center" variant="h4">
                Status 404 - Nie znaleziono strony
            </Typography>
        </Grid>
    )
}

export default NotFound;