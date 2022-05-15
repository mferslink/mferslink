interface UserInfo {
    name: string;
    walletAddress: string;
    profileImage?: string;
    notifications?: number;
    lastNotificationTime: Date;
    profileImageRef?: string;
}
export {
    UserInfo
}