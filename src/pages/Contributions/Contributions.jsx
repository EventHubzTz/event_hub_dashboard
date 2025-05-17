import React from "react";
import {
    Box,
    Container,
    Stack,
    Typography,
} from "@mui/material";
import { useSelection } from "../../hooks/use-selection";
import { CustomTable } from "../../components/custom-table";
import { CustomSearch } from "../../components/custom-search";
import { contributionHeadCells } from "../../seed/table-headers";
import { paymentStatus } from "../../utils/constant";
import { authPostRequest } from "../../services/api-service";
import { getAllContributionTransactionsUrl } from "../../seed/url";
import { MaterialUICustomTabs } from "../../components/MaterialUICustomTabs";
import { utils, writeFile } from "xlsx";
import dayjs from "dayjs";

const usePaymentsIds = (payments) => {
    return React.useMemo(() => {
        return payments.map((customer) => customer.id);
    }, [payments]);
};

export const handleExport = (data) => {
    if (data.length > 0) {
        const newData = data.map((row, index) => {
            const newRow = {
                "S/No": index + 1,
                "Full Name": row?.ticket_owner,
                "Payment Number": row?.phone_number,
                "Location": `${row?.location} ${row?.location}`,
                "Amount": row?.amount,
                "Payment Status": row?.payment_status,
                "Date": row?.created_at,
            };
            return newRow;
        });
        data = newData;
        let headings = Object.keys(data[0]);
        const wb = utils.book_new();
        const ws = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, [headings]);
        utils.sheet_add_json(ws, data, { origin: "A2", skipHeader: true });
        utils.book_append_sheet(wb, ws, "Orders");
        writeFile(wb, `Pugu Marathon Contributions ${dayjs().format("YYYY-MM-DD HH:mm:ss")}.xlsx`);
    }
};

function Contributions() {
    const [exportExcel, setExportExcel] = React.useState(false);
    const [currentTab, setCurrentTab] = React.useState("");
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [payments, setAdministrators] = React.useState({
        page: 1,
        total_results: 0,
        total_pages: 0,
        results: [],
    });
    const [, setSelectedData] = React.useState({});
    const [searchTerm, setSearchTerm] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);
    const paymentsIds = usePaymentsIds(payments.results);
    const paymentsSelection = useSelection(paymentsIds);
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('id');

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const getDataForExportExcel = () => {
        setExportExcel(true);
        authPostRequest(
            getAllContributionTransactionsUrl,
            {
                query: searchTerm,
                status: currentTab,
                sort: orderBy + " " + order,
                limit: payments.total_results,
                page: 1,
            },
            (data) => {
                handleExport(data?.results);
                setExportExcel(false);
            },
            (error) => {
                setExportExcel(false);
            }
        );
    };

    const fetcher = React.useCallback(
        (page) => {
            setIsLoading(true);
            authPostRequest(
                getAllContributionTransactionsUrl,
                {
                    query: searchTerm,
                    status: currentTab,
                    sort: orderBy + " " + order,
                    limit: rowsPerPage,
                    page: page,
                },
                (data) => {
                    setAdministrators(data);
                    setIsLoading(false);
                },
                (error) => {
                    setAdministrators({
                        page: 1,
                        total_results: 0,
                        total_pages: 0,
                        results: [],
                    });
                    setIsLoading(false);
                }
            );
        },
        [rowsPerPage, searchTerm, orderBy, order, currentTab]
    );

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    React.useEffect(() => {
        fetcher(1);
    }, [fetcher]);

    const handlePageChange = React.useCallback(
        (event, value) => {
            fetcher(value + 1);
        },
        [fetcher]
    );

    const handleRowsPerPageChange = React.useCallback((event) => {
        setRowsPerPage(event.target.value);
    }, []);

    const onSelect = (data, openDialog) => {
        setSelectedData(data);
    };

    const contentPopoverItems = [];

    return (
        <>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    pt: 2,
                    pb: 8,
                }}
            >
                <Container maxWidth={false}>
                    <Stack spacing={3}>
                        <Stack direction="row" justifyContent="space-between" spacing={4}>
                            <Stack spacing={1}>
                                <Typography variant="h4">Contributions</Typography>
                            </Stack>
                        </Stack>
                        <MaterialUICustomTabs
                            activeTab={currentTab}
                            setActiveTab={setCurrentTab}
                            tabsData={paymentStatus}
                        />
                        <CustomSearch
                            handleSearch={handleSearch}
                            exportExcel={exportExcel}
                            getDataForExportExcel={getDataForExportExcel}
                        />
                        <CustomTable
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            count={payments.total_results}
                            items={payments.results}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onSelectOne={paymentsSelection.handleSelectOne}
                            onSelect={onSelect}
                            page={
                                payments.page >= 1
                                    ? payments.page - 1
                                    : payments.page
                            }
                            rowsPerPage={rowsPerPage}
                            selected={paymentsSelection.selected}
                            headCells={contributionHeadCells}
                            popoverItems={contentPopoverItems}
                            isLoading={isLoading}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    );
}

export default Contributions;
