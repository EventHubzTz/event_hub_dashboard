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
import { authGetRequest, authPostRequest } from "../../services/api-service";
import {
    addEventUrl,
    deleteEventUrl,
    getAllCategoriesUrl,
    getAllSubCategoriesUrl,
    getEventsUrl,
    updateEventUrl,
} from "../../seed/url";
import { CustomAlert } from "../../components/custom-alert";
import { FormDialog } from "../../components/form-dialog";
import { eventFormFields } from "../../seed/form-fields";
import { CameraOutlined, DeleteOutlined, EditOutlined, WalletOutlined, PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { formatDate } from "../../utils/date-formatter";
import dayjs from "dayjs";
import ViewEventMedia from "./ViewEventMedia";
import ViewPackages from "./ViewPackages";

const useContentsIds = (administrators) => {
    return React.useMemo(() => {
        return administrators.map((customer) => customer.id);
    }, [administrators]);
};

function Events() {
    const formInfo = useSelector((state) => state.FormInformationReducer);
    const [categories, setCategories] = React.useState([]);
    const [formFields, setFormFields] = React.useState(eventFormFields);
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
    const [openViewEventMediaDialog, setOpenViewEventMediaDialog] = React.useState(false);
    const [openViewEventPackageDialog, setOpenViewEventPackageDialog] = React.useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [severity, setSeverity] = React.useState("");
    const [severityMessage, setSeverityMessage] = React.useState("");
    const values = [
        {
            id: action === UPDATE ? selectedData.id : 0,
            event_name: action === UPDATE ? selectedData.event_name : "",
            event_location: action === UPDATE ? selectedData.event_location : "",
            event_time: action === UPDATE ? dayjs(formatDate(selectedData.event_time)) : null,
            event_description: action === UPDATE ? selectedData.event_description : "",
            event_capacity: action === UPDATE ? selectedData.event_capacity : "",
            event_entrance: action === UPDATE ? selectedData.event_entrance : "",
            event_category_id: action === UPDATE ? selectedData.event_category_id : "",
            event_sub_category_id: action === UPDATE ? selectedData.event_sub_category_id : "",
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
                getEventsUrl,
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

    const getAllSubCategories = React.useCallback((categoryId) => {
        authPostRequest(
            getAllSubCategoriesUrl,
            {
                id: categoryId
            },
            (data) => {
                const newProductsSubCategories = data.map((category) => {
                    const newItem = {};
                    ["label", "value"].forEach((item) => {
                        if (item === "label") {
                            newItem[item] = category.event_sub_category_name;
                        }
                        if (item === "value") {
                            newItem[item] = category.id;
                        }
                    });
                    return newItem;
                });
                let newFormFields = formFields;
                newFormFields[6].items = newProductsSubCategories;
                setFormFields(newFormFields);
                setIsLoading(false)
            },
            (error) => {
                let newFormFields = formFields;
                newFormFields[6].items = [];
                setFormFields(newFormFields);
                setIsLoading(false)
            },
        )
    }, [formFields])

    React.useEffect(() => {
        fetcher(1);
    }, [fetcher]);

    React.useEffect(() => {
        authGetRequest(
            getAllCategoriesUrl,
            (data) => {
                setCategories(data);
            },
            (error) => {
                setIsLoading(false);
            }
        )
    }, [])

    React.useEffect(() => {
        if (formInfo.event_category_id) {
            getAllSubCategories(formInfo?.event_category_id)
        }
    }, [formInfo, getAllSubCategories])

    React.useEffect(() => {
        if (categories.length > 0) {
            const newEventssCategories = categories.map((category) => {
                const newItem = {};
                ["label", "value"].forEach((item) => {
                    if (item === "label") {
                        newItem[item] = category.event_category_name;
                    }
                    if (item === "value") {
                        newItem[item] = category.id;
                    }
                });
                return newItem;
            });
            let newFormFields = formFields;
            newFormFields[5].items = newEventssCategories;
            setFormFields(newFormFields);
        }
    }, [categories, formFields])

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

    const handleClickOpenViewEventMediaDialog = () => {
        setOpenViewEventMediaDialog(true)
    }

    const handleCloseViewEventMediaDialog = () => {
        setOpenViewEventMediaDialog(false)
    }

    const handleClickOpenViewEventPackageDialog = () => {
        setOpenViewEventPackageDialog(true)
    }

    const handleCloseViewEventPackageDialog = () => {
        setOpenViewEventPackageDialog(false)
    }

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
            deleteEventUrl,
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
            id: 'media',
            label: 'Media',
            icon: <CameraOutlined />,
            onClick: () => {
                handleClickOpenViewEventMediaDialog()
            },
        },
        {
            id: 'packages',
            label: 'Packages',
            icon: <WalletOutlined />,
            onClick: () => {
                handleClickOpenViewEventPackageDialog()
            },
        },
        {
            id: "edit",
            label: "Edit",
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
                    dialogTitle={"Event"}
                    action={action}
                    fields={eventFormFields}
                    values={values}
                    url={
                        action === CREATE ? addEventUrl : updateEventUrl
                    }
                />
            )}
            {openViewEventMediaDialog &&
                <ViewEventMedia
                    open={openViewEventMediaDialog}
                    handleClose={handleCloseViewEventMediaDialog}
                    selected={selectedData}
                />
            }
            {openViewEventPackageDialog &&
                <ViewPackages
                    open={openViewEventPackageDialog}
                    handleClose={handleCloseViewEventPackageDialog}
                    selected={selectedData}
                />
            }
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
        </>
    );
}

export default Events;
