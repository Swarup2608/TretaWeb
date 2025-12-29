import { readEncryptedUsers } from '../src/utils/encryption';

// This script reads and displays decrypted user data (for debugging)
async function viewUsers() {
    try {
        console.log('Reading encrypted users.json...');
        const users = readEncryptedUsers();
        
        console.log(`\n✅ Successfully decrypted ${users.length} users:\n`);
        
        users.forEach((user: any, index: number) => {
            console.log(`${index + 1}. ${user.username} (${user.role})`);
            console.log(`   ID: ${user.id}`);
            console.log(`   Name: ${user.name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Password Hash: ${user.password.substring(0, 20)}...`);
            console.log('');
        });
        
        console.log('📝 Note: The users.json file is encrypted, but the application can read and decrypt it automatically.');
    } catch (error) {
        console.error('❌ Error reading users:', error);
        process.exit(1);
    }
}

viewUsers();
