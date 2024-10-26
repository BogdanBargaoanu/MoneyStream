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
      res.json({result, success: true });
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
      res.status(400).json({ error: 'The request has missing information!' });
      return;
    }
    req.db.query(query, [req.params.username], (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message, success: false });
        return;
      }
      res.json({result, success: true });
    });
  });

module.exports = router;