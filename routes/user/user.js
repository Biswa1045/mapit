const express = require("express");
const cors = require("cors");
const { getAuth, signInWithPhoneNumber } = require('firebase-admin/auth');
const { db } = require('../../firebase/config.js');

const router = express.Router(); 
router.use(express.json());
router.use(cors());

const auth = getAuth();

function saveDetails(){

}

router.get("/",  function(req, res) {
    try {
        
        const users = [];
        res.json(users);
    } catch (error) {
        console.error("Error fetching users: ", error);
        res.status(500).send({ error: "Failed to fetch users" });
    }
});

router.post("/sendOTP", async (req, res) => {
    try {
        const phoneNumber = "+91" + req.body.phoneNumber; // assuming phoneNumber is the key in req.body holding the phone number

        const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha');
        auth.signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmationResult) => {
                // OTP sent
                res.status(200).json({ message: "OTP sent successfully" });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({ error: "Failed to send OTP" });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/verifyOTP", async (req, res) => {
    try {
        const phoneNumber = "+91" + req.body.phoneNumber;
        const verificationCode = req.body.verificationCode;

        // Verify the OTP
        const credential = signInWithPhoneNumber(auth, phoneNumber, verificationCode)
            .then((userCredential) => {
                // User successfully authenticated
                const uid = userCredential.user.uid;

                res.status(200).json({ uid });
            })
            .catch((error) => {
                console.error(error);
                res.status(400).json({ error: "Invalid OTP" });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/saveDetails", async (req, res) => {
    try {
        const {uid, phoneNumber, name, privacy, gender } = req.body;

        // Validate required fields
        if (!uid || !phoneNumber || !name || !privacy || !gender) {
            return res.status(400).json({ error: "Please provide uid, phoneNumber, name, privacy, and gender." });
        }
        
        // Save user data to Firestore
        const userRef = await db.collection('users').doc(uid).set({
            uid,
            phoneNumber,
            name,
            privacy,
            gender
        });

        res.status(201).json({ message: "User data saved successfully", id: userRef.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/getUserDetails/:uid", async (req, res) => {
    try {
        const uid = req.params.uid;

        
        const userSnapshot = await db.collection('users').doc(uid).get();

        
        if (!userSnapshot.exists()) {
            return res.status(404).json({ error: "User not found" });
        }

        const userData = userSnapshot.data();

        res.status(200).json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;
