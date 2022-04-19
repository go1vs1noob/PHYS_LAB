const path = require('path');
const express = require('express');
const app = express();

const host = '0.0.0.0';
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')))

app.get("//", (req, res) => {
    res.sendFile(`${__dirname}//public//index.html`);
});

app.listen(port, host, function() {
    console.log("Server started.......");
});






