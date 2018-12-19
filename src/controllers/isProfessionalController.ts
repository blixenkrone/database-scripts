import { FirebaseService } from '../services/firebase-service';
// import _ from 'lodash';
import { database } from 'firebase-admin';

enum DataType { profiles = 'profiles' };
const Fb = new FirebaseService();

export const getDataFromFb = async () => {
    await Fb.getAllFbData(DataType.profiles)
        .then((res: database.DataSnapshot) => {
            const profiles: [] = res.val();
            sortByProfessional(profiles);
        })
}

const sortByProfessional = (profilesObj: any) => {
    const log = Object.entries(profilesObj)
        .forEach((val: any[]) => {
            val.filter((profile: any) => profile.isProfessional && profile.userId !== '');
            val.map((pro: any) => {
                if (pro.userId && pro.isProfessional) {
                    const arr: [] = pro;
                    setProfessionalsAsFalse(arr);
                }
            });
        });
}

const setProfessionalsAsFalse = (obj: {} | any) => {
    // Object.entries(obj).map(async ([key, val], idx: number) => {
    Object.entries(obj).map(([key, val], idx: number) => {
        if (key === 'isProfessional' && val) {
            const { userId, displayName, email } = obj;
            const data = { isProfessional: false };
            console.log(`Changing: ${userId} which is ${displayName} with email ${email} to amateur photograf...`)
            // const result = await Fb.updateDataFromID(DataType.profiles, userId, data);
        }
    })
}
