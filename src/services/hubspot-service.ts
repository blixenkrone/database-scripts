
import Hubspot from 'hubspot';
import { IHubspotContact } from 'models/hubspot';
import { environment } from '../environments/config';
const env = environment();

const hubspot = new Hubspot({ apiKey: env.hubSpotApiKey });

export class HubspotService {

    constructor() { }

    public deleteContactByVID = (id: number) => hubspot.contacts.delete(id);

    public getContactVidByEmail = async (email: string) => {
        if (email !== undefined) {
            try {
                return await hubspot.contacts.getByEmail(email)
                    .then((user: IHubspotContact) => user.vid)

            } catch (error) {
                console.log(`Error: ${error.message}\n`, `Email: ${email}`)
            }
        } else {
            console.log('Caught undefined');
        }
    }
}
