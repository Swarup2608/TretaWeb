import { readEncryptedUsers, writeEncryptedUsers } from '../src/utils/encryption';
import fs from 'fs';
import path from 'path';

// This script encrypts the users.json file
async function encryptUsersFile() {
    try {
        const usersPath = path.join(process.cwd(), 'public', 'SiteContent', 'users.json');
        
        console.log('Reading users.json...');
        const usersData = fs.readFileSync(usersPath, 'utf-8');
        
        // Check if already encrypted
        if (usersData.includes(':') && !usersData.trim().startsWith('[')) {
            console.log('Users file is already encrypted!');
            return;
        }
        
        const users = JSON.parse(usersData);
        console.log(`Found ${users.length} users to encrypt`);
        
        console.log('Encrypting users.json...');
        writeEncryptedUsers(users);
        
        console.log('✅ Users file encrypted successfully!');
        console.log('The file is now encrypted and can only be read by the application.');
    } catch (error) {
        console.error('❌ Error encrypting users file:', error);
        process.exit(1);
    }
}

encryptUsersFile();
