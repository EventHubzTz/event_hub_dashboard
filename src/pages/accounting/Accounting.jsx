import React from "react";
import {
    Box,
    Button,
    Container,
    Stack,
    Typography,
} from "@mui/material";
import { useSelection } from "../../hooks/use-selection";
import { CustomTable } from "../../components/custom-table";
import { CustomSearch } from "../../components/custom-search";
import { accountingHeadCells } from "../../seed/table-headers";
import { authGetRequest } from "../../services/api-service";
import { getAllAccountingTransactionsUrl } from "../../seed/url";
import { utils, writeFile } from "xlsx";
import dayjs from "dayjs";
import { MaterialUICustomTabs } from "../../components/MaterialUICustomTabs";
import { PlusOutlined } from "@ant-design/icons";

const TABS = [
    { label: "Accounting", value: "Accounting" },
    { label: "Payment Requests", value: "Payment Requests" }
];
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
                "Full Name": row?.full_name,
                "Payment Number": row?.phone_number,
                "Channel": row?.provider,
                "Amount": row?.amount,
                "Credit": row?.credit,
                "Debit": row?.debit,
                "Balance": row?.balance,
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
        writeFile(wb, `Pugu Marathon Accounting ${dayjs().format("YYYY-MM-DD HH:mm:ss")}.xlsx`);
    }
};

function Accounting() {
    const [currentTab, setCurrentTab] = React.useState(TABS[0].value);
    const [exportExcel, setExportExcel] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [payments, setPayments] = React.useState([]);
    const [, setSelectedData] = React.useState({});
    const [, setSearchTerm] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);
    const paymentsIds = usePaymentsIds(payments);
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
        authGetRequest(
            getAllAccountingTransactionsUrl,
            (data) => {
                handleExport(data);
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
            authGetRequest(
                getAllAccountingTransactionsUrl,
                (data) => {
                    setPayments(data);
                    setIsLoading(false);
                },
                (error) => {
                    setPayments({
                        page: 1,
                        total_results: 0,
                        total_pages: 0,
                        results: [],
                    });
                    setIsLoading(false);
                }
            );
        },
        []
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
                                <Typography variant="h4">Accounting</Typography>
                            </Stack>
                            <div>
                                <Button
                                    startIcon={
                                        <PlusOutlined />
                                    }
                                    variant="contained"
                                    sx={{
                                        color: "neutral.100",
                                    }}
                                >
                                    Request Settlement
                                </Button>
                            </div>
                        </Stack>
                        <MaterialUICustomTabs
                            activeTab={currentTab}
                            setActiveTab={setCurrentTab}
                            tabsData={TABS}
                        />
                        <CustomSearch
                            handleSearch={handleSearch}
                            exportExcel={exportExcel}
                            getDataForExportExcel={getDataForExportExcel}
                            selectedItems={paymentsSelection}
                        />
                        <CustomTable
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            count={payments.length}
                            items={payments}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onSelectOne={paymentsSelection.handleSelectOne}
                            onSelect={onSelect}
                            page={1}
                            rowsPerPage={rowsPerPage}
                            selected={paymentsSelection.selected}
                            headCells={accountingHeadCells}
                            popoverItems={contentPopoverItems}
                            isLoading={isLoading}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    );
}

export default Accounting;
