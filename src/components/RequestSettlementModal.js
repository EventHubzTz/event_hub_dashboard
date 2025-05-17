import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authPostRequest } from '../services/api-service';
import { addPaymentRequestUrl, getAllUsersByRoleUrl, requestOTPUrl, verifyOTPUrl } from '../seed/url';
import { userRoles } from '../utils/constant';

function RequestSettlementModal({ open, onClose, getSettlements, switchTab }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [users, setUsers] = useState();

    const formik = useFormik({
        initialValues: {
            full_name: '',
            account_number: '',
            bank_name: '',
            amount: '',
            otp: '',
        },
        validationSchema: Yup.object({
            full_name: Yup.string().required('Full Name is required'),
            account_number: Yup.string().required('Account Number is required'),
            bank_name: Yup.string().required('Bank Name is required'),
            amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
            otp: Yup.string().required('OTP is required').optional(),
        }),
        onSubmit: (values) => {
            // handle submit
            if (currentStep === 0) {
                authPostRequest(
                    requestOTPUrl,
                    {
                        phone_number: users[0].phone_no
                    },
                    () => {
                        setCurrentStep(1);
                    },
                    () => { },
                );
                return;
            }
            authPostRequest(
                verifyOTPUrl,
                {
                    phone_number: users[0].phone_no,
                    otp: values.otp
                },
                () => {
                    authPostRequest(
                        addPaymentRequestUrl,
                        values,
                        () => {
                            getSettlements();
                            switchTab();
                            onClose();
                        },
                        () => { },
                    );
                },
                () => { },
            );
        },
    });

    const fetchAccountants = React.useCallback(
        (page) => {
            authPostRequest(
                getAllUsersByRoleUrl,
                {
                    role: userRoles[2].value,
                    sort: "id asc",
                    limit: 1,
                    page: page,
                },
                (data) => {
                    setUsers(data.results);
                },
                () => { }
            );
        }, []);

    React.useEffect(() => {
        fetchAccountants();
    }, [fetchAccountants]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"sm"}>
            <DialogTitle>Request Settlement</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    {currentStep === 0 &&
                        <>
                            <TextField
                                margin="dense"
                                id="full_name"
                                name="full_name"
                                label="Full Name"
                                fullWidth
                                value={formik.values.full_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.full_name && Boolean(formik.errors.full_name)}
                                helperText={formik.touched.full_name && formik.errors.full_name}
                            />
                            <TextField
                                margin="dense"
                                id="account_number"
                                name="account_number"
                                label="Account Number"
                                fullWidth
                                value={formik.values.account_number}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.account_number && Boolean(formik.errors.account_number)}
                                helperText={formik.touched.account_number && formik.errors.account_number}
                            />
                            <TextField
                                margin="dense"
                                id="bank_name"
                                name="bank_name"
                                label="Account Number"
                                fullWidth
                                value={formik.values.bank_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.bank_name && Boolean(formik.errors.bank_name)}
                                helperText={formik.touched.bank_name && formik.errors.bank_name}
                            />
                            <TextField
                                margin="dense"
                                id="amount"
                                name="amount"
                                label="Amount"
                                type="number"
                                fullWidth
                                value={formik.values.amount}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.amount && Boolean(formik.errors.amount)}
                                helperText={formik.touched.amount && formik.errors.amount}
                            />
                        </>
                    }
                    {currentStep === 1 &&
                        <>
                            <TextField
                                margin="dense"
                                id="otp"
                                name="otp"
                                label="OTP Number"
                                fullWidth
                                value={formik.values.otp}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.otp && Boolean(formik.errors.otp)}
                                helperText={formik.touched.otp && formik.errors.otp}
                            />
                        </>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default RequestSettlementModal