import axios from 'axios';
import puppeteer from 'puppeteer';
import crypto from 'crypto';
import FormData from 'form-data';
import { Readable } from 'stream';
const generateCertificateHTML = (data) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Carbon Offset Certificate - ${data.certificateId}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background-color: #f9fafb; -webkit-print-color-adjust: exact; }
            .container { max-width: 800px; margin: 40px auto; background-color: white; border-radius: 24px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; overflow: hidden; }
            .header { background: linear-gradient(to right, #10B981, #3B82F6); padding: 32px; color: white; }
            .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
            .header-brand { display: flex; align-items: center; }
            .header-brand .icon { width: 48px; height: 48px; background-color: rgba(255,255,255,0.2); border-radius: 9999px; display: flex; align-items: center; justify-content: center; margin-right: 16px; }
            .header-brand h2 { margin: 0; font-size: 24px; font-weight: 800; }
            .header-brand p { margin: 0; opacity: 0.9; }
            .header-retirement { text-align: right; }
            .header-retirement .amount { font-size: 30px; font-weight: 800; }
            .header-retirement .label { font-size: 14px; opacity: 0.9; }
            .body { padding: 32px; }
            .certification-text { text-align: center; margin-bottom: 32px; }
            .certification-text h3 { font-size: 24px; font-weight: 600; color: #374151; margin: 0 0 8px 0; }
            .certification-text .retiree-name { font-size: 30px; font-weight: 800; color: #10B981; margin-bottom: 16px; word-break: break-all; }
            .certification-text .summary { font-size: 18px; color: #4b5563; line-height: 1.6; }
            .project-image { text-align: center; margin-bottom: 32px; }
            .project-image img { width: 100%; max-width: 448px; height: 192px; object-fit: cover; border-radius: 16px; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
            .detail-item { display: flex; align-items: center; }
            .detail-item .label { font-weight: 600; color: #1f2937; }
            .detail-item .value { color: #4b5563; }
            .verification-box { background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 24px; margin-bottom: 32px; }
            .verification-box h4 { font-weight: 600; color: #1e40af; margin: 0 0 12px 0; }
            .verification-box p { color: #1d4ed8; margin: 0 0 12px 0; }
            .verification-box .tx-hash { font-family: monospace; font-size: 12px; color: #1e3a8a; word-break: break-all; }
            .footer { text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 24px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                 <div class="header-top">
                    <div class="header-brand">
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        </div>
                        <div><h2>CarbonCycle</h2><p>Official Carbon Offset Certificate</p></div>
                    </div>
                    <div class="header-retirement">
                        <div class="amount">${data.tonnesRetired}</div>
                        <div class="label">tokens Retired</div>
                    </div>
                </div>
                 <p style="font-size: 12px; opacity: 0.8; margin-top: 16px;">Certificate ID: ${data.certificateId}</p>
            </div>
            <div class="body">
                <div class="certification-text">
                    <h3>This certifies that</h3>
                    <div class="retiree-name">${data.retireeAddress}</div>
                    <p class="summary">has permanently retired <strong>${data.tonnesRetired} tokens</strong> of verified carbon credits from the <strong>${data.projectName}</strong> project.</p>
                </div>
                <div class="project-image"><img src="${data.projectImage}" alt="${data.projectName}" /></div>
                <div class="details-grid">
                    <div><div class="label">Project Location</div><div class="value">${data.location}</div></div>
                    <div><div class="label">Retirement Date</div><div class="value">${data.retiredDate}</div></div>
                </div>
                <div class="verification-box">
                    <h4>Blockchain Verification</h4>
                    <p>This certificate is permanently recorded on the blockchain for transparent verification.</p>
                </div>
                <div class="footer">
                    <p>This certificate represents the permanent retirement of verified carbon offset credits. This action cannot be reversed.</p>
                    <p>Generated on ${new Date().toLocaleDateString('en-GB')}</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};


export const generateAndUploadCertificate = async (retirementDetails, originalProjectMetadata) => {
    // 1. Map the incoming data to create the certificate data object
    const certificateData = {
        certificateId: `CERT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        
        // --- Data from retirementDetails (specific to this retirement event) ---
        retireeAddress: retirementDetails.retiredByAddress,
        tonnesRetired: retirementDetails.quantityRetired,
        retiredDate: new Date(retirementDetails.retiredAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }),
        transactionHash: retirementDetails.transactionHash,
        
        // --- Data from originalProjectMetadata (the source of truth for project info) ---
        projectName: originalProjectMetadata.projectName,
        projectImage: originalProjectMetadata.projectImages?.[0],
        location: originalProjectMetadata.location,
    };

    // 2. Generate PDF from HTML using the mapped data
    const htmlContent = generateCertificateHTML(certificateData);
    const browser = await puppeteer.launch({
        executablePath: puppeteer.executablePath(),
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' }); // Wait for images/fonts
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    // fs.writeFileSync(`${certificateData.certificateId}.pdf`, pdfBuffer);

    // 3. Upload the generated PDF to Pinata - FIXED VERSION
    const pdfStream = new Readable({
        read() {
            this.push(pdfBuffer);
            this.push(null);
        }
    });

    const formData = new FormData();
    formData.append('file', pdfStream, {
        filename: `${certificateData.certificateId}.pdf`,
        contentType: 'application/pdf',
        knownLength: pdfBuffer.length
    });

    const pinataResponse = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
            maxBodyLength: Infinity,
            headers: {
                ...formData.getHeaders(),
                pinata_api_key: process.env.PINATA_API_KEY,
                pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
            },
        }
    );

    // console.log('Pinata CID:', pinataResponse.data.IpfsHash);

    return pinataResponse.data.IpfsHash; // This is the document CID
};