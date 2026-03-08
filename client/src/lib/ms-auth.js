import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
    auth: {
        clientId: process.env.NEXT_PUBLIC_MS_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_MS_TENANT_ID}`,
        redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    },
};

const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL when the module loads
let isInitialized = false;

export const initializeMsal = async () => {
    if (!isInitialized) {
        await msalInstance.initialize();
        isInitialized = true;
    }
};

export const signInWithMicrosoft = async () => {
    try {
        await initializeMsal();

        const loginRequest = {
            scopes: ['openid', 'profile', 'email'],
            prompt: 'select_account',
        };

        const response = await msalInstance.loginPopup(loginRequest);

        return {
            idToken: response.idToken,
            user: {
                uid: response.account.homeAccountId,
                email: response.account.username,
                displayName: response.account.name,
                provider: 'microsoft.com',
            },
            account: response.account,
        };
    } catch (error) {
        console.error('Microsoft MSAL sign-in error:', error);
        throw error;
    }
};

export const signOutMicrosoft = async () => {
    try {
        await initializeMsal();
        await msalInstance.logoutPopup();
    } catch (error) {
        console.error('Microsoft MSAL sign-out error:', error);
    }
};
