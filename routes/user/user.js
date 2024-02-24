const express = require("express");
const cors = require("cors");
const { db } = require('../../firebase/config.js');

const router = express.Router(); // Correct initialization of router

router.use(express.json());
router.use(cors());

router.get("/",  function(req, res) {
    try {
        
        const users = [];
        res.json(users);
    } catch (error) {
        console.error("Error fetching users: ", error);
        res.status(500).send({ error: "Failed to fetch users" });
    }
});

router.post("/create", async (req, res) => {
    try {
        const data = req.body;
        const userRef = await db.collection("users").add(data);
        res.send({ msg: "User Added", userId: userRef.id });
    } catch (error) {
        console.error("Error adding user: ", error);
        res.status(500).send({ error: "Failed to add user" });
    }
});


module.exports = router;
