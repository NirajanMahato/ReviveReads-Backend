require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT ? process.env.PORT : 5000

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
})


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});