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
import { otherPaymentHeadCells } from "../../seed/table-headers";
import { CREATE, UPDATE } from "../../utils/constant";
import { authPostRequest } from "../../services/api-service";
import {
    addOtherPaymentUrl,
    getAllOtherPaymentsByPaginationUrl,
    updateOtherPaymentUrl,
} from "../../seed/url";
import { FormDialog } from "../../components/form-dialog";
import { otherPaymentsFormFields } from "../../seed/form-fields";
import { PlusOutlined } from "@ant-design/icons";
import { utils, writeFile } from "xlsx";
import dayjs from "dayjs";

const useContentsIds = (administrators) => {
    return React.useMemo(() => {
        return administrators.map((customer) => customer.id);
    }, [administrators]);
};

export const handleExport = (data) => {
    if (data.length > 0) {
        const newData = data.map((row, index) => {
            const newRow = {
                "S/No": index + 1,
                "Full Name": row?.full_name,
                "Payment Number": row?.phone_number,
                "Age": row?.age,
                "Distance": row?.distance,
                "Location": `${row?.region_name} ${row?.location}`,
                "T Shirt Size": row?.t_shirt_size,
                "Amount": row?.amount,
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
        writeFile(wb, `Pugu Marathon Payments ${dayjs().format("YYYY-MM-DD HH:mm:ss")}.xlsx`);
    }
};

function OtherPayments() {
    const [exportExcel, setExportExcel] = React.useState(false);
    const [action, setAction] = React.useState(CREATE);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [administrators, setAdministrators] = React.useState({
        page: 1,
        total_results: 0,
        total_pages: 0,
        results: [],
    });
    const [selectedData, setSelectedData] = React.useState({});
    const [searchTerm, setSearchTerm] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);
    const administratorsIds = useContentsIds(administrators.results);
    const adminSelection = useSelection(administratorsIds);
    const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
    const values = [
        {
            id: action === UPDATE ? selectedData.id : 0,
            full_name: action === UPDATE ? selectedData.full_name : "",
            phone_number: action === UPDATE ? selectedData.phone_number : "",
            age: action === UPDATE ? selectedData.age : "",
            distance: action === UPDATE ? selectedData.distance : "",
            region: action === UPDATE ? selectedData.region : "",
            location: action === UPDATE ? selectedData.location : "",
            t_shirt_size: action === UPDATE ? selectedData.t_shirt_size : "",
            amount: action === UPDATE ? selectedData.amount : 0,
        },
    ];
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
            getAllOtherPaymentsByPaginationUrl,
            {
                query: searchTerm,
                sort: orderBy + " " + order,
                limit: administrators.total_results,
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
                getAllOtherPaymentsByPaginationUrl,
                {
                    query: searchTerm,
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
        [rowsPerPage, searchTerm, orderBy, order]
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

    const handleClickOpenCreateDialog = () => {
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        action === UPDATE ? fetcher(administrators.page) : fetcher(1);
        setOpenCreateDialog(false);
        setAction(CREATE);
    };

    const onSelect = (data, openDialog) => {
        setSelectedData(data);
    };

    const contentPopoverItems = [];

    return (
        <>
            {openCreateDialog && (
                <FormDialog
                    open={openCreateDialog}
                    handleClose={handleCloseCreateDialog}
                    dialogTitle={"Other Payments"}
                    action={action}
                    fields={otherPaymentsFormFields}
                    values={values}
                    url={
                        action === CREATE ? addOtherPaymentUrl : updateOtherPaymentUrl
                    }
                />
            )}
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
                                <Typography variant="h4">Other Payments</Typography>
                            </Stack>
                            <div>
                                <Button
                                    onClick={handleClickOpenCreateDialog}
                                    startIcon={
                                        <PlusOutlined />
                                    }
                                    variant="contained"
                                    sx={{
                                        color: "neutral.100",
                                    }}
                                >
                                    Add
                                </Button>
                            </div>
                        </Stack>
                        <CustomSearch
                            handleSearch={handleSearch}
                            exportExcel={exportExcel}
                            getDataForExportExcel={getDataForExportExcel}
                        />
                        <CustomTable
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            count={administrators.total_results}
                            items={administrators.results}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onSelectOne={adminSelection.handleSelectOne}
                            onSelect={onSelect}
                            page={
                                administrators.page >= 1
                                    ? administrators.page - 1
                                    : administrators.page
                            }
                            rowsPerPage={rowsPerPage}
                            selected={adminSelection.selected}
                            headCells={otherPaymentHeadCells}
                            popoverItems={contentPopoverItems}
                            isLoading={isLoading}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    );
}

export default OtherPayments;
