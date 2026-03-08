import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { User, USER_ROLES } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { AuditLog, AUDIT_ACTIONS } from '../models/AuditLog.js';
import { signAccessToken, signRefreshToken, generateTokenFingerprint } from '../utils/jwt.js';

// Setup JWKS client to fetch Microsoft public keys
const client = jwksClient({
    jwksUri: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/discovery/v2.0/keys`,
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
        if (err) {
            return callback(err);
        }
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
}

const toAuthResponse = async (user, req) => {
    const payload = { sub: user._id.toString(), role: user.role };

    const fingerprint = generateTokenFingerprint(req.headers['user-agent'], req.ip);

    const accessToken = signAccessToken(payload, fingerprint);
    const refreshToken = signRefreshToken(payload, fingerprint);

    await RefreshToken.create({
        userId: user._id.toString(),
        token: refreshToken,
        deviceInfo: req.headers['user-agent'],
        ipAddress: req.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    return {
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            mfaEnabled: user.mfaEnabled || false,
        },
        accessToken,
        refreshToken,
    };
};

export const microsoftLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { idToken, provider } = req.body;

    try {
        // 1. Verify the Microsoft ID token
        const decodedToken = await new Promise((resolve, reject) => {
            jwt.verify(
                idToken,
                getKey,
                {
                    audience: process.env.MICROSOFT_CLIENT_ID,
                    issuer: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/v2.0`
                },
                (err, decoded) => {
                    if (err) return reject(err);
                    resolve(decoded);
                }
            );
        });

        const email = decodedToken.preferred_username || decodedToken.email;
        const name = decodedToken.name;
        const uid = decodedToken.oid; // Object ID

        if (!email) {
            return res.status(400).json({
                message: 'Email not provided by Microsoft. Please use an account with email access.'
            });
        }

        // 2. Check if user exists
        let user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
            // Existing user - check if active
            if (!user.isActive) {
                return res.status(401).json({
                    message: 'Account is deactivated. Please contact administrator.'
                });
            }

            // Update OAuth info if needed
            const updates = {};
            if (uid && !user.oauthProviderId) {
                updates.oauthProviderId = uid;
            }
            if (provider && !user.oauthProvider) {
                updates.oauthProvider = provider;
            }

            if (Object.keys(updates).length > 0) {
                await User.updateById(user._id, updates);
                user = await User.findById(user._id);
            }
        } else {
            // New user - auto-create with student role
            user = await User.create({
                name: name || email.split('@')[0],
                email: email.toLowerCase(),
                role: USER_ROLES.STUDENT, // Default to student for OAuth
                passwordHash: null,
                oauthProviderId: uid,
                oauthProvider: provider || 'microsoft.com',
                isActive: true,
            });
        }

        // 3. Log successful login
        await AuditLog.create({
            userId: user._id.toString(),
            action: AUDIT_ACTIONS.LOGIN,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            details: { email, provider: 'microsoft.com' }
        });

        // 4. Return our app's tokens
        return res.json(await toAuthResponse(user, req));

    } catch (error) {
        console.error('Microsoft login error:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Authentication token expired. Please try again.' });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid authentication token.' });
        }

        return res.status(500).json({
            message: 'Microsoft authentication failed. Please try again.'
        });
    }
};
