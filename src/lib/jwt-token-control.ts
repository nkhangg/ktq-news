import * as jose from 'jose';

const jwtConfig = {
    secret: new TextEncoder().encode(process.env.JWT_SECRET),
};

export const isAuthenticated = async (req) => {
    const token = req.cookies.get('Authorization')?.value;

    if (token) {
        try {
            const decoded = await jose.jwtVerify(token, jwtConfig.secret);

            if (decoded.payload?.id) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error('isAuthenticated error: ', err);

            return false;
        }
    } else {
        return false;
    }
};
