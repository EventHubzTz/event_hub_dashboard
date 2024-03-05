import React from 'react'
import Layout from '../../layouts/Layout';
import { Grid } from '@mui/material';
import { useAuth } from '../../hooks/use-auth';
import AdminOverview from './AdminOverview';
import EventPlannerOverview from './EventPlannerOverview';

function Dashboard() {
  const auth = useAuth();

  return (
    <Layout>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {auth?.user?.role === "SUPER_ADMIN" && <AdminOverview />}
        {auth?.user?.role === "EVENT_PLANNER" && <EventPlannerOverview />}
      </Grid>
    </Layout>
  )
}

export default Dashboard