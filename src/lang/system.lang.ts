export class SystemLang {
    private static texts = {
        messages: {
            vi: {
                welcome: 'Chào mừng bạn!',
                error: 'Đã xảy ra lỗi!',
                not_found: 'Không tìm thấy trang!',
                unauthorized: 'Bạn không có quyền truy cập!',
                forbidden: 'Truy cập bị từ chối!',
                success: 'Thành công!',
                loading: 'Đang tải...',
                please_wait: 'Vui lòng chờ...',
                invalid_input: 'Dữ liệu nhập không hợp lệ!',
                server_error: 'Lỗi máy chủ, vui lòng thử lại sau!',
                connection_lost: 'Mất kết nối, kiểm tra lại mạng!',
                try_again: 'Vui lòng thử lại!',
                logout_success: 'Bạn đã đăng xuất thành công!',
                login_required: 'Vui lòng đăng nhập để tiếp tục!',
                save_success: 'Lưu thành công!',
                delete_confirm: 'Bạn có chắc chắn muốn xóa?',
                update_success: 'Cập nhật thành công!',
                no_data: 'Không có dữ liệu để hiển thị!',
            },
            en: {
                welcome: 'Welcome!',
                error: 'An error occurred!',
                not_found: 'Page not found!',
                unauthorized: 'You are not authorized!',
                forbidden: 'Access denied!',
                success: 'Success!',
                loading: 'Loading...',
                please_wait: 'Please wait...',
                invalid_input: 'Invalid input!',
                server_error: 'Server error, please try again later!',
                connection_lost: 'Connection lost, check your network!',
                try_again: 'Please try again!',
                logout_success: 'You have successfully logged out!',
                login_required: 'Please log in to continue!',
                save_success: 'Saved successfully!',
                delete_confirm: 'Are you sure you want to delete?',
                update_success: 'Updated successfully!',
                no_data: 'No data available!',
            },
        },
        labels: {
            vi: {
                notification: 'Thông báo',
                warning: 'Cảnh báo',
                error: 'Lỗi',
                success: 'Thành công',
                info: 'Thông tin',
                confirm: 'Xác nhận',
                loading: 'Đang tải',
                processing: 'Đang xử lý',
            },
            en: {
                notification: 'Notification',
                warning: 'Warning',
                error: 'Error',
                success: 'Success',
                info: 'Information',
                confirm: 'Confirmation',
                loading: 'Loading',
                processing: 'Processing',
            },
        },
    };

    // default lang is VIỆT NAM
    private static lang = process.env.PUBLIC_NEXT_LANG === 'en' ? 'en' : 'vi';

    /** ✅ Lấy text từ messages hoặc labels */
    static getText<T extends keyof typeof SystemLang.texts>(type: T, key: keyof (typeof SystemLang.texts)[T]['vi']): string {
        return SystemLang.texts[type][SystemLang.lang][key] ?? `Missing ${type}: ${String(key)}`;
    }

    /** ✅ Trả về text từ custom object, fallback nếu không có */
    static getCustomText(texts: { vi?: string; en?: string }, fallbackType: keyof typeof SystemLang.texts = 'messages'): string {
        return texts[SystemLang.lang] || Object.values(texts)[0] || SystemLang.getText(fallbackType, 'error');
    }
}
