import { Request, Response, NextFunction } from 'express';
import { FirebaseService } from '../services/firebase-service';
import { PDFService } from '../services/pdf-service';
import { IProfileData } from 'models/users';
import { database } from 'firebase-admin';
import _ from 'lodash';
/**
 * @param req parameter from the userId
 * @param res responds with the pdf?
 */
export const get = (req: Request, res: Response, next: NextFunction) => {
    const Fb = new FirebaseService();
    const userId = req.params.uid;
    const type = req.params.type;
    console.log(userId)
    Fb.getDataByUID(type, userId)
        .then(async (snapshot) => {
            if (!snapshot) { return res.sendStatus(404) }
            const profileData: IProfileData = {
                displayName: snapshot.val().displayName,
                email: snapshot.val().email,
                userData: await getUserData(snapshot),
                userId,
            }
            // console.log(profileData)
            await initPDF(profileData);
            res.send(profileData);
            next();
        })
}

const initPDF = (data: IProfileData) => {
    const fileName: string = data.displayName;
    try {
        const PDFWriter = new PDFService(data);
        const PDF = PDFWriter.createNewPdf(fileName);
        return PDF;
    } catch (err) {
        console.log(`Error: ${err} creating pdf.`);
    }
}

const getUserData = async (data$: database.DataSnapshot) => {
    const userData: [{ key: string | null, val: any }] = [] as any;
    data$.forEach((val$: database.DataSnapshot) => {
        userData.push({
            key: val$.key,
            val: val$.val(),
        });
        return false;
    })
    return await modifiedArr(userData);
}

const modifiedArr = async (userData: [{ key: string | null, val: any }]) => {
    Object.entries(userData).forEach(([fbkey, fbvalues], fbindex) => {
        if (typeof (fbvalues.val) === 'object') {
            Object.entries(fbvalues.val).forEach(([k, v], index) => userData.push({ key: k, val: v }))
            for (let i = userData.length - 1; i--;) {
                const element = userData[i];
                if (element.key === fbvalues.key) {
                    const deleted = userData.splice(i, 1);
                    console.log(`Deleted items:`, deleted);
                }
            }
        }
        // userData.sort((a: any, b: any) => a.val - b.val);
        userData.reverse();
    })
    return userData;
}
