// This is a utility script to generate hashed passwords
// Run this in Node.js to generate hashes for your users
// Example: node -e "require('./hashPasswords.js')"

import bcrypt from 'bcryptjs';

const users = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'Administrator'
    }
];

async function generateHashes() {
    console.log('Generating password hashes...\n');

    const hashedUsers = await Promise.all(
        users.map(async (user) => ({
            ...user,
            password: await bcrypt.hash(user.password, 10)
        }))
    );

    console.log('Use these hashed users in your users.json:');
    console.log(JSON.stringify(hashedUsers, null, 2));
}

generateHashes().catch(console.error);
