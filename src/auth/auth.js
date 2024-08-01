const axios = require('axios');
const querystring = require('querystring');
const dotenv = require('dotenv');
dotenv.config();

async function getAccessToken() {
    try {
        const response = await axios.post(process.env.URL_TOKEN, querystring.stringify({
            scopes: 'PublicApi.Access',
            grant_type: 'client_credentials',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = getAccessToken;