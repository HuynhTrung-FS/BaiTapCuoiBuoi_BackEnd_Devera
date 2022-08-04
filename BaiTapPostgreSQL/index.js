const express = require('express');
const app = express();
const port = 8010;
const userRoute = require('./users/route');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/v1/users', userRoute);

app.listen(port,()=>{
    console.log(`Example app listening on port: ${port}`);
})