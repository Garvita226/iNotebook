const express = require('express')
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

// Create a signature
const JWT_SECRET = 'fdsjdcskgyusbc'

// Create a new router
const router = express.Router();

let success = true;

// ROUTE 1 : Create a user using : POST "/api/auth/createuser". No login required
router.post('/createuser',

    // Validating fields
    [body('name', 'Name must be atleast 3 characters').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })],

    // Callback function
    async (req, res) => {

        // If there are errors, return Bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            success = false;
            return res.status(400).json({success, errors: errors.array() });
        }

        // const result = validationResult(req);
        // if (result.isEmpty()) {
        //     const user = User(req.body)
        //     user.save();
        //     const data = matchedData(req);
        //     return res.send(data);
        // }

        // Check whether a user with this email already exists
        try {

            let user = await User.findOne({ email: req.body.email });
            if (user) {
                success = false
                return res.status(400).send({success, error: 'Sorry, a user with this email already exists' })
            }

            // Generate a salt
            const salt = bcrypt.genSaltSync(10);
            // Creating a hashed password with original password plus salt
            const secPass = await bcrypt.hash(req.body.password, salt);

            // Create a new user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass
            })

            // Specify the unique data with which the user will be identified
            const data = {
                user: {
                    id: user.id
                }
            }

            // Create a token
            const authtoken = jwt.sign(data, JWT_SECRET);

            // Send the token as response
            success = true;
            res.json({success, authtoken });

        } catch (error) {
            console.error(error.message)
            res.status(500).send('Internal server error');
        }
    })


// ROUTE 2 : Authenticate a user using : POST "/api/auth/login". No login required
router.post('/login',

    // Validating fields
    [body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()],

    // Callback function
    async (req, res) => {

        // If there are errors, return Bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            success = false;
            return res.status(400).json({success, errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // Check if the user with given email exists, and give error if email is incorrect
            let user = await User.findOne({ email });
            if (!user) {
                success = false;
                return res.status(400).json({success, error: 'Please try to login with right credentials' })
            }

            // Compare the given password with the stored password, and give error if password is incorrect
            const passwordCompare = await bcrypt.compare(password, user.password)
            if (!passwordCompare) {
                success = false;
                return res.status(400).json({success, error: 'Please try to login with right credentials' })
            }

            // Specify the unique data with which the user will be identified
            const data = {
                user: {
                    id: user.id
                }
            }

            // Create a token
            const authtoken = jwt.sign(data, JWT_SECRET);

            // Send the token as response
            success = true;
            res.json({success, authtoken });

        } catch (error) {
            console.error(error.message)
            res.status(500).send('Internal server error');
        }
    }
)

// ROUTE 3 : Get logged in user details using : POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {

        try {
            const userId = req.user.id;
            const user = await User.findById(userId).select({password : 0});
            res.send(success, user);
            
        } catch (error) {
            console.error(error.message)
            res.status(500).send('Internal server error');
        }
    }
)

module.exports = router;