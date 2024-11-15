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

  const query = `SELECT rate.idRates, rate.idLocation, location.address, rate.idCurrency, currency.name, rate.date, rate.value  FROM rate
                    INNER JOIN location ON rate.idLocation = location.idLocation
                    INNER JOIN currency ON rate.idCurrency = currency.idCurrency
                    WHERE location.idPartner = ${userId}`;
  req.db.query(query, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message, success: false });
      return;
    }
    res.json({ result, success: true });
  });
});

module.exports = router;