const express = require('express');
const router = express.Router();
const client = require('../database/pg');

router.post('',async (req,res) => {
    const body = req.body;
    const result = await client.query(`
        INSERT INTO people(name, age, address, info)
        VALUES ('${body.name}',${body.age},'${body.address}','${body.info}')
    `);
    res.send(result);
});
router.get('',async (req,res) => {
    const result = await client.query(`
        SELECT * FROM people
    `);
    res.send(result.rows);
});
router.delete('', async(req,res) => {
    const query = req.query;
    const name = query.name.toString();
    console.log(typeof name);
    const result = await client.query('DELETE FROM "people" WHERE "name" = $1',[name]);
    res.send(result);
})
router.put('',async(req,res)=>{
    const body = req.body;
    const query = req.query;
    const nameCheck = query.name.toString();
    const result = await client.query('Update people SET name = $1, age = $2, address = $3, info = $4 WHERE name = $5',[body.name,body.age,body.address,body.info,nameCheck]);
    res.send(result);
})
module.exports = router;