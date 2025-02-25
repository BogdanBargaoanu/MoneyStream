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
 *     security:
 *       - BearerAuth: []
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

  const query = `SELECT * FROM currency`;
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
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get('/public', function (req, res, next) {
  const query = `SELECT * FROM currency`;
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
 * /currency/insert:
 *   post:
 *     tags:
 *      - currency
 *     description: Add a currency.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the entity.
 *     responses:
 *       200:
 *         description: Currency added successfully.
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
 * */

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

  const insertQuery = 'INSERT INTO currency (name) VALUES (?)';
  const checkName = 'SELECT COUNT(idCurrency) AS count FROM currency WHERE name = ?';
  if (!req.body.name) {
    res.status(400).json({ error: 'The request has missing information!' });
    return;
  }
  if (req.body.name.length < 2) {
    res.status(400).json({ error: 'The name must have at least 2 characters!' });
    return;
  }
  if (req.body.name.length > 50) {
    res.status(400).json({ error: 'The name must have at most 50 characters!' });
    return;
  }
  req.db.beginTransaction((err) => {

    if (err) {
      res.status(500).json({ error: err.message, success: false });
      return;
    }

    req.db.query(checkName, [req.body.name], (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (result[0]['count'] > 0) {
        res.status(400).json({ error: 'The currency already exists!', success: false });
        return;
      }

      req.db.query(insertQuery, [req.body.name, req.body.isUser], (err, result) => {
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
          res.status(201).json({ message: 'Currency added successfully!', success: true });
        });
      });
    });
  });
});

/**
 * @openapi
 * /currency/update:
 *   put:
 *     tags:
 *      - currency
 *     description: Update a currency.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idCurrency:
 *                 type: integer
 *                 description: The ID of the currency.
 *               name:
 *                 type: string
 *                 description: The name of the currency.
 *     responses:
 *       200:
 *         description: Currency updated successfully.
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
 * */

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

  const updateQuery = 'UPDATE currency SET name = ? WHERE idCurrency = ?';
  const checkName = 'SELECT COUNT(idCurrency) AS count FROM currency WHERE name = ? AND idCurrency != ?';
  if (!req.body.idCurrency || !req.body.name) {
    res.status(400).json({ error: 'The request has missing information!', success: false });
    return;
  }
  if (req.body.name.length < 2) {
    res.status(400).json({ error: 'The name must have at least 2 characters!', success: false });
    return;
  }
  if (req.body.name.length > 50) {
    res.status(400).json({ error: 'The name must have at most 50 characters!', success: false });
    return;
  }
  req.db.beginTransaction((err) => {

    if (err) {
      res.status(500).json({ error: err.message, success: false });
      return;
    }

    req.db.query(checkName, [req.body.name, req.body.idCurrency], (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message, success: false });
        return;
      }
      if (result[0]['count'] > 0) {
        res.status(400).json({ error: 'The currency name already exists!', success: false });
        return;
      }

      req.db.query(updateQuery, [req.body.name, req.body.idCurrency], (err, result) => {
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
          res.json({ message: 'Currency updated successfully!', success: true });
        });
      });
    });
  });
});

/**
 * @openapi
 * /currency/delete:
 *   delete:
 *     tags:
 *      - currency
 *     description: Delete a currency.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idCurrency:
 *                 type: integer
 *                 description: The ID of the currency to delete.
 *     responses:
 *       200:
 *         description: Currency deleted successfully.
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
 * */

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

  const deleteQuery = 'DELETE FROM currency WHERE idCurrency = ?';
  if (!req.body.idCurrency) {
    res.status(400).json({ error: 'The request has missing information!', success: false });
    return;
  }

  req.db.beginTransaction((err) => {
    if (err) {
      res.status(500).json({ error: err.message, success: false });
      return;
    }

    req.db.query(deleteQuery, [req.body.idCurrency], (err, result) => {
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
        res.json({ message: 'Currency deleted successfully!', success: true });
      });
    });
  });
});

module.exports = router;