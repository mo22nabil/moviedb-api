const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose')
const app = express()
const port = 3000
const saltRounds = 7

app.use(express.json())
const userSchema = mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
}, { timestamps: true })
const userModel = mongoose.model('user', userSchema)



app.get('*', (req, res) => res.send('Hello World!'))

app.post('/signUp', async (req, res) => {
    try {
        const { name, email, password } = req.body
        let user = await userModel.findOne({ email })
        if (user) {
            res.json({ message: "email already exsit" })
        } else {
            bcrypt.hash(password, saltRounds, async function (err, hash) {
                await userModel.insertMany({ name, email, password: hash })
                res.json({ message: "success" })
            });
        }
    } catch (error) {

        res.json({ message: "success" }, error)
    }
});
app.post('/logIn', async (req, res) => {
    try {
        const { email, password } = req.body
        let user = await userModel.findOne({ email })
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = jwt.sign({ _id: user._id, name: user.name, isLoggedIn: true }, 'shhhhh');
                res.json({ message: "success", token })
            } else {
                res.json({ message: "inncorect user password" })
            }
        } else {
            res.json({ message: "email is not exist" })
        }
    } catch (error) {
        res.json({ message: "success" }, error)
    }
});

mongoose.connect('mongodb://localhost:27017/moviesProject').then(() => {
    console.log("db connected");
}).catch((err) => {
    console.log(err);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))