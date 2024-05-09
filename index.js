const express = require('express');
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

const db = require('./models')

//ROUTERS
const postRouter = require('./routes/Posts')
app.use("/posts", postRouter)

const commentsRouter = require('./routes/Comments')
app.use("/Comments", commentsRouter)

const usersRouter = require('./routes/Users')
app.use("/auth", usersRouter)

const likeRouter = require('./routes/Likes')
app.use("/likes", likeRouter)


db.sequelize.sync().then(() => {
    app.listen(3001, (req, res) => {
        console.log('i can hear you')
    });
})
