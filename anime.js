const axios = require('axios');

const API_URL = 'https://api.jikan.moe/v4/anime/';

async function getAnimeNews(animeId) {
    try {
        const response = await axios.get(`${API_URL}${animeId}/news`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching anime news:', error);
        return [];
    }
}

async function main() {
    const animeId = 1; // Change this to the ID of the anime you want news for
    const animeNews = await getAnimeNews(animeId);
    
    console.log('Latest anime news:');
    animeNews.forEach(article => {
        console.log(`Title: ${article.title}`);
        console.log(`URL: ${article.url}`);
        console.log(`Author: ${article.author_username}`);
        console.log('---');
    });
}

main();