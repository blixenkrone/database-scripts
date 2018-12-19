export interface IProfileData {
    displayName: string;
    // uid?: string;F
    userId: string;
    userData: [{ val: string, key: string | null }];
    email: string;
    loginDate?: Date | number;
    isActiveUser?: boolean;
    isAnonymous?: boolean;
    age?: number;
}
