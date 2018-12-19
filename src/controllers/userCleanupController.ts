import { IProfileData } from '../models/users';
import { FirebaseService, HubspotService } from '../services/index';

const Fb = new FirebaseService();
const Hs = new HubspotService();
enum DataType { profiles = 'profiles', profileData = 'profileData' };
const yearAgoUnix = 1481459153000;

const sortInactiveUsers = async (): Promise<IProfileData[]> => {
    console.log('Sorting inactive users..')
    try {
        const data$ = await Fb.getAllFbData(DataType.profiles);
        const allProfiles = Object.entries(data$.val());
        for (const key in allProfiles) {
            const profiles = allProfiles
                .map((val, idx) => val[1] as IProfileData)
                .filter((value: IProfileData, idx: number) => {
                    return shouldBeDeleted(value, idx);
                })
            console.log('Done sorting profiles. Returning.');
            return profiles;
        }
        return [];
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}

/**
 * @param profiles Sorted profileData[] interface
 * Uncomment this to do magic
 */
const deleteUsersByUID = async (profiles: IProfileData[]) => {
    const userProps: string[][] = profiles.map((p: IProfileData) => [p.userId, p.email]);
    console.log(`Users # matched conditions: ${userProps.length}`);
    if (userProps) {
        for (const props of userProps) {
            const uid = props[0];
            const email = props[1];
            try {
                // const profileDataDel = await Fb.deleteDataByRef(DataType.profileData, uid);
                // const profileDel = await Fb.deleteDataByRef(DataType.profiles, uid);
                // const authProfileDel = await Fb.deleteUserFromFbAdmin(uid);
                // const hsContactVID = await Hs.getContactVidByEmail(email);
                // console.log(hsContactVID);
                // const hsDeleteContact = await Hs.deleteContactByVID(hsContactVID);
                // console.log(hsDeleteContact);
                // authProfileDel ? console.log(`${authProfileDel}`, `Uid: ${uid}`) : (() => '')();
                // console.log(`Deleted profile ${uid} in db!`)
            } catch (error) {
                throw new Error(error);
            }
        }
        return 'Done with script';
    }
}

const shouldBeDeleted = (profileObj: IProfileData, index: number): boolean => {
    const { age, loginDate, userId, isActiveUser, isAnonymous, displayName } = profileObj;
    return userId === '' || !isActiveUser || isAnonymous || (loginDate ? loginDate < yearAgoUnix : false) && age !== 27;
}

export const initiateDelete = async () => {
    console.log(`Deletion started :DDDD`)
    const inActiveUsers = await sortInactiveUsers();
    const deletedUsers = await deleteUsersByUID(inActiveUsers);
    Promise.all([inActiveUsers, deletedUsers])
        .then(async ([getting, deleting]) => {
            console.log(deleting);
        })
}
