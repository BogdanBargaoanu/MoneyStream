var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

/**
 * @openapi
 * /currency:
 *   get:
 *     tags:
 *      - currency
 *     description: Gets the list of currencies.
 *     responses:
 *       200:
 *         description: Returns the currencies.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idCurrency:
 *                   type: integer
 *                 name:
 *                  type: string
 *                 success:
 *                  type: boolean
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

router.get('/', function (req, res, next) {
  const query = `SELECT * FROM currency`;
  req.db.query(query, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message, success: false });
      return;
    }
    res.json({ result, success: true });
  });
});

module.exports = router;