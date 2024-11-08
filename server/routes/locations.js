var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

/**
 * @openapi
 * /locations:
 *   get:
 *     tags:
 *      - locations
 *     description: Gets the list of locations.
 *     responses:
 *       200:
 *         description: Returns the locations.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idLocation:
 *                   type: integer
 *                 idPartner:
 *                   type: integer
 *                 address:
 *                   type: string
 *                 latitude:
 *                   type: number
 *                   format: double
 *                 longitude:
 *                   type: number
 *                   format: double
 *                 information:
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

  const query = `SELECT * FROM location`;
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
 * /locations/{idPartner}:
 *   get:
 *     tags:
 *      - locations
 *     description: Gets the list of locations for a specific partner.
 *     parameters:
 *       - name: idPartner
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns the locations.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idLocation:
 *                   type: integer
 *                 idPartner:
 *                   type: integer
 *                 address:
 *                   type: string
 *                 latitude:
 *                   type: number
 *                   format: double
 *                 longitude:
 *                   type: number
 *                   format: double
 *                 information:
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

router.get('/:idPartner', function (req, res, next) {
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
  
    const idPartner = req.params.idPartner; // get the idPartner from the URL
    const query = `SELECT * FROM location WHERE idPartner = ?`;
    req.db.query(query, [idPartner], (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message, success: false });
        return;
      }
      res.json({ result, success: true });
    });
  });

module.exports = router;