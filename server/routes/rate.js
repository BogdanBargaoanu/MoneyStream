var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

/**
 * @openapi
 * /rate:
 *   get:
 *     tags:
 *      - rate
 *     description: Gets the list of rates for a partner.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the rates.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idRates:
 *                   type: integer
 *                 idLocation:
 *                   type: integer
 *                 address:
 *                   type: string
 *                 idCurrency:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 value:
 *                   type: number
 *                   format: double
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

    const token = authHeader.split(' ')[1]; // get the token from the Authorization header
    let userId;
    try {
        const decoded = jwt.verify(token, 'exchange-secret-key'); // verify the token
        userId = decoded.id; // get the partner ID from the decoded token
    } catch (err) {
        res.status(401).json({ error: 'Invalid token', success: false });
        return;
    }

    const query = `SELECT rate.idRates, rate.idLocation, location.address, rate.idCurrency, currency.name, rate.date, rate.value FROM rate
                    INNER JOIN location ON rate.idLocation = location.idLocation
                    INNER JOIN currency ON rate.idCurrency = currency.idCurrency
                    WHERE location.idPartner = ${userId}
                    ORDER BY rate.date ASC`;
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
 * /rate/insert:
 *   post:
 *     tags:
 *      - rate
 *     description: Add a rate.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idLocation:
 *                 type: integer
 *                 description: Foreign key of the location.
 *               idCurrency:
 *                 type: integer
 *                 description: Foreign key of the currency.
 *               date:
 *                 type: string
 *                 format: date-time
 *               value:
 *                 type: number
 *                 format: double
 *     responses:
 *       200:
 *         description: Rate added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
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
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.post('/insert', function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'No authorization header', success: false });
        return;
    }

    const token = authHeader.split(' ')[1]; // get the token from the Authorization header
    let userId;
    try {
        const decoded = jwt.verify(token, 'exchange-secret-key'); // verify the token
        userId = decoded.id; // get the partner ID from the decoded token
    } catch (err) {
        res.status(401).json({ error: 'Invalid token', success: false });
        return;
    }

    const { idLocation, idCurrency, date, value } = req.body;
    console.log(req.body);
    if (!idLocation || !idCurrency || !date || !value) {
        res.status(400).json({ error: 'The request has missing information!', success: false });
        return;
    }
    const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
    const insertQuery = 'INSERT INTO rate (idLocation, idCurrency, date, value) VALUES (?, ?, ?, ?)';

    req.db.beginTransaction((err) => {
        if (err) {
            res.status(500).json({ error: err.message, success: false });
            return;
        }
        req.db.query(insertQuery, [idLocation, idCurrency, formattedDate, value], (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message, success: false });
                return;
            }
            req.db.commit((err) => {
                if (err) {
                    return req.db.rollback(() => {
                        res.status(500).json({ error: err.message, success: false });
                    });
                }
                res.json({ message: 'Rate added successfully!', success: true });
            });
        });
    });
});

/**
* @openapi
* /rate/update:
*   put:
*     tags:
*      - rate
*     description: Update a rate.
*     security:
*       - BearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               idRates:
*                 type: integer
*               idLocation:
*                 type: integer
*                 description: Foreign key of the location.
*               idCurrency:
*                 type: integer
*                 description: Foreign key of the currency.
*               date:
*                 type: string
*                 format: date-time
*               value:
*                 type: number
*                 format: double
*     responses:
*       200:
*         description: Rate updated successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
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
* components:
*   securitySchemes:
*     BearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/

router.put('/update', function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'No authorization header', success: false });
        return;
    }

    const token = authHeader.split(' ')[1]; // get the token from the Authorization header
    let userId;
    try {
        const decoded = jwt.verify(token, 'exchange-secret-key'); // verify the token
        userId = decoded.id; // get the partner ID from the decoded token
    } catch (err) {
        res.status(401).json({ error: 'Invalid token', success: false });
        return;
    }

    const { idRates, idLocation, idCurrency, date, value } = req.body;
    console.log(req.body);
    if (!idRates || !idLocation || !idCurrency || !date || !value) {
        res.status(400).json({ error: 'The request has missing information!', success: false });
        return;
    }
    const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
    const updateQuery = 'UPDATE rate SET idLocation = ?, idCurrency = ?, date = ?, value = ? WHERE idRates = ?';

    req.db.beginTransaction((err) => {
        if (err) {
            res.status(500).json({ error: err.message, success: false });
            return;
        }
        req.db.query(updateQuery, [idLocation, idCurrency, formattedDate, value, idRates], (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message, success: false });
                return;
            }

            req.db.commit((err) => {
                if (err) {
                    return req.db.rollback(() => {
                        res.status(500).json({ error: err.message, success: false });
                    });
                }
                res.json({ message: 'Rate updated successfully!', success: true });
            });
        });
    });
});

/**
 * @openapi
 * /rate/delete:
 *   delete:
 *     tags:
 *      - rate
 *     description: Delete a rate.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idRates:
 *                 type: integer
 *                 description: The ID of the rate to delete.
 *     responses:
 *       200:
 *         description: Rate deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
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
        res.status(401).json({ error: 'No authorization header', success: false });
        return;
    }

    const token = authHeader.split(' ')[1]; // get the token from the Authorization header
    let userId;
    try {
        const decoded = jwt.verify(token, 'exchange-secret-key'); // verify the token
        userId = decoded.id; // get the partner ID from the decoded token
    } catch (err) {
        res.status(401).json({ error: 'Invalid token', success: false });
        return;
    }

    const idRates = req.body.idRates;
    console.log(idRates);
    if (!idRates) {
        res.status(400).json({ error: 'The request has missing information!', success: false });
        return;
    }
    const deleteQuery = 'DELETE FROM rate WHERE idRates = ?';

    req.db.beginTransaction((err) => {
        if (err) {
            res.status(500).json({ error: err.message, success: false });
            return;
        }

        req.db.query(deleteQuery, [idRates], (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message, success: false });
                return;
            }

            req.db.commit((err) => {
                if (err) {
                    return req.db.rollback(() => {
                        res.status(500).json({ error: err.message, success: false });
                    });
                }
                res.json({ message: 'Rate deleted successfully!', success: true });
            });
        });
    });
});

/**
 * @openapi
 * /rate/nearest:
 *   get:
 *     tags:
 *      - rate
 *     description: Gets the top 5 nearest rates ordered by date.
 *     parameters:
 *       - name: latitude
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *           format: double
 *       - name: longitude
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *           format: double
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Returns the nearest rates.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idRates:
 *                   type: integer
 *                 idLocation:
 *                   type: integer
 *                 address:
 *                   type: string
 *                 idCurrency:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 value:
 *                   type: number
 *                   format: double
 *                 distance:
 *                   type: number
 *                   format: double
 *                 page:
 *                   type: integer
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

router.get('/nearest', function (req, res, next) {
    const { latitude, longitude, page = 1 } = req.query;
    const currencyId = req.query.currencyId || -1;
    console.log("Getting nearest rates for currency:", currencyId);
    const limit = 5;
    const offset = (page - 1) * limit;

    if (!latitude || !longitude) {
        res.status(400).json({ error: 'The request has missing information!', success: false });
        return;
    }

    const query = `
        SELECT rate.idRates, rate.idLocation, location.address, rate.idCurrency, currency.name, rate.date, rate.value,
        (6371 * acos(cos(radians(${latitude})) * cos(radians(location.latitude)) * cos(radians(location.longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(location.latitude)))) AS distance
        FROM (
        SELECT idLocation, MAX(date) AS latest_date
        FROM rate
        GROUP BY idLocation
    ) AS latest_rates
        INNER JOIN rate ON rate.idLocation = latest_rates.idLocation AND rate.date = latest_rates.latest_date
		INNER JOIN location ON rate.idLocation = location.idLocation
		INNER JOIN currency ON rate.idCurrency = currency.idCurrency
        WHERE rate.idCurrency = ${currencyId !== -1 ? currencyId : '(SELECT idCurrency FROM currency ORDER BY idCurrency ASC LIMIT 1)'}
        ORDER BY distance, rate.date DESC
        LIMIT ${limit} OFFSET ${offset}`;

    console.log(query);
    req.db.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message, success: false });
            return;
        }
        res.json({ result, page: page, success: true });
    });
});

/**
 * @openapi
 * /rate/allRates:
 *   get:
 *     tags:
 *      - rate
 *     description: Gets the list of rates for public use.
 *     responses:
 *       200:
 *         description: Returns the rates.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idRates:
 *                   type: integer
 *                 idLocation:
 *                   type: integer
 *                 address:
 *                   type: string
 *                 idCurrency:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 value:
 *                   type: number
 *                   format: double
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

router.get('/allRates', function (req, res, next) {

    const query = `SELECT rate.idRates, rate.idLocation, location.address, rate.idCurrency, currency.name, rate.date, rate.value FROM rate
                    INNER JOIN location ON rate.idLocation = location.idLocation
                    INNER JOIN currency ON rate.idCurrency = currency.idCurrency
                    ORDER BY rate.date DESC`;
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
 * /rate/best:
 *   get:
 *     tags:
 *       - rate
 *     description: Gets the top 5 best rates ordered by date.
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Returns the best rates.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idRates:
 *                   type: integer
 *                 idLocation:
 *                   type: integer
 *                 address:
 *                   type: string
 *                 idCurrency:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 value:
 *                   type: number
 *                   format: double
 *                 page:
 *                   type: integer
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

router.get('/best', function (req, res, next) {
    const { page = 1 } = req.query;
    const limit = 5;
    const offset = (page - 1) * limit;

    const query = `
        SELECT rate.idRates, rate.idLocation, location.address, rate.idCurrency, currency.name, rate.date, rate.value
        FROM rate
        INNER JOIN location ON rate.idLocation = location.idLocation
        INNER JOIN currency ON rate.idCurrency = currency.idCurrency
        ORDER BY rate.value DESC, rate.date DESC
        LIMIT ${limit} OFFSET ${offset}`;

    req.db.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message, success: false });
            return;
        }
        res.json({ result, page: page, success: true });
    });
});

module.exports = router;