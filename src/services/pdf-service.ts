
import pdfkit from 'pdfkit';
import fs from 'fs';
import { IProfileData } from 'models/users';

export class PDFService {
    private data: IProfileData;

    constructor(data: IProfileData) {
        this.data = data;
    }

    public createNewPdf(fileName: string) {
        const pdfData = this.data.userData;
        try {
            const PDFDoc = new pdfkit();
            PDFDoc.pipe(fs.createWriteStream(`./pdfs/${fileName}.pdf`));
            PDFDoc.fontSize(14)
                .text(`This is all we currently know of ${this.data.displayName}`, 100, 100);

            PDFDoc.fontSize(6)
            Object.entries(pdfData)
                .forEach(([k, v]) => {
                    const { val, key } = v;
                    PDFDoc.text(`Name: "${key}", value: "${val}"`,
                        { width: 420, height: 40, lineGap: 1, align: 'left' })
                })

            PDFDoc.image('dist/public/images/byrd-logo.png', 300, 20, { scale: 0.05 })
            PDFDoc.end();
        } catch (e) {
            console.log(e);
        }
    }
}
