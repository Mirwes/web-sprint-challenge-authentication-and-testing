const router = require('express').Router();
const bcrypt = require('bcrypt');
const users = require('../user/userModel');
const generateToken = require('../utils/generateToken');

router.post('/register', (req, res) => {
    // implement registration
    const { username, password } = req.body;
    let user = { username, password };
    const hash = bcrypt.hashSync(user.password, 8); //higher in production
    user.password = hash;

    users.insert(user).then(addedUser => {
        const token = generateToken(addedUser);
        res.status(201).json({ user: addedUser, token });
    }).catch(({ error, message, stack }) => {
        console.log(`Error: ${error}\nMessage: ${message}\n Stack: ${stack}`);
        res.status(500).json({ error, message, stack, errorMessage: 'Unable to register user.' });
    });
});

router.post('/login', (req, res) => {
    // implement login
    let { username, password } = req.body;

    users.getBy({ username }).then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = generateToken(user);
            res.status(200).json({ message: `Welcome back, ${username}!`, token});
        } else {
            res.status(401).json({ message: 'Invalid Credentials' });
        }
    }).catch(({error, message, stack}) => {
        console.log(`Error: ${error}\nMessage: ${message}\n Stack: ${stack}`);
        res.status(500).json({ error, message, stack, errorMessage: 'Unable to register user.' });
    });
});

module.exports = router;


























// const router = require('express').Router();

// router.post('/register', (req, res) => {
//   res.end('implement register, please!');
//   /*
//     IMPLEMENT
//     You are welcome to build additional middlewares to help with the endpoint's functionality.

//     1- In order to register a new account the client must provide `username` and `password`:
//       {
//         "username": "Captain Marvel", // must not exist already in the `users` table
//         "password": "foobar"          // needs to be hashed before it's saved
//       }

//     2- On SUCCESSFUL registration,
//       the response body should have `id`, `username` and `password`:
//       {
//         "id": 1,
//         "username": "Captain Marvel",
//         "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
//       }

//     3- On FAILED registration due to `username` or `password` missing from the request body,
//       the response body should include a string exactly as follows: "username and password required".

//     4- On FAILED registration due to the `username` being taken,
//       the response body should include a string exactly as follows: "username taken".
//   */
// });

// router.post('/login', (req, res) => {
//   res.end('implement login, please!');
//   /*
//     IMPLEMENT
//     You are welcome to build additional middlewares to help with the endpoint's functionality.

//     1- In order to log into an existing account the client must provide `username` and `password`:
//       {
//         "username": "Captain Marvel",
//         "password": "foobar"
//       }

//     2- On SUCCESSFUL login,
//       the response body should have `message` and `token`:
//       {
//         "message": "welcome, Captain Marvel",
//         "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
//       }

//     3- On FAILED login due to `username` or `password` missing from the request body,
//       the response body should include a string exactly as follows: "username and password required".

//     4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
//       the response body should include a string exactly as follows: "invalid credentials".
//   */
// });

// module.exports = router;
