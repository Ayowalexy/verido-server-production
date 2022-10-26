if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const AuthRoutes = require('./routes/auth');
const AdminRoutes = require('./routes/admin');
const AdminAuth = require('./routes/admin_auth')
const cors = require('cors');
const log = require('morgan');

const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE


const DB = `mongodb+srv://seinde4:${PASSWORD}@cluster0.pp8yv.mongodb.net/${DATABASE}?retryWrites=true&w=majority`;
const STAGING = 'mongodb://localhost:27017/verido-server';

mongoose.connect(DB,
    {    
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }
)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('Database connected')
})

app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(cors());
app.use(log('dev'));

app.use(AuthRoutes);
app.use(AdminRoutes);
app.use('/admin', AdminAuth);



const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))