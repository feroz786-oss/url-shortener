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

    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, "{}");
    }

    const data = fs.readFileSync(DATA_FILE);

    return JSON.parse(data);
}

function writeUrls(data) {

    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(data, null, 2)
    );
}

app.post("/shorten", (req, res) => {

    const { longUrl } = req.body;

    if (!longUrl) {

        return res.status(400).json({
            error: "URL required"
        });
    }

    const urls = readUrls();

    const shortId = nanoid(6);

    urls[shortId] = {
        url: longUrl,
        clicks: 0
    };

    writeUrls(urls);

    res.json({
        shortUrl: `http://localhost:${PORT}/${shortId}`,
        shortId
    });
});

app.get("/stats/:id", (req, res) => {

    const urls = readUrls();

    const data = urls[req.params.id];

    if (!data) {

        return res.status(404).json({
            error: "Not found"
        });
    }

    res.json({
        url: data.url,
        clicks: data.clicks
    });
});

app.get("/:id", (req, res) => {

    const urls = readUrls();

    const data = urls[req.params.id];

    if (!data) {

        return res.status(404).send("URL not found");
    }

    data.clicks += 1;

    writeUrls(urls);

    res.redirect(data.url);
});

app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);
});