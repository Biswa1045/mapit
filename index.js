
const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const ejs = require('ejs')
const usersRouter = require('./routes/user/user.js');


const app = express()
app.set('view engine','ejs')
app.set('routes',path.join(__dirname,'routes'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'))

app.use('/user',usersRouter)
app.get('/',(req,res)=>{
  res.send('Hello')
})

app.listen(3000,()=>{
  console.log("Serving on port 3000")
})

