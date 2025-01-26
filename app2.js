const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.post('/users/', (req, res) =>{
    const {password, email } = req.body
    if (!password || !email){
        res.sendStatus(400)
        return
    }

    res.send({userId:1})

})


app.post('/tasks/addtask', (req, res)=>{
    res.send({})
})


module.exports = app;