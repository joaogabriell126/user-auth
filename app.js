const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'pug')
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.get('/', (req, res) => {
    res.render('index', {})
})

app.get('/register', (req, res) =>{
    res.render('register')

})

app.post('/register', async (req, res) =>{
    const { email, password } = req.body;
    await prisma.user.create({
        data: {
            email: email,
            password: password,
        }
    })
    res.redirect("/")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

