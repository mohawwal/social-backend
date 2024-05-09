const express = require('express')
const router = express.Router()
const {Users} = require('../models')
const bcrypt = require("bcrypt")
const {validateToken} = require("../Middlewares/AuthMiddleware")
const {sign} = require('jsonwebtoken')
// const { where } = require('sequelize')


router.post("/", async(req, res) => {
    const {username, password} = req.body
    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            username: username,
            password: hash
        })
        res.json("SUCCESS")
    })
});


router.post("/login", async(req, res) => {
    const {username, password} = req.body;

    const user = await Users.findOne({ where: {username: username}})
    if(!user) {
        return res.status(404).json({error: "User does not exist"})
    }

    bcrypt.compare(password, user.password).then((match) => {
        if(!match) {
            return res.status(400).json({error: "match wrong username and password combination"})
        }

        const accessToken = sign(
            {username: user.username, id: user.id},
             "importantSecret"
            )

        res.json({token: accessToken, username: username, id: user.id});
    }).catch(err => {
        console.error(err)
        res.status(500).json({error: "An error occurred during login"})
    })
})

router.get('/verify', validateToken, (req, res) => {
    res.json(req.user);
})

router.get('/basicInfo/:id', async (req, res) => {
    const id = req.params.id

    const basicInfo = await Users.findByPk(id, {
        attributes: {exclude: ['password']}
    })

    res.json(basicInfo)
})


router.put('/changePassword', validateToken, async (req, res) => {
    const {oldPassword, newPassword} = req.body
    const user = await Users.findOne({
        where: {username: req.user.username}
    })

    if(!user) {
        return res.status(404).json({error: "User not found"})
    }
    try {
        const match = await bcrypt.compare(oldPassword, user.password);
        if(!match) {
            return res.status(400).json({error: 'Wrong password Entered'})
        }
        const hash = await bcrypt.hash(newPassword, 10);
        await Users.update({password: hash}, {where: {username: req.user.username}})
        res.json({message: "password changed successfully"})
    }catch(error) {
        console.log(error)
        res.status(500).json({error: "An error occurred"})
    }
} )

module.exports = router;