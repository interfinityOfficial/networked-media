const dotenv = require('dotenv');
dotenv.config();

const m = require('masto');
const masto = m.createRestAPIClient({
    url: process.env.MASTODON_URL,
    accessToken: process.env.MASTODON_ACCESS_TOKEN,
})

let posts = [];

async function makeStatus() {
    masto.v1.statuses.create({
        status: 'Hello, world!',
        visibility: 'private',
    })
}

// fetch("http://67.207.94.2:7001/all-posts")
//     .then(response => response.json())
//     .then(data => {
//         posts = data.posts;
//     })
//     .catch(error => {
//         console.error("Error fetching:", error);
//     });

async function main() {
    try {
        const status = await makeStatus();
        console.log("Posted:", status.url);
    } catch (err) {
        console.error("Error posting:", err);
    }
}

main();