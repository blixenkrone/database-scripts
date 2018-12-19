import * as admin from 'firebase-admin';
import { environment } from '../environments/config';
import { ErrorRequestHandler } from 'express';
import _ from 'lodash';
const env = environment();

export class FirebaseService {
    private db: admin.database.Database;

    constructor() {
        this.initializeApp();
        this.db = admin.database();
    }

    public initializeApp() {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: env.fbAdminConfig.projectId,
                clientEmail: env.fbAdminConfig.clientEmail,
                privateKey: env.fbAdminConfig.privateKey,
            }),
            databaseURL: env.fbAdminConfig.databaseURL,
        })
    }

    public getDataByUID = async (type: string, uid: string): Promise<admin.database.DataSnapshot> => {
        try {
            return await this.db.ref(`${env.environment}/${type}`).child(uid)
                .once('value', (snapshot) => snapshot, (err: ErrorRequestHandler) => err)
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    /**
     * @param type is what object inside parent obj
     * @param objectId is what the name of each child inside {type} object
     */
    public getDataByRef = async (type: string, objectId: string) => {
        try {
            return await this.db.ref(`${env.environment}/${type}/${objectId}`)
                .child(objectId)
                .once('value', (snapshot) => snapshot, (err: ErrorRequestHandler) => err)
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    /**
     * @param type what path to navigate to
     * @param ref reference in Firebase (objectID)
     */
    public getDataByRefArray = async (type: string, refs: string[]) => {
        return _.each(refs, (val) => {
            try {
                const result = this.db.ref(`${env.environment}/${type}`)
                    .child(val)
                    .once('value',
                        (snap: admin.database.DataSnapshot) => snap.val(),
                        (err: Error) => console.log(err));
                return result;
            } catch (error) {
                throw new Error(error);
            }
        })
    }

    /**
     * @param type what path to navigate to
     * @param ref reference in Firebase
     */
    public deleteDataByRef = (type: string, ref: string) => {
        return this.db.ref(`${env.environment}/${type}`)
            .child(ref)
            .remove((complete) => complete)
    }

    public getAllFbData = async (type: string): Promise<admin.database.DataSnapshot> => {
        return await this.db.ref(`${env.environment}/${type}`)
            .once('value', (snapshot) => snapshot, (err: ErrorRequestHandler) => err)
    }

    public updateDataFromID = async (type: string, id: string, data: {}) => {
        return await this.db.ref(`${env.environment}/${type}`)
            .child(id)
    }

    public postDataByUID = async (uid: string, data: any): Promise<admin.database.DataSnapshot> => {
        return await this.db.ref('users').child(uid)
            .once('value', (snapshot) => snapshot, (err: ErrorRequestHandler) => err)
    }

    public deleteUserFromFbAdmin = async (uid: string) => {
        try {
            return await admin.auth().deleteUser(uid);
        } catch (e) {
            return e;
        }
    }

}
