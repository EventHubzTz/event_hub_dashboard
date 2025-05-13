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
import { usersHeadCells } from "../../seed/table-headers";
import { ConfirmationDialog } from "../../components/confirmation-dialog";
import { CREATE, userRoles } from "../../utils/constant";
import { authPostRequest } from "../../services/api-service";
import {
    deleteUserUrl,
    enableDisableUserUrl,
    getAllUsersByRoleUrl,
    registerUserByRoleUrl,
} from "../../seed/url";
import { CustomAlert } from "../../components/custom-alert";
import { FormDialog } from "../../components/form-dialog";
import { userFormFields } from "../../seed/form-fields";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { MaterialUICustomTabs } from "../../components/MaterialUICustomTabs";

const useContentsIds = (administrators) => {
    return React.useMemo(() => {
        return administrators.map((customer) => customer.id);
    }, [administrators]);
};

function Users() {
    const [currentTab, setCurrentTab] = React.useState(userRoles[0].value);
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
    const [isSubmitting, setSubmitting] = React.useState(false);
    const values = [
        {
            first_name: "",
            last_name: "",
            email: "",
            phone_no: "",
            gender: "",
            password: "",
            role: "SUPER_ADMIN",
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
                getAllUsersByRoleUrl,
                {
                    role: currentTab,
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
        [rowsPerPage, searchTerm, orderBy, order, currentTab]
    );

    const enableDisableUser = (data) => {
        if (!isSubmitting) {
            setSubmitting(true);
            adminSelection.handleSelectOne(data);
            authPostRequest(
                enableDisableUserUrl,
                {
                    user_id: data.id,
                    status: data.status === "ACTIVE" ? "DISABLED" : "ACTIVE",
                },
                (data) => {
                    fetcher(administrators.page);
                    setSubmitting(false);
                },
                (error) => {
                    if (error?.response?.data?.message) {
                        setSeverityMessage(error.response.data.message[0]);
                        setSeverity("error");
                        handleClickAlert();
                    }
                    setSubmitting(false);
                }
            );
        }
    };

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
        fetcher(1);
        setOpenCreateDialog(false);
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
            deleteUserUrl,
            {
                id: selectedData.id,
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
        <>
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
                    dialogTitle={"Administrator"}
                    action={CREATE}
                    fields={userFormFields}
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
                    dialogContentText={"Are you sure you want to delete this user?"}
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
                                <Typography variant="h4">Users</Typography>
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
                        <MaterialUICustomTabs
                            activeTab={currentTab}
                            setActiveTab={setCurrentTab}
                            tabsData={userRoles}
                        />
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
                            headCells={usersHeadCells}
                            popoverItems={contentPopoverItems}
                            isLoading={isLoading}
                            switchFunction={enableDisableUser}
                            isSubmitting={isSubmitting}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    );
}

export default Users;
