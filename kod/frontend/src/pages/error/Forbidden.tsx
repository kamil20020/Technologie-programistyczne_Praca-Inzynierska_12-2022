﻿import { Grid, Typography } from "@mui/material";

const Forbidden = () => {
    return (
        <Grid item xs={12} container alignItems="center" justifyContent="center">
            <Typography textAlign="center" variant="h4">
                Status 403 - Brak dostępu do zasobu
            </Typography>
        </Grid>
    )
}

export default Forbidden;