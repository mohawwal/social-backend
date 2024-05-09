const express = require("express");
const { validateToken } = require("../Middlewares/AuthMiddleware");
const router = express.Router()
const { Likes } = require("../models")



router.post("/", validateToken, async(req, res) => {
    const {PostId} = req.body
    const UserId = req.user.id

    const found = await Likes.findOne({
        where: { PostId: PostId, UserId: UserId }
    })
    if (!found) {
        await Likes.create({PostId: PostId, UserId: UserId})
        return res.json({liked: true})
    } else {
        await Likes.destroy({
            where: { PostId: PostId, UserId: UserId }
        });
        return res.json({liked: false})
    }
    s
})

module.exports = router