export const headers = { 'event-hub-sign-auth': `${process.env.REACT_APP_KEY}`, }
export const contentTypeJson = { 'Content-Type': `application/json`, }
export const contentTypeFormData = { 'Content-Type': `multipart/form-data`, }
export const CREATE = "Create";
export const UPDATE = "Update";
export const userRoles = [
    { label: "All", value: "" },
    { label: "Normal Users", value: "NORMAL_USER" },
    { label: "Accountant", value: "ACCOUNTANT" },
    { label: "Event Planners", value: "EVENT_PLANNER" },
    { label: "Super Admins", value: "SUPER_ADMIN" }
]
export const paymentStatus = [
    { label: "All", value: "" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Pending", value: "PENDING" },
    { label: "Cancelled", value: "CANCELLED" }
]
export const capitalizeFirstLetter = (str) => {
    return str
        .replace(/_/g, ' ')
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
export function formatMoney(amount, currency = 'TZS') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
}
export function removeUnderscore(word) {
    return word.replace(/_/g, ' ');
}