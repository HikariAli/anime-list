// routes/news.js

const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/anime-news', async (req, res) => {
    try {
        const response = await axios.get('https://api.jikan.moe/v4/anime/1/news');
        const newsItems = response.data.data;

        // Filter the news items to display only the first 3
        const newsToShow = newsItems.slice(0, 3);

        res.json(newsToShow);
    } catch (error) {
        console.error('Error fetching anime news:', error);
        res.status(500).json({ error: 'Error fetching anime news' });
    }
});

module.exports = router;
