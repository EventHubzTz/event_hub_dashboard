import React from 'react'
import { Box, Button, Grid, Skeleton, Typography } from '@mui/material'
import AnalyticEcommerce from '../../components/cards/statistics/AnalyticEcommerce';
import { authPostRequest } from '../../services/api-service';
import { getDashboardStatisticsUrl } from '../../seed/url';
import { formatMoney } from '../../utils/constant';
import { CustomPopOver } from '../../components/custom-popover';
import { usePopover } from '../../hooks/use-popover';
import dayjs from 'dayjs';
import { CalendarOutlined, DownOutlined } from '@ant-design/icons';

function AdminOverview() {
    const popOver = usePopover();
    const [isLoading, setIsLoading] = React.useState(true);
    const [dashboardData, setDashboardData] = React.useState({
        total_users: 0,
        total_events: 0,
        total_amount: 0
    });
    const [body, setBody] = React.useState({
        "from": dayjs().startOf("year"),
        "to": dayjs(),
    });

    const handleBodyChange = (newValue, key) => {
        setBody({ ...body, [key]: newValue, })
    }

    const getProductsOrdersStatistics = React.useCallback(
        () => {
            setIsLoading(true)
            authPostRequest(
                getDashboardStatisticsUrl,
                {
                    from: body.from.format('YYYY-MM-DD HH:mm:ss.SSS'),
                    to: body.to.format('YYYY-MM-DD HH:mm:ss.SSS'),
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
        [body]
    )

    React.useEffect(() => {
        getProductsOrdersStatistics()
    }, [getProductsOrdersStatistics]);

    return (
        <>
            <CustomPopOver
                id={popOver.id}
                anchorEl={popOver.anchorRef}
                open={popOver.open}
                onClose={popOver.handleClose}
                showDates={true}
                from={body.from}
                to={body.to}
                handleBodyChange={handleBodyChange}
            />
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        mb: 3,
                    }}
                >
                    <Typography sx={{ mr: "auto" }} variant="h5">Dashboard</Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            border: 1,
                            borderColor: '#bfbfbf'
                        }}
                    >
                        <Button
                            sx={{
                                color: "grey"
                            }}
                            variant='text'
                            startIcon={
                                <CalendarOutlined />
                            }
                            endIcon={
                                <DownOutlined />
                            }
                            onClick={(event) => {
                                popOver.handleOpen(event)
                            }}
                        >
                            {`${body.from.format('MMMM D, YYYY HH:mm:ss')} - `}
                            {`${body.to.format('MMMM D, YYYY HH:mm:ss')}`}
                        </Button>
                    </Box>
                </Box>
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
                        <AnalyticEcommerce title="Total Users" count={dashboardData.total_users} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <AnalyticEcommerce title="Total Events" count={dashboardData.total_events} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <AnalyticEcommerce title="Total Sales" count={formatMoney(dashboardData.total_amount)} percentage={100} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <AnalyticEcommerce title="Agregator Collection" count={formatMoney(dashboardData.agregator_collection)} percentage={3} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <AnalyticEcommerce title="System Collection" count={formatMoney(dashboardData.system_collection)} percentage={3} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <AnalyticEcommerce title="Remained Collection" count={formatMoney(dashboardData.remained_collection)} percentage={94} />
                    </Grid>
                </>
            }
        </>
    )
}

export default AdminOverview