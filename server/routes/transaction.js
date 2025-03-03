var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

/**
 * @openapi
 * /transaction:
 *   get:
 *     tags:
 *      - transaction
 *     description: Gets transactions with main and partner rate details
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns transactions with associated partner details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idTransaction:
 *                   type: integer
 *                 transactionValue:
 *                   type: number
 *                   format: double
 *                 mainRateValue:
 *                   type: number
 *                   format: double
 *                 mainCurrency:
 *                   type: string
 *                 mainAddress:
 *                   type: string
 *                 mainUsername:
 *                   type: string
 *                 partnerRateValue:
 *                   type: number
 *                   format: double
 *                   nullable: true
 *                 partnerCurrency:
 *                   type: string
 *                   nullable: true
 *                 partnerAddress:
 *                   type: string
 *                   nullable: true
 *                 partnerUsername:
 *                   type: string
 *                   nullable: true
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
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get('/', function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'No authorization header', success: false });
        return;
    }

    const token = authHeader.split(' ')[1];
    let userId;
    try {
        const decoded = jwt.verify(token, secretKey);
        userId = decoded.id;
    } catch (err) {
        res.status(401).json({ error: 'Invalid token', success: false });
        return;
    }

    const query = `
        SELECT 
            t.idTransaction,
            t.value AS transactionValue,
            /* Main rate details */
            r.value AS mainRateValue,
            c.name AS mainCurrency,
            l.address AS mainAddress,
            p.username AS mainUsername,
            /* Partner rate details with null handling */
            COALESCE(pr.value, 0) AS partnerRateValue,
            COALESCE(pc.name, '') AS partnerCurrency,
            COALESCE(pl.address, '') AS partnerAddress,
            COALESCE(pp.username, '') AS partnerUsername
        FROM transaction t
        INNER JOIN rate r ON t.idRate = r.idRates
        INNER JOIN location l ON r.idLocation = l.idLocation
        INNER JOIN currency c ON r.idCurrency = c.idCurrency
        INNER JOIN partner p ON l.idPartner = p.idPartner
        /* Left joins for optional partner rate */
        LEFT JOIN rate pr ON t.idPartnerRate = pr.idRates
        LEFT JOIN location pl ON pr.idLocation = pl.idLocation
        LEFT JOIN currency pc ON pr.idCurrency = pc.idCurrency
        LEFT JOIN partner pp ON pl.idPartner = pp.idPartner
        WHERE l.idPartner = ${userId}
        ORDER BY t.idTransaction ASC`;

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
 * /transaction:
 *   post:
 *     tags:
 *       - transaction
 *     description: Create a new transaction
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idRate
 *               - value
 *             properties:
 *               idRate:
 *                 type: integer
 *                 description: ID of the main rate
 *               idPartnerRate:
 *                 type: integer
 *                 nullable: true
 *                 description: ID of the partner rate (optional)
 *               value:
 *                 type: number
 *                 format: double
 *                 description: Transaction value
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
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
 *       401:
 *         description: Unauthorized
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
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.post('/', function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header', success: false });
    }

    const token = authHeader.split(' ')[1];
    try {
        jwt.verify(token, secretKey);
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token', success: false });
    }

    const { idRate, idPartnerRate, value } = req.body;
    if (!idRate || !value) {
        return res.status(400).json({ error: 'Missing required fields', success: false });
    }

    const query = `INSERT INTO transaction (idRate, idPartnerRate, value) VALUES (?, ?, ?)`;
    req.db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ error: err.message, success: false });
        }
        req.db.query(query, [idRate, idPartnerRate || null, value], (err, result) => {
            if (err) {
                return req.db.rollback(() => {
                    res.status(500).json({ error: err.message, success: false });
                });
            }
            req.db.commit((err) => {
                if (err) {
                    return req.db.rollback(() => {
                        res.status(500).json({ error: err.message, success: false });
                    });
                }
                res.status(201).json({ id: result.insertId, success: true });
            });
        });
    })
});

/**
 * @openapi
 * /transaction/delete:
 *   delete:
 *     tags:
 *       - transaction
 *     description: Delete a transaction by ID
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idTransaction:
 *                 type: integer
 *                 description: The ID of the transaction to delete.
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
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
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.delete('/delete', function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header', success: false });
    }

    const token = authHeader.split(' ')[1];
    try {
        jwt.verify(token, secretKey);
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token', success: false });
    }

    const transactionId = parseInt(req.body.idTransaction);
    if (isNaN(transactionId)) {
        return res.status(400).json({ error: 'Invalid transaction ID', success: false });
    }

    const query = `DELETE FROM transaction WHERE idTransaction = ?`;

    req.db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ error: err.message, success: false });
        }

        req.db.query(query, [transactionId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message, success: false });
            }

            req.db.commit((err) => {
                if (err) {
                    return req.db.rollback(() => {
                        res.status(500).json({ error: err.message, success: false });
                    });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Transaction not found', success: false });
                }
                res.json({ message: 'Transaction deleted successfully!', success: true });
            });
        });
    });
});

module.exports = router;