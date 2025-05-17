import React, { useState } from "react";
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
import { accountingHeadCells, settlementsHeadCells } from "../../seed/table-headers";
import { authGetRequest, authPostRequest } from "../../services/api-service";
import { getAllAccountingTransactionsUrl, getAllPaymentRequestsByPaginationUrl } from "../../seed/url";
import { utils, writeFile } from "xlsx";
import dayjs from "dayjs";
import { MaterialUICustomTabs } from "../../components/MaterialUICustomTabs";
import { PlusOutlined } from "@ant-design/icons";
import RequestSettlementModal from "../../components/RequestSettlementModal";

const TABS = [
    { label: "Accounting", value: "Accounting" },
    { label: "Payment Settlements", value: "Payment Settlements" }
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
    const [settlements, setSettlements] = React.useState([]);
    const [, setSelectedData] = React.useState({});
    const [searchTerm, setSearchTerm] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);
    const paymentsIds = usePaymentsIds(payments);
    const paymentsSelection = useSelection(paymentsIds);
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [openSettlementModal, setOpenSettlementModal] = useState(false);

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

    const getSettlementsDataForExportExcel = () => {
        setExportExcel(true);
        authPostRequest(
            getAllPaymentRequestsByPaginationUrl,
            {
                query: searchTerm,
                status: currentTab,
                sort: orderBy + " " + order,
                limit: settlements.total_results,
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

    const getSettlements = React.useCallback(
        (page) => {
            setIsLoading(true);
            authPostRequest(
                getAllPaymentRequestsByPaginationUrl,
                {
                    query: searchTerm,
                    sort: orderBy + " " + order,
                    limit: rowsPerPage,
                    page: page,
                },
                (data) => {
                    setSettlements(data);
                    setIsLoading(false);
                },
                (error) => {
                    setSettlements({
                        page: 1,
                        total_results: 0,
                        total_pages: 0,
                        results: [],
                    });
                    setIsLoading(false);
                }
            );
        }, [order, orderBy, rowsPerPage, searchTerm]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    React.useEffect(() => {
        fetcher(1);
    }, [fetcher]);

    React.useEffect(() => {
        getSettlements(1);
    }, [getSettlements]);

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
            {openSettlementModal &&
                <RequestSettlementModal
                    open={openSettlementModal}
                    onClose={() => setOpenSettlementModal(false)}
                    getSettlements={getSettlements}
                    switchTab={() => {
                        setCurrentTab(TABS[1].value);
                    }}
                />
            }
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
                                    onClick={() => setOpenSettlementModal(true)}
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
                        {currentTab === TABS[0].value &&
                            <>
                                <CustomSearch
                                    handleSearch={handleSearch}
                                    exportExcel={exportExcel}
                                    getDataForExportExcel={getDataForExportExcel}
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
                            </>
                        }
                        {currentTab === TABS[1].value &&
                            <>
                                <CustomSearch
                                    handleSearch={handleSearch}
                                    exportExcel={exportExcel}
                                    getDataForExportExcel={getSettlementsDataForExportExcel}
                                />
                                <CustomTable
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    count={settlements.results.length}
                                    items={settlements.results}
                                    onPageChange={handlePageChange}
                                    onRowsPerPageChange={handleRowsPerPageChange}
                                    onSelectOne={paymentsSelection.handleSelectOne}
                                    onSelect={onSelect}
                                    page={1}
                                    rowsPerPage={rowsPerPage}
                                    selected={paymentsSelection.selected}
                                    headCells={settlementsHeadCells}
                                    popoverItems={contentPopoverItems}
                                    isLoading={isLoading}
                                />
                            </>
                        }
                    </Stack>
                </Container>
            </Box>
        </>
    );
}

export default Accounting;
