const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const cors = require('cors');

require('dotenv').config();
require('./db');
const PORT = 3000;
//const PORT = process.env.PORT;



//use method override
app.use(methodOverride('_method'));

//convert data into json format

app.use(express.json());
app.use(express.urlencoded({extended: false}));

//set up template engine
app.set('view engine', 'ejs');

app.use(cors());

//static files
app.use(express.static('./public'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.render('home');
    });

    //404 paage
app.use((req, res)=>{
    res.status(404).render('404');
})



    app.listen(PORT, () => {
    console.clear();
    console.log(`Server is running on port ${PORT}.`);
});