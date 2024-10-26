var express = require('express');
var router = express.Router();
//const jwt = require('jsonwebtoken');
//const crypto = require('crypto');

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
 *                  type: string
 *                 password:
 *                  type: string
 *                 information:
 *                  type: string
 *                 email:
 *                  type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/* GET partners listing. */
router.get('/', function (req, res, next) {
    const query = 'SELECT * FROM partner';
    req.db.query(query, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(result);
    });
  });

module.exports = router;