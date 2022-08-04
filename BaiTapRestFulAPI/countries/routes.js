const express = require('express');
const router = express.Router();
const fs = require('fs');
const output = require('./output.json');

//Tạo cache
let cachedData;
let cacheTime;

//Tạo file json với tên là output.js
router.post('/', (req, res) => {
    const body = req.body;
    console.log('TYPE BODY: ', typeof body);
    console.log('CURRENT DIR: ', __dirname);
    fs.writeFile(`${__dirname}/output.json`, JSON.stringify(body), (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Write File Successfully');
    });
});
//Lấy tất cả phần tử trong file output.js
router.get('/', (req, res) => {
    if (cacheTime && cacheTime > Date.now() - 30 * 1000) {
        return res.send(cachedData);
    }
    fs.readFile(`${__dirname}/output.json`, (err, data) => {
        if (err) {
            console.error(err);
            return;
        };
        cachedData = data;
        cacheTime = Date.now();
        data.cacheTime = cacheTime;
        res.send(data);
    });
});
//Lọc theo country trong file output.js
router.get('/filters', (req, res) => {
    const query = req.query;
    const country = query.country;
    const resCountries = output.filter((e) => {
        if (e.country === country) {
            return true;
        } else {
            return false;
        }
    });
    res.send(resCountries);
});
//Xoá phần tử country
router.delete('/delete', (req, res) => {
    const query = req.query;
    const country = query.country;
    fs.readFile(`${__dirname}/output.json`, (err, data) => {
        dataFile = JSON.parse(data);
        const deleteCountry = dataFile.filter((e) => {
            if (!e.country.includes(country)) {
                return true;
            } else {
                return false;
            }
        });
        console.log(deleteCountry);
        fs.writeFile(
            `${__dirname}/output.json`,
            JSON.stringify(deleteCountry),
            (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('DELETE ' + country + ' SUCCESS');
            },
        );
    });
});

router.post('/postData', (req, res) => {
    const body = req.body;
    console.log('Body: ' + body);
    res.status(500).send(body);
});

//pageNumber and pageSize
router.get('/info', paginatedResults(output), (req, res) => {
    res.json(res.paginatedResults);
});
function paginatedResults(model) {
    return (req, res, next) => {
        const query = req.query;
        const pageNumber = Number(query.pageNumber);
        const pageSize = Number(query.pageSize);

        const firstIndex = (pageNumber - 1) * pageSize;
        const endIndex = pageNumber * pageSize;

        const results = {};

        if (endIndex < model.length) {
            results.next = {
                pageNumber: pageNumber + 1,
                pageSize,
            };
        }
        if (firstIndex > 0) {
            results.previous = {
                pageNumber: pageNumber - 1,
                pageSize,
            };
        }
        results.results = model.slice(firstIndex, endIndex);
        res.paginatedResults = results;
        next();
    };
}
module.exports = router;
