const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

let dataArray = [];

app.use(bodyParser.json());
app.use(cors());

app.post('/api/data', (req, res) => {
    const data = req.body;
    dataArray.push(data);
    res.status(200).json({ message: 'Data added successfully', data: dataArray });
});

app.get('/api/data', (req, res) => {
    res.status(200).json(dataArray);
    console.log(dataArray);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
