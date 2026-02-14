const key = 'AIzaSyAmrEEdiRH_CRrEHePimBDUtpwO4NnEhgA';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

console.log('Testing key:', key);
console.log('Fetching:', url);

async function test() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ SUCCESS!');
            console.log('Models found:', data.models?.length);
            if (data.models && data.models.length > 0) {
                console.log('Available Models:');
                data.models.forEach(m => console.log(m.name));
            }
        } else {
            console.log('❌ FAILED with status:', response.status);
            console.log('Error:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.log('❌ NETWORK ERROR:', error.message);
    }
}

test();
