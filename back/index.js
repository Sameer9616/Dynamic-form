const express = require("express");
const { json } = require("express");
const cors = require('cors');
const { getClient } = require("./db");

const app = express();
const PORT = process.env.PORT || 7000;
app.use(json());
app.use(cors())
app.post("/query", async (req, res) => {
    const { query } = req.body;

    console.log("query", query);

    try {
        const client = await getClient();
        const result = await client.query(query);
        res.status(200).json(result);
    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});