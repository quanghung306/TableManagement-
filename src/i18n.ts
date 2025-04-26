import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    loading: "Loading...",
    loadingDataPleaseWait: "Loading data, please wait!",
    errorLoadingData: "Error loading data!",
    oops: "Oops...",
    pleaseEnterCompleteInfo: "Please enter complete information!",
    updateSuccessfully: "Updated successfully!",
    addedSuccessfully: "Added successfully!",
    cantSaveItem: "Can't save item!",
    failedToDelete: "Failed to delete!",
    noItemsSelected: "No items selected!",
    areYouSure: "Are you sure?",
    deleteItemsConfirm: "Delete {count} items? This action cannot be undone!",
    delete: "Delete!",
    cancel: "Cancel",
    deleting: "Deleting...",
    pleaseWaitWhileDeleting: "Please wait while deleting items!",
    deletedSuccessfully: "Deleted successfully!",
    somethingWentWrong: "Something went wrong",
    language_selector:"language has been converted"
  },
  vi: {
    loading: "Đang tải...",
    loadingDataPleaseWait: "Đang tải dữ liệu, vui lòng chờ!",
    errorLoadingData: "Tải dữ liệu thất bại!",
    oops: "Ôi không...",
    pleaseEnterCompleteInfo: "Vui lòng nhập đầy đủ thông tin!",
    updateSuccessfully: "Cập nhật thành công!",
    addedSuccessfully: "Thêm mới thành công!",
    cantSaveItem: "Không thể lưu dữ liệu!",
    failedToDelete: "Xóa thất bại!",
    noItemsSelected: "Chưa chọn mục nào!",
    areYouSure: "Bạn chắc chắn?",
    deleteItemsConfirm: "Xóa {count} mục? Hành động này không thể hoàn tác!",
    delete: "Xóa!",
    cancel: "Hủy",
    deleting: "Đang xóa...",
    pleaseWaitWhileDeleting: "Vui lòng đợi trong khi xóa!",
    deletedSuccessfully: "Xóa thành công!",
    somethingWentWrong: "Đã xảy ra lỗi",
    language_selector:"Ngôn ngữ đã được chuyển đổi  "
  }
};


const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})

export default i18n
