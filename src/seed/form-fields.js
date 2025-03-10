export const userFormFields = [
    { name: "first_name", type: "text", label: "First Name", notRequired: false, minimumCharacters: 3 },
    { name: "last_name", type: "text", label: "Last Name", notRequired: false, minimumCharacters: 3 },
    { name: "email", type: "email", label: "Email", notRequired: false, minimumCharacters: 3 },
    { name: "phone_no", type: "text", label: "Phone Number (2557xxxxxxxx)", notRequired: false, minimumCharacters: 3 },
    {
        name: "gender",
        type: "select",
        label: "Gender",
        items: [
            { value: 'MALE', label: "MALE", },
            { value: 'FEMALE', label: "FEMALE", },
        ],
        notRequired: false,
        minimumCharacters: 3
    },
    { name: "password", type: "password", label: "Password", notRequired: false, minimumCharacters: 6 },
    {
        name: "role",
        type: "select",
        label: "Role",
        items: [
            { value: 'EVENT_PLANNER', label: "EVENT PLANNER", },
            { value: 'SUPER_ADMIN', label: "SUPER ADMIN", },
        ],
        notRequired: false,
        minimumCharacters: 3
    },
]

export const categoriesFormFields = [
    { name: "event_category_name", type: "text", label: "Category Name", notRequired: false, minimumCharacters: 3 },
    { name: "event_category_color", type: "color", label: "Category Color", notRequired: false, minimumCharacters: 3 },
    { name: "image", type: "file", label: "Category Image", notRequired: false, minimumCharacters: 3 },
]

export const subCategoriesFormFields = [
    { name: "event_sub_category_name", type: "text", label: "Sub Category Name", notRequired: false, minimumCharacters: 3 },
    { name: "image", type: "file", label: "Category Image", notRequired: false, minimumCharacters: 3 },
]

export const eventFormFields = [
    { name: "event_name", type: "text", label: "Event Name", notRequired: false, minimumCharacters: 3 },
    { name: "event_location", type: "text", label: "Event Location", notRequired: false, minimumCharacters: 3 },
    { name: "event_time", type: "dateTime", label: "Event Time", notRequired: false, minimumCharacters: 3 },
    { name: "event_description", type: "text", label: "Event Description", notRequired: false, minimumCharacters: 3 },
    { name: "event_capacity", type: "number", label: "Event Capacity", notRequired: false, minimumCharacters: 1 },
    { name: "event_category_id", type: "select", label: "Event Category", items: [], notRequired: false, minimumCharacters: 1 },
    { name: "event_sub_category_id", type: "select", label: "Event Sub Category", items: [], notRequired: false, minimumCharacters: 1 },
]

export const eventPackagesFormFields = [
    { name: "package_name", type: "text", label: "Package Name", notRequired: false, minimumCharacters: 3 },
    { name: "amount", type: "number", label: "Amount", notRequired: false, minimumCharacters: 3 },
]

export const regionFormFields = [
    { name: "region_name", type: "text", label: "Region Name", notRequired: false, minimumCharacters: 3 },
]

export const dekaniaFormFields = [
    { name: "dekania_name", type: "text", label: "Dekania Name", notRequired: false, minimumCharacters: 3 },
]