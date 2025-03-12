export const formatDate = (dateString) => {
    const options = {
        // weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    };

    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB', options).replace(/\//g, '-');

    return formattedDate;
};

export const convertDateFormat = (dateString) => {
    const [day, month, year] = dateString.split('/');
    const convertedDate = `${month}/${day}/${year}`;
    return convertedDate;
};

export const formatDateForExcel = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB');

    return formattedDate;
};