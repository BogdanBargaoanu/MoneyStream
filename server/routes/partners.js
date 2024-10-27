var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * @openapi
 * /partners:
 *   get:
 *     tags:
 *      - partners
 *     description: Gets the list of partners.
 *     responses:
 *       200:
 *         description: Returns the partners.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idPartner:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 password:
 *                   type: string
 *                 information:
 *                   type: string
 *                 email:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 success:
 *                   type: boolean
 */

/* GET partners listing. */
router.get('/', function (req, res, next) {
    const query = 'SELECT * FROM partner';
    req.db.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message, success: false });
            return;
        }
        res.json({ result, success: true });
    });
});

/**
 * @openapi
 * /partners/{name}:
 *   get:
 *     tags:
 *      - partners
 *     description: Gets the partner with the given partner username.
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Returns the partner.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idPartner:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 password:
 *                   type: string
 *                 information:
 *                   type: string
 *                 email:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Error caused by an inappropriate input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 success:
 *                   type: boolean
 */

router.get('/:username', function (req, res, next) {
    const query = 'SELECT * FROM partner WHERE username = ?';
    if (!req.params.username) {
        res.status(400).json({ error: 'The request has missing information!', success: false });
        return;
    }
    req.db.query(query, [req.params.username], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message, success: false });
            return;
        }
        res.json({ result, success: true });
    });
});

/**
 * @openapi
 * /partners/addPartner:
 *   post:
 *     tags:
 *      - partners
 *     description: Add an partner.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 information:
 *                   type: string
 *     responses:
 *       200:
 *         description: Partner added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Error caused by an inappropriate input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 * */

router.post('/addPartner', function (req, res, next) {
    const insertQuery = 'INSERT INTO partner (username, email, password, information) VALUES (?, ?, ?, ?)';
    const checkPartner = 'SELECT COUNT(idPartner) AS count FROM partner WHERE username = ? || email = ?';

    if (!req.body.username || !req.body.password || !req.body.email) {
        res.status(400).json({ success: false, error: 'Please fill out all the fields!' });
        return;
    }
    if (req.body.username.length < 5) {
        res.status(400).json({ success: false, error: 'The username must have at least 5 characters!' });
        return;
    }
    if (req.body.password.length < 5) {
        res.status(400).json({ success: false, error: 'The password must have at least 5 characters!' });
        return;
    }
    if (req.body.username.length > 30) {
        res.status(400).json({ success: false, error: 'The username must have at most 30 characters!' });
        return;
    }
    if (req.body.password.length > 30) {
        res.status(400).json({ success: false, error: 'The password must have at most 30 characters!' });
        return;
    }

    const hasUpperCase = /[A-Z]/.test(req.body.password); // regex test for uppercase
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(req.body.password); // regex test for special char
    if (!hasUpperCase || !hasSpecialChar) {
        res.status(400).json({ success: false, error: 'The password must have at least one uppercase letter and one special character!' });
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
        res.status(400).json({ success: false, error: 'Invalid email format!' });
        return;
    }

    // Hash the password using MD5
    const hashedPassword = crypto.createHash('md5').update(req.body.password).digest('hex');
    req.db.beginTransaction((err) => {

        if (err) {
            res.status(500).json({ success: false, error: err.message });
            return;
        }

        req.db.query(checkPartner, [req.body.username, req.body.email], (err, result) => {
            if (err) {
                res.status(500).json({ success: false, error: err.message });
                return;
            }
            if (result[0]['count'] > 0) {
                res.status(400).json({ success: false, error: 'The partner already exists!' });
                return;
            }

            req.db.query(insertQuery, [req.body.username, req.body.email, hashedPassword, req.body.information], (err, result) => {
                if (err) {
                    res.status(500).json({ success: false, error: err.message });
                    return;
                }

                req.db.commit((err) => {
                    if (err) {
                        return req.db.rollback(() => {
                            res.status(500).json({ success: false, error: err.message });
                        });
                    }
                    res.json({ success: true, message: 'Partner added successfully!' });
                });
            });
        });
    });
});

/**
 * @openapi
 * /partners/login:
 *   post:
 *     tags:
 *      - partners
 *     description: Login a partner.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *       401:
 *         description: Bad login.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 */
router.post('/login', function (req, res, next) {
    const { username, password } = req.body;
    const query = 'SELECT * FROM partner WHERE username = ?';

    // Hash the password using MD5
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

    req.db.query(query, [username], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
            return;
        }
        if (results.length > 0) {
            const partner = results[0];
            if (partner.password == hashedPassword) {
                const token = jwt.sign({ id: partner.idPartner, username: partner.username }, 'exchange-secret-key', { expiresIn: '24h' });
                res.json({ success: true, token: token });
            } else {
                res.status(401).json({ success: false, error: 'Incorrect login details!' });
            }
        } else {
            res.status(401).json({ success: false, error: 'Incorrect login details!' });
        }
    });
});

module.exports = router;