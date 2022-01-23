const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const cors = require("cors");
const morgan = require("morgan")


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors())

//if we are in production serve client/build as static assets

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "../client/build")))
}

app.use(morgan('tiny'));
app.use(routes);

db.once('open', ()=>{
    app.listen(PORT, ()=>{
        console.log(`CORS-enabled web server listening on ${PORT}`)
    })
});