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
import { eventHeadCells } from "../../seed/table-headers";
import { ConfirmationDialog } from "../../components/confirmation-dialog";
import { CREATE, UPDATE } from "../../utils/constant";
import { authPostRequest } from "../../services/api-service";
import {
    deleteAccountUrl,
    registerUserByRoleUrl,
} from "../../seed/url";
import { CustomAlert } from "../../components/custom-alert";
import { FormDialog } from "../../components/form-dialog";
import { eventFormFields } from "../../seed/form-fields";
import Layout from "../../layouts/Layout";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

const useContentsIds = (administrators) => {
    return React.useMemo(() => {
        return administrators.map((customer) => customer.id);
    }, [administrators]);
};

function Events() {
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
    const [isDeleting, setIsDeleting] = React.useState(false);
    const administratorsIds = useContentsIds(administrators.results);
    const adminSelection = useSelection(administratorsIds);
    const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [severity, setSeverity] = React.useState("");
    const [severityMessage, setSeverityMessage] = React.useState("");
    const values = [
        {
            id: action === UPDATE ? selectedData.id : 0,
            event_name: action === UPDATE ? selectedData.event_name : "",
            event_location: action === UPDATE ? selectedData.event_location : "",
            event_time: action === UPDATE ? selectedData.event_time : "",
            event_description: action === UPDATE ? selectedData.event_description : "",
        },
    ];
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('id');

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const fetcher = React.useCallback(
        (page) => {
            setIsLoading(true);
            authPostRequest(
                "",
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

    const handleClickOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const onSelect = (data, openDialog) => {
        setSelectedData(data);
    };

    const handleClickAlert = () => {
        setOpenAlert(true);
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenAlert(false);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        authPostRequest(
            deleteAccountUrl,
            {
                user_id: selectedData.id,
            },
            (data) => {
                fetcher(administrators.page);
                setSeverityMessage(data.message);
                setSeverity("success");
                handleClickAlert();
                setIsDeleting(false);
                handleCloseDeleteDialog();
            },
            (error) => {
                if (error?.response?.data?.message) {
                    setSeverityMessage(error.response.data.message[0]);
                    setSeverity("error");
                    handleClickAlert();
                }
                setIsDeleting(false);
            }
        );
    };

    const contentPopoverItems = [
        {
            id: "edit",
            label: "Edit Event",
            icon: (
                <EditOutlined />
            ),
            onClick: () => {
                setAction(UPDATE);
                handleClickOpenCreateDialog();
            },
        },
        {
            id: "delete",
            label: "Delete",
            icon: (
                <DeleteOutlined />
            ),
            onClick: () => {
                handleClickOpenDeleteDialog();
            },
        },
    ];

    return (
        <Layout>
            {openAlert && (
                <CustomAlert
                    openAlert={openAlert}
                    handleCloseAlert={handleCloseAlert}
                    severity={severity}
                    severityMessage={severityMessage}
                />
            )}
            {openCreateDialog && (
                <FormDialog
                    open={openCreateDialog}
                    handleClose={handleCloseCreateDialog}
                    dialogTitle={"Event"}
                    action={action}
                    fields={eventFormFields}
                    values={values}
                    url={registerUserByRoleUrl}
                />
            )}
            {openDeleteDialog && (
                <ConfirmationDialog
                    open={openDeleteDialog}
                    handleClose={handleCloseDeleteDialog}
                    handleAction={handleDelete}
                    isPerformingAction={isDeleting}
                    dialogTitle={"Delete Alert"}
                    dialogContentText={"Are you sure you want to delete this event?"}
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
                                <Typography variant="h4">Events</Typography>
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
                        <CustomSearch handleSearch={handleSearch} />
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
                            headCells={eventHeadCells}
                            popoverItems={contentPopoverItems}
                            isLoading={isLoading}
                        />
                    </Stack>
                </Container>
            </Box>
        </Layout>
    );
}

export default Events;
