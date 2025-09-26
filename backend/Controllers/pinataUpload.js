import dotenv from 'dotenv'; // import dotenv to load environment variables
dotenv.config();
import axios from 'axios';

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;


export const uploadJsonToPinata = async (jsonData) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

    try {
        const response = await axios.post(url, jsonData, {
            headers: {
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey,
            },
        });
        // The IpfsHash is the CID of your JSON file
        return response.data.IpfsHash;
    } catch (error) {
        console.error("Error uploading JSON to Pinata:", error);
        throw error;
    }
};