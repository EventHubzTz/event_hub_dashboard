import React from 'react'
import { Grid } from '@mui/material';
// import { useAuth } from '../../hooks/use-auth';
import AdminOverview from './AdminOverview';
// import EventPlannerOverview from './EventPlannerOverview';

function Dashboard() {
  // const auth = useAuth();

  return (
    <>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <AdminOverview />
        {/* {auth?.user?.role === "EVENT_PLANNER" && <EventPlannerOverview />} */}
      </Grid>
    </>
  )
}

export default Dashboard