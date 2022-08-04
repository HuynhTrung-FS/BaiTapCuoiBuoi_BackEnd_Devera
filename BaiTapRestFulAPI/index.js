const express = require('express');
const app = express();
const port = 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const countryRouter = require('./countries/routes');
app.use('/v1/country', countryRouter);
app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});
