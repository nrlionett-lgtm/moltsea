// Native fetch is available in Node 18+

async function registerAgent() {
    console.log('🤖 Agent Initialization...');

    const payload = {
        agentName: "MoltClaw-Test-Unit",
        walletAddress: "0x1234567890123456789012345678901234567890",
        signature: "0xsignature_mock"
    };

    try {
        const response = await fetch('http://localhost:3001/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Registration Successful!');
            console.log('------------------------------------------------');
            console.log('CLAIM URL:', data.claimUrl);
            console.log('------------------------------------------------');
            console.log('Instruction: Give this URL to your human.');
        } else {
            console.error('❌ Registration Failed:', data);
        }

    } catch (error) {
        console.error('❌ Network Error:', error.message);
        console.log('Make sure the Next.js server is running on localhost:3001');
    }
}

registerAgent();
