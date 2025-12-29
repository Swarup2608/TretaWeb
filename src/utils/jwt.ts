// Simple JWT utility for client-side demo
export const generateJWT = (payload: any, secret: string = 'secret') => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = btoa(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 })); // 24 hours
    const signature = btoa(secret + header + body); // Simple signature
    return `${header}.${body}.${signature}`;
};

export const verifyJWT = (token: string, secret: string = 'secret') => {
    try {
        const [header, body, signature] = token.split('.');
        const expectedSignature = btoa(secret + header + body);
        if (signature !== expectedSignature) return null;
        const payload = JSON.parse(atob(body));
        if (payload.exp < Date.now()) return null;
        return payload;
    } catch {
        return null;
    }
};