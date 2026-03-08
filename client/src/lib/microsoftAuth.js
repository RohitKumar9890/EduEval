import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
    auth: {
        // You will need to replace this with your actual Azure Client ID
        clientId: process.env.MICROSOFT_CLIENT_ID || 'REPLACE_WITH_YOUR_AZURE_CLIENT_ID',
        authority: 'https://login.microsoftonline.com/common', // Or your specific tenant ID
        redirectUri: '/', // Redirect back to the same page or a specific auth handler page
        postLogoutRedirectUri: '/'
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    }
};

export const msalInstance = new PublicClientApplication(msalConfig);

// Initialize the MSAL instance (required in MSAL v3+)
msalInstance.initialize().catch(e => {
    console.error('MSAL Initialization Error:', e);
});

export const loginRequest = {
    scopes: ['User.Read', 'email', 'profile', 'openid']
};
