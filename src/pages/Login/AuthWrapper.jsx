import React from 'react'
import { Avatar, Box, Grid, Typography } from '@mui/material'

// project import
import AuthCard from './AuthCard';
import AuthFooter from '../../components/cards/AuthFooter';

function AuthWrapper({ children }) {
    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Grid
                container
                direction="column"
                justifyContent="flex-end"
                sx={{
                    minHeight: '100vh'
                }}
            >
                <Grid display="flex" alignItems="center" item xs={12} sx={{ ml: 3, mt: 3 }}>
                    <Avatar alt='logo' src='/assets/images/logo.jpeg' />
                    <Typography variant='h3' sx={{ ml: 2 }}>Pugu Marathon</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid
                        item
                        xs={12}
                        container
                        justifyContent="center"
                        alignItems="center"
                        sx={{ minHeight: { xs: 'calc(100vh - 134px)', md: 'calc(100vh - 112px)' } }}
                    >
                        <Grid item>
                            <AuthCard>{children}</AuthCard>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                    <AuthFooter />
                </Grid>
            </Grid>
        </Box>
    )
}

export default AuthWrapper