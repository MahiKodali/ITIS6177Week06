const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const { check, validationResult } = require("express-validator");
const { getConnection } = require("./helper");
const OPTIONS= {
    "definition": {
      "openapi": "3.0.0",
      "info": {
        "title": "Swagger Express Excercise API Reference",
        "version": "1.0.0",
        "description": "A Simple Express Swagger API",
        "termsOfService": "http://example.com/terms/",
        "contact": {
          "name": "Mahathi Kodali",
          "url": "https://github.com/MahiKodali",
          "email": "mkodali@uncc.edu"
        }
      },
  
      "servers": [
        {
          "url": "http://161.35.0.52:3000/",
          "description": "Swagger Express API Documentation"
        }
      ]
    },
    "apis": ["./*.js"]
  }
const PORT = process.env.PORT || 3000;
const app = express();
const specs = swaggerJsDoc(OPTIONS);

app.use(cors());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
* @swagger
* components:
*   schemas:
*     Agent:
*       type: object
*       properties:
*         AGENT_CODE:
*           type: string
*         AGENT_NAME:
*           type: string
*         WORKING_AREA:
*           type: string
*         COMMISSION:
*           type: decimal
*         PHONE_NO:
*           type: string
*         COUNTRY:
*           type: string
*/



/**
 * @swagger
 * /agent:
 *   post:
 *     summary: Register an agent
 *     tags: [agent]
 *     requestBody:
 *       content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  AGENT_CODE:
 *                    type: string
 *                    example: A013
 *                  AGENT_NAME:
 *                    type: string
 *                    example: Mahathi
 *                  WORKING_AREA:
 *                    type: string
 *                    example: Charlotte
 *                  COMMISSION:
 *                    type: decimal
 *                    example: 0.99
 *                  PHONE_NO:
 *                    type: string
 *                    example: 980-230-2046
 *                  COUNTRY:
 *                    type: string
 *                    example: USA
 *     responses:
 *       200:
 *         description: Succesfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Could not register
 */

app.post("/agent", (req, res) => {
    let body=req.body;
    getConnection()
      .then((conn) => {
        conn
          .query("INSERT INTO agents (AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY) VALUES (?,?,?,?,?,?)",
          [body.AGENT_CODE, body.AGENT_NAME, body.WORKING_AREA, body.COMMISSION, body.PHONE_NO, body.COUNTRY])
          .then((rows) => {
            res.json(rows);
            conn.release();
          })
          .catch((err) => {
            console.log(err);
            conn.end();
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
/**
 * @swagger
 * /agents:
 *   get:
 *     summary: Returns the list of all the agents
 *     tags: [agent]
 *     responses:
 *       200:
 *         description: The list of the agents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agent'
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Could not get agents
 */
app.get("/agents", (req, res) => {
  getConnection()
    .then((conn) => {
      conn
        .query("SELECT * from agents")
        .then((rows) => {
          res.json(rows);
          conn.release();
        })
        .catch((err) => {
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {
      console.log(err);
    });
});
/**
 * @swagger
 * /agent:
 *   put:
 *     summary: Updates an agent information
 *     tags: [agent]
 *     requestBody:
 *       content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  AGENT_CODE:
 *                    type: string
 *                    example: A013
 *                  AGENT_NAME:
 *                    type: string
 *                    example: Mahathi Kodali
 * 
 *     responses:
 *       200:
 *         description: Succesfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       422:
 *         description: Updation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Could not update
 */

app.put("/agent", (req, res) => {
    let body=req.body;
    getConnection()
      .then((conn) => {
        conn
          .query("UPDATE agents SET AGENT_NAME = ? WHERE AGENT_CODE = ?",
          [body.AGENT_NAME, body.AGENT_CODE])
          .then((rows) => {
            res.json(rows);
            conn.release();
          })
          .catch((err) => {
            console.log(err);
            conn.end();
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  /**
 * @swagger
 * /agent:
 *   patch:
 *     summary: Updates an agent information
 *     tags: [agent]
 *     requestBody:
 *       content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  AGENT_CODE:
 *                    type: string
 *                    example: A013
 *                  WORKING_AREA:
 *                    type: string
 *                    example: Cary
 *                  COMMISSION:
 *                    type: decimal
 *                    example: 1.05
 *     responses:
 *       200:
 *         description: Succesfully Updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       422:
 *         description: Updation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Could not Update
 */

  app.patch("/agent", (req, res) => {
    let body=req.body;
    getConnection()
      .then((conn) => {
        conn
          .query("UPDATE agents SET COMMISSION = ?, WORKING_AREA = ? WHERE AGENT_CODE = ?",
          [body.COMMISSION, body.WORKING_AREA, body.AGENT_CODE])
          .then((rows) => {
            res.json(rows);
            conn.release();
          })
          .catch((err) => {
            console.log(err);
            conn.end();
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  /**
 * @swagger
 * /agent/{id}:
 *   delete:
 *     summary: Deletes an agent with specified id
 *     tags: [agent]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: A013
 *         required: true
 *         description: id that needs to be deleted
 *     responses:
 *       200:
 *         description: Succesfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Couldn't delete agent
 */
  app.delete("/agent/:id", (req, res) => {
    let id=req.params.id;
    getConnection()
      .then((conn) => {
        conn
          .query("DELETE FROM agents WHERE AGENT_CODE = ?",id)
          .then((rows) => {
            res.json(rows);
            conn.release();
          })
          .catch((err) => {
            console.log(err);
            conn.end();
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  app.get("/orders", (req, res) => {
    getConnection()
      .then((conn) => {
        conn
          .query("SELECT * from orders")
          .then((rows) => {
            res.json(rows);
            conn.release();
          })
          .catch((err) => {
            console.log(err);
            conn.end();
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
                
app.get("/daysorder/:id", (req, res) => {
  var id = req.params.id;
  getConnection()
    .then((conn) => {
      conn
        .query(`SELECT * from daysorder where CUST_CODE = ?`, id)
        .then((rows) => {
          res.json(rows);
          conn.release();
        })
        .catch((err) => {
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get("/customer", (req, res) => {
  var name = req.query.name;
  getConnection()
    .then((conn) => {
      conn
        .query(`SELECT * from customer where CUST_NAME =?`, name)
        .then((rows) => {
          res.json(rows);
          conn.release();
        })
        .catch((err) => {
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));