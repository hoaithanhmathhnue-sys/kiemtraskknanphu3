/**
 * VIP Accounts Data
 * Danh sách tài khoản VIP - Mỗi account 1 dòng để dễ thêm/sửa
 * 
 * Cấu trúc: { username: string, password: string, displayName?: string }
 */

export interface VIPAccount {
    username: string;
    password: string;
    displayName?: string;
    isTrial?: boolean;
}

// ============ DANH SÁCH TÀI KHOẢN VIP ============
// Thêm mỗi tài khoản 1 dòng theo format: { username: "...", password: "...", displayName: "..." },

// ============ TÀI KHOẢN DÙNG THỬ ============
export const TRIAL_ACCOUNT: VIPAccount = {
    username: "ANPHU3",
    password: "Anphu3",
    displayName: "Dùng Thử",
    isTrial: true
};

export const VIP_ACCOUNTS: VIPAccount[] = [
    TRIAL_ACCOUNT,
    { username: "vothituyetmai1203@gmail.com", password: "admin123", displayName: "Quản trị viên" },
    { username: "skknanphu3@gmail.com", password: "Anphu3", displayName: "GV" }
];

// ============ HÀM XÁC THỰC ============

export const authenticateUser = (username: string, password: string): VIPAccount | null => {
    const account = VIP_ACCOUNTS.find(
        acc => acc.username === username && acc.password === password
    );
    return account || null;
};

// Lưu trạng thái đăng nhập vào localStorage
export const saveLoginState = (account: VIPAccount) => {
    localStorage.setItem('vip_user', JSON.stringify({
        username: account.username,
        displayName: account.displayName || account.username,
        loginTime: new Date().toISOString()
    }));
};

export const getLoggedInUser = (): { username: string; displayName: string } | null => {
    const data = localStorage.getItem('vip_user');
    if (data) {
        try {
            return JSON.parse(data);
        } catch {
            return null;
        }
    }
    return null;
};

export const logout = () => {
    localStorage.removeItem('vip_user');
};

// ============ HÀM DÙNG THỬ ============

export const isTrialAccount = (username: string): boolean => {
    return username === TRIAL_ACCOUNT.username;
};

export const hasUsedTrial = (): boolean => {
    return localStorage.getItem('trial_used') === 'true';
};

export const markTrialUsed = (): void => {
    localStorage.setItem('trial_used', 'true');
};



















































































































































































