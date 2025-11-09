import dotenv from 'dotenv';
dotenv.config();

import { createRestAPIClient } from 'masto';
const masto = createRestAPIClient({
    url: process.env.MASTODON_URL,
    accessToken: process.env.MASTODON_ACCESS_TOKEN,
})

let morsePosts = [];
let counter = 0;

async function makeStatus(text) {
    const status = await masto.v1.statuses.create({
        status: text,
        visibility: 'public',
    })
    return status;
}

function morse(text) {
    const morseCode = {
        'A': '? ??', 'B': '?? ? ? ?', 'C': '?? ? ?? ?', 'D': '?? ? ?', 'E': '?',
        'F': '? ? ?? ?', 'G': '?? ?? ?', 'H': '? ? ? ?', 'I': '? ?', 'J': '? ?? ?? ??',
        'K': '?? ? ??', 'L': '? ?? ? ?', 'M': '?? ??', 'N': '?? ?', 'O': '?? ?? ??',
        'P': '? ?? ?? ?', 'Q': '?? ?? ? ??', 'R': '? ?? ?', 'S': '? ? ?', 'T': '??',
        'U': '? ? ??', 'V': '? ? ? ??', 'W': '? ?? ??', 'X': '?? ? ? ??', 'Y': '?? ? ?? ??',
        'Z': '?? ?? ? ?',
        '0': '?? ?? ?? ?? ??', '1': '? ?? ?? ?? ??', '2': '? ? ?? ?? ??', '3': '? ? ? ?? ??',
        '4': '? ? ? ? ??', '5': '? ? ? ? ?', '6': '?? ? ? ? ?', '7': '?? ?? ? ? ?',
        '8': '?? ?? ?? ? ?', '9': '?? ?? ?? ?? ?',
        ' ': '   ' // Three spaces for word separation
    };

    return text.toUpperCase()
        .split('')
        .map(char => morseCode[char] || char)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
}

fetch("http://67.207.94.2:7001/all-posts")
    .then(response => response.json())
    .then(data => {
        let posts = data.posts;
        for (const post of posts) {
            const morseContent = morse(post.text);
            morsePosts.push(morseContent);
        }
        main();
    })
    .catch(error => {
        console.error("Error fetching:", error);
    });

async function main() {
    try {
        const status = await makeStatus(morsePosts[counter]);
        counter++;
        if (counter >= morsePosts.length) {
            counter = 0;
        }
    } catch (err) {
        console.error("Error posting:", err);
    }
}

setInterval(main, 1 * 60 * 60 * 1000);