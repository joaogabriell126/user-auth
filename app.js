const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'pug')
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require('bcrypt')

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login', {})
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/welcome', (req, res) => {
    res.render('welcome');
})

app.post('/register', async (req, res) => {
    const { email, password, confirm } = req.body
    const hash = await bcrypt.hash(password, 10)
    await prisma.user.create({
        data: {
            email: email,
            password: hash,
        }
    })
    res.redirect("/login")
})

app.post('/users', async (req, res) => {
    const { email, password} = req.body
    const user = await prisma.user.findUnique({
        where: { 
            email
        }
    });
    
    if (!user) {
        return res.status(400).send("Usuário não encontrado.")
    }

    const senhaCorreta = await bcrypt.compare(password, user.password)
    
    if (senhaCorreta){
       res.redirect("/welcome")
    } else{
        res.send("Usuário não encontrado") 
        
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

