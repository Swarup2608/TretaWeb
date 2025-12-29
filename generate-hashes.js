const bcrypt = require('bcryptjs');

async function generateHashes() {
    const testUsers = [
        { password: 'password123', username: 'admin1' },
        { password: 'admin456', username: 'admin2' },
        { password: 'superpass', username: 'superadmin' },
        { password: 'testpass123', username: 'test' }
    ];

    console.log('Generated bcryptjs hashes:\n');

    for (const user of testUsers) {
        const hash = await bcrypt.hash(user.password, 10);
        console.log(`${user.username} / ${user.password}`);
        console.log(`Hash: ${hash}\n`);
    }
}

generateHashes();
