//LIVE SERVER BASE URLs
// export const eventHubServiceUrl = "https://service.tuzozatamthilia.info"

//TEST BED BASE URLs
export const eventHubServiceUrl = "https://service.tuzozatamthilia.info"

//LOCAL SERVER BASE URLs
// export const eventHubServiceUrl = "http://192.168.1.142:3009"

//USER MANAGEMENT URLs
export const loginByEmailPhoneUrl = `${eventHubServiceUrl}/api/v1/login/user`
export const getAllUsersByRoleUrl = `${eventHubServiceUrl}/api/v1/get/users`
export const getUserUrl = `${eventHubServiceUrl}/api/v1/get/user`
export const registerUserByRoleUrl = `${eventHubServiceUrl}/api/v1/register/user`
export const enableDisableUserUrl = `${eventHubServiceUrl}/api/enable/disable/user`
export const changePasswordUrl = `${eventHubServiceUrl}/api/v1/change/password`
export const deleteUserUrl = `${eventHubServiceUrl}/api/v1/delete/user`

//CATEGORY MANAGEMENT URLs
export const createCategoryUrl = `${eventHubServiceUrl}/api/v1/create/event/category`
export const getAllCategoriesUrl = `${eventHubServiceUrl}/api/v1/get/all/event/categories`
export const getAllCategoriesByPaginationUrl = `${eventHubServiceUrl}/api/v1/get/all/event/categories/by/pagination`
export const updateCategoryUrl = `${eventHubServiceUrl}/api/v1/update/event/category`
export const deleteCategoryUrl = `${eventHubServiceUrl}/api/v1/delete/event/category`

//SUB-CATEGORY MANAGEMENT URLs
export const createSubCategoryUrl = `${eventHubServiceUrl}/api/v1/create/event/subcategory`
export const getAllSubCategoriesUrl = `${eventHubServiceUrl}/api/v1/get/all/event/subcategories`
export const getAllSubCategoriesByPaginationUrl = `${eventHubServiceUrl}/api/v1/get/all/event/subcategories/by/pagination`
export const updateSubCategoryUrl = `${eventHubServiceUrl}/api/v1/update/event/subcategory`
export const deleteSubCategoryUrl = `${eventHubServiceUrl}/api/v1/delete/event/subcategory`

//EVENT MANAGEMENT URLs
export const addEventUrl = `${eventHubServiceUrl}/api/v1/add/event`
export const addEventImageUrl = `${eventHubServiceUrl}/api/v1/add/event/image`
export const getEventsUrl = `${eventHubServiceUrl}/api/v1/get/events`
export const getEventUrl = `${eventHubServiceUrl}/api/v1/get/event`
export const updateEventUrl = `${eventHubServiceUrl}/api/v1/update/event`
export const deleteEventImageUrl = `${eventHubServiceUrl}/api/v1/delete/event/image`
export const deleteEventUrl = `${eventHubServiceUrl}/api/v1/delete/event`
export const getDashboardStatisticsUrl = `${eventHubServiceUrl}/api/v1/get/dashboard/statistics`

//EVENT PACKAGES MANAGEMENT URLs
export const addEventPackageUrl = `${eventHubServiceUrl}/api/v1/add/event/package`
export const getEventPackagesUrl = `${eventHubServiceUrl}/api/v1/get/event/packages`
export const updateEventPackageUrl = `${eventHubServiceUrl}/api/v1/update/event/package`
export const deleteEventPackageUrl = `${eventHubServiceUrl}/api/v1/delete/event/package`

//PAYMENT URLs
export const getAllPaymentTransactionsUrl = `${eventHubServiceUrl}/api/v1/get/payment/transaction`

//REGIONS MANAGEMENT URLs
export const createRegionUrl = `${eventHubServiceUrl}/api/v1/add/region`
export const getAllRegionsUrl = `${eventHubServiceUrl}/api/v1/get/all/regions`
export const getAllRegionsByPaginationUrl = `${eventHubServiceUrl}/api/v1/get/all/regions/by/pagination`
export const updateRegionUrl = `${eventHubServiceUrl}/api/v1/update/region`
export const deleteRegionUrl = `${eventHubServiceUrl}/api/v1/delete/region`

//DEKANIA MANAGEMENT URLs
export const createDekaniaUrl = `${eventHubServiceUrl}/api/v1/add/dekania`
export const getAllDekaniaUrl = `${eventHubServiceUrl}/api/v1/get/all/dekania`
export const getAllDekaniaByPaginationUrl = `${eventHubServiceUrl}/api/v1/get/all/dekania/by/pagination`
export const updateDekaniaUrl = `${eventHubServiceUrl}/api/v1/update/dekania`
export const deleteDekaniaUrl = `${eventHubServiceUrl}/api/v1/delete/dekania`