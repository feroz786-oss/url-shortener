async function shortenUrl() {

    const longUrl =
        document.getElementById("longUrl").value;

    const response = await fetch("/shorten", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            longUrl
        })
    });

    const data = await response.json();

    document.getElementById("result").innerHTML = `

        <div>

            <p>
                <strong>Short URL:</strong>
            </p>

            <a href="${data.shortUrl}" target="_blank">
                ${data.shortUrl}
            </a>

            <br><br>

            <button onclick="copyLink('${data.shortUrl}')">
                Copy Link
            </button>

            <p id="copyMsg"></p>

            <hr>

            <h3>Tracking</h3>

            <p>
                Total Clicks:
                <span id="clicks">0</span>
            </p>

        </div>
    `;

    trackClicks(data.shortId);
}

function copyLink(url) {

    navigator.clipboard.writeText(url);

    document.getElementById("copyMsg").innerHTML =
        "✅ Link copied!";
}

function trackClicks(id) {

    async function updateClicks() {

        const response =
            await fetch(`/stats/${id}`);

        const data =
            await response.json();

        document.getElementById("clicks").innerText =
            data.clicks;
    }

    updateClicks();

    setInterval(updateClicks, 2000);
}