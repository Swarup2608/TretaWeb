import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production-32chars';
const ALGORITHM = 'aes-256-cbc';

// Ensure key is 32 bytes for aes-256
const getEncryptionKey = () => {
    const key = ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32);
    return Buffer.from(key);
};

export function encryptData(data: string): string {
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
        
        let encrypted = cipher.update(data, 'utf-8', 'hex');
        encrypted += cipher.final('hex');
        
        // Return iv:encrypted format
        return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
}

export function decryptData(encryptedData: string): string {
    try {
        const parts = encryptedData.split(':');
        if (parts.length !== 2) {
            throw new Error('Invalid encrypted data format');
        }
        
        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = parts[1];
        
        const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
        
        let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
        
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
}

export function encryptFile(fileContent: string): string {
    return encryptData(fileContent);
}

export function decryptFile(encryptedContent: string): string {
    return decryptData(encryptedContent);
}

// Helper functions for reading and writing encrypted user data
import fs from 'fs';
import path from 'path';

export function readEncryptedUsers(): any[] {
    try {
        const usersPath = path.join(process.cwd(), 'public', 'SiteContent', 'users.json');
        
        if (!fs.existsSync(usersPath)) {
            return [];
        }

        const encryptedData = fs.readFileSync(usersPath, 'utf-8');
        
        // Check if data is already encrypted (contains ':' separator)
        if (encryptedData.includes(':') && !encryptedData.trim().startsWith('[')) {
            const decryptedData = decryptFile(encryptedData);
            return JSON.parse(decryptedData);
        } else {
            // Data is not encrypted yet, return as is
            return JSON.parse(encryptedData);
        }
    } catch (error) {
        console.error('Error reading encrypted users:', error);
        throw error;
    }
}

export function writeEncryptedUsers(users: any[]): void {
    try {
        const usersPath = path.join(process.cwd(), 'public', 'SiteContent', 'users.json');
        const jsonData = JSON.stringify(users, null, 2);
        const encryptedData = encryptFile(jsonData);
        fs.writeFileSync(usersPath, encryptedData, 'utf-8');
    } catch (error) {
        console.error('Error writing encrypted users:', error);
        throw error;
    }
}
