import React from 'react'
import { Grid, Skeleton, Typography } from '@mui/material'
import AnalyticEcommerce from '../../components/cards/statistics/AnalyticEcommerce';
import { authPostRequest } from '../../services/api-service';
import { getDashboardStatisticsUrl } from '../../seed/url';
import { formatMoney } from '../../utils/constant';

function EventPlannerOverview() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [dashboardData, setDashboardData] = React.useState({
        total_users: 0,
        total_events: 0,
        total_amount: 0
    });

    const getProductsOrdersStatistics = React.useCallback(
        () => {
            authPostRequest(
                getDashboardStatisticsUrl,
                {
                    from: "body.from.format('YYYY-MM-DD HH:mm:ss.SSS')",
                    to: "body.to.format('YYYY-MM-DD HH:mm:ss.SSS')",
                },
                (data) => {
                    setDashboardData(data);
                    setIsLoading(false)
                },
                (error) => {
                    setIsLoading(false)
                },
            )
        },
        []
    )

    React.useEffect(() => {
        getProductsOrdersStatistics()
    }, [getProductsOrdersStatistics]);

    return (
        <>
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Typography variant="h4">Dashboard</Typography>
            </Grid>
            {isLoading &&
                <>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <Skeleton variant='rectangular' height={130} />
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <Skeleton variant='rectangular' height={130} />
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <Skeleton variant='rectangular' height={130} />
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <Skeleton variant='rectangular' height={130} />
                    </Grid>
                </>
            }
            {!isLoading &&
                <>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <AnalyticEcommerce title="Total Events" count={dashboardData.total_events} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <AnalyticEcommerce title="Total Sales" count={formatMoney(dashboardData.total_amount)} />
                    </Grid>
                </>
            }
        </>
    )
}

export default EventPlannerOverview