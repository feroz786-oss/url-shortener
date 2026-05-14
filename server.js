const express = require("express");
const fs = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, "data", "urls.json");

app.use(express.json());
app.use(express.static("public"));

function readUrls() {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
}

function writeUrls(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.post("/shorten", (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
        return res.status(400).json({ error: "URL required" });
    }

    const urls = readUrls();

    const shortId = nanoid(6);

    urls[shortId] = longUrl;

    writeUrls(urls);

    res.json({
        shortUrl: `http://localhost:${PORT}/${shortId}`
    });
});

app.get("/:id", (req, res) => {
    const { id } = req.params;

    const urls = readUrls();

    const originalUrl = urls[id];

    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.status(404).send("URL not found");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});