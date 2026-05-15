const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let urlMap = {};

// SHORTEN API (custom + random)
app.post('/shorten', (req, res) => {
    const { url, custom } = req.body;

    if (!url || !url.startsWith("http")) {
        return res.json({ error: "Enter valid URL" });
    }

    let shortId = custom || Math.random().toString(36).substring(7);

    if (urlMap[shortId]) {
        return res.json({ error: "Custom URL already exists" });
    }

    urlMap[shortId] = { url: url, clicks: 0 };

    res.json({ shortUrl: "http://localhost:3000/" + shortId });
});

// ✅ IMPORTANT: stats route FIRST
app.get('/stats/:id', (req, res) => {
    const data = urlMap[req.params.id];

    if (data) {
        res.json({
            url: data.url,
            clicks: data.clicks
        });
    } else {
        res.send("No data found");
    }
});
// REDIRECT + CLICK COUNT
app.get('/:id', (req, res) => {
    const data = urlMap[req.params.id];

    if (data) {
        data.clicks++;
        res.redirect(data.url);
    } else {
        res.send("URL not found");
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});