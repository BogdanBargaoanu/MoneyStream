var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

/**
 * @openapi
 * /location:
 *   get:
 *     tags:
 *      - location
 *     description: Gets the list of locations.
 *     security:
 *       - BearerAuth: []
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
 * /location/partner:
 *   get:
 *     tags:
 *      - location
 *     description: Gets the list of locations for a specific partner.
 *     security:
 *       - BearerAuth: []
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
 *                 username:
 *                   type: string
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

router.get('/partner', function (req, res, next) {
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

  const idPartner = userId;
  const query = `SELECT location.idLocation, location.idPartner, partner.username, location.latitude, location.longitude, location.address, location.information
                FROM location
                INNER JOIN partner ON location.idPartner = partner.idPartner
                WHERE location.idPartner = ?`;
  req.db.query(query, [idPartner], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message, success: false });
      return;
    }
    res.json({ result, success: true });
  });
});

/**
 * @openapi
 * /location/insert:
 *   post:
 *     tags:
 *      - location
 *     description: Add a location.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 description: The address of the location.
 *               latitude:
 *                 type: number
 *                 format: double
 *                 description: The latitude of the location.
 *               longitude:
 *                 type: number
 *                 format: double
 *                 description: The longitude of the location.
 *               information:
 *                 type: string
 *                 description: Additional information about the location.
 *     responses:
 *       200:
 *         description: Location added successfully.
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

  const { address, latitude, longitude, information } = req.body;
  const insertQuery = 'INSERT INTO location (idPartner, address, latitude, longitude, information) VALUES (?, ?, ?, ?, ?)';
  const checkLocation = 'SELECT COUNT(idLocation) AS count FROM location WHERE address = ?';

  console.log(req.body);
  if (!address || !latitude || !longitude || !information) {
    res.status(400).json({ error: 'The request has missing information!', success: false });
    return;
  }

  req.db.beginTransaction((err) => {
    if (err) {
      res.status(500).json({ error: err.message, success: false });
      return;
    }

    req.db.query(checkLocation, [address], (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message, success: false });
        return;
      }
      if (result[0]['count'] > 0) {
        res.status(400).json({ error: 'The location already exists!', success: false });
        return;
      }

      req.db.query(insertQuery, [userId, address, latitude, longitude, information], (err, result) => {
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
          res.status(201).json({ message: 'Location added successfully!', success: true });
        });
      });
    });
  });
});

/**
* @openapi
* /location/update:
*   put:
*     tags:
*      - location
*     description: Update a location.
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
*                 description: The ID of the location.
*               address:
*                 type: string
*                 description: The address of the location.
*               latitude:
*                 type: number
*                 format: double
*                 description: The latitude of the location.
*               longitude:
*                 type: number
*                 format: double
*                 description: The longitude of the location.
*               information:
*                 type: string
*                 description: Additional information about the location.
*     responses:
*       200:
*         description: Location updated successfully.
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

  const { idLocation, address, latitude, longitude, information } = req.body;
  if (!idLocation || !address || !latitude || !longitude || !information) {
    res.status(400).json({ error: 'The request has missing information!', success: false });
    return;
  }

  const updateQuery = 'UPDATE location SET address = ?, latitude = ?, longitude = ?, information = ? WHERE idLocation = ?';
  const checkLocation = 'SELECT COUNT(idLocation) AS count FROM location WHERE idPartner = ? AND address = ? AND idLocation != ?';

  req.db.beginTransaction((err) => {
    if (err) {
      res.status(500).json({ error: err.message, success: false });
      return;
    }

    req.db.query(checkLocation, [userId, address, idLocation], (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message, success: false });
        return;
      }
      if (result[0]['count'] > 0) {
        res.status(400).json({ error: 'The location already exists!', success: false });
        return;
      }

      req.db.query(updateQuery, [address, latitude, longitude, information, idLocation, userId], (err, result) => {
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
          res.json({ message: 'Location updated successfully!', success: true });
        });
      });
    });
  });
});

/**
 * @openapi
 * /location/delete:
 *   delete:
 *     tags:
 *      - location
 *     description: Delete a location.
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
 *                 description: The ID of the location to delete.
 *     responses:
 *       200:
 *         description: Location deleted successfully.
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

  const idLocation = req.body.idLocation;
  const deleteQuery = 'DELETE FROM location WHERE idLocation = ?';
  if (!idLocation) {
    res.status(400).json({ error: 'The request has missing information!', success: false });
    return;
  }

  req.db.beginTransaction((err) => {
    if (err) {
      res.status(500).json({ error: err.message, success: false });
      return;
    }

    req.db.query(deleteQuery, [idLocation], (err, result) => {
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
        res.json({ message: 'Location deleted successfully!', success: true });
      });
    });
  });
});

module.exports = router;