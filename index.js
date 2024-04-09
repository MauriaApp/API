import { getAllNote } from './notes.js';
import { getAllAbsence } from './absences.js';
import { getPlanning } from './planning.js';
import { getExactPlanning } from './exactPlanning.js';
import { PostStatsNotes, GetStatsNotes } from './statsNotes.js';
import { getEventJunia } from './eventJunia.js';
import { getTools } from './tools.js';
import login from './login.js';

import express from 'express';
import cors from 'cors';

import { getAssos } from './assos.js';
import { getMsg } from './msg.js';
import { getUpdate } from './update.js';

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

// Documentez vos routes avec des commentaires JSDoc
/**
 * @swagger
 * /:
 *   get:
 *     summary: Accueil de l'API
 *     description: Endpoint d'accueil de l'API.
 *     responses:
 *       '200':
 *         description: Message d'accueil.
 */

app.get('/', function (req, res) {
  res.send("Hello World! Il n'y a rien ici :(");
});

/**
 * @swagger
 * /assos:
 *   get:
 *     summary: Récupérer la liste des associations
 *     responses:
 *       '200':
 *         description: Liste des associations récupérée avec succès
 *       '500':
 *         description: Erreur serveur
 */
app.get('/assos', function (req, res) {
  getAssos()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * @swagger
 * /msg:
 *   get:
 *     summary: Récupérer des messages
 *     responses:
 *       '200':
 *         description: Messages récupérés avec succès
 *       '500':
 *         description: Erreur serveur
 */
app.get('/msg', function (req, res) {
  getMsg()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * @swagger
 * /tools:
 *   get:
 *     summary: Récupérer les outils Junia
 *     responses:
 *       '200':
 *         description: Liste récupérée avec succès
 *       '500':
 *         description: Erreur serveur
 */
app.get('/tools', function (req, res) {
  getTools()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * @swagger
 * /update:
 *   get:
 *     summary: Obtenir des mises à jour
 *     responses:
 *       '200':
 *         description: Mises à jour récupérées avec succès
 *       '500':
 *         description: Erreur serveur
 */
app.get('/update', function (req, res) {
  getUpdate()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Obtenir les événements Junia
 *     responses:
 *       '200':
 *         description: Events récupérées avec succès
 *       '500':
 *         description: Erreur serveur
 */
app.get('/events', function (req, res) {
  getEventJunia()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authentification de l'utilisateur
 *     requestBody:
 *       description: Les informations d'authentification de l'utilisateur
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe
 *     responses:
 *       '200':
 *         description: Authentification réussie
 *       '401':
 *         description: Échec de l'authentification
 */
app.post('/login', function (req, res) {
  login(req.body.username, req.body.password)
    .then((result) => {
      res.sendStatus(result[1]);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Récupérer des notes
 *     requestBody:
 *       description: Les informations d'authentification de l'utilisateur
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe
 *     responses:
 *       '200':
 *         description: Notes récupérées avec succès
 *       '401':
 *         description: Échec de l'authentification
 */
app.post('/notes', function (req, res) {
  getAllNote(req.body.username, req.body.password)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * @swagger
 * /absences:
 *   post:
 *     summary: Récupérer des absences
 *     requestBody:
 *       description: Les informations d'authentification de l'utilisateur
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe
 *     responses:
 *       '200':
 *         description: Absences récupérées avec succès
 *       '401':
 *         description: Échec de l'authentification
 */
app.post('/absences', function (req, res) {
  getAllAbsence(req.body.username, req.body.password)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});
/**
 * @swagger
 * /planning:
 *   post:
 *     summary: Récupérer le planning
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *         description: La date de début au format YYYY-MM-DD
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *         description: La date de fin au format YYYY-MM-DD (osef, on l'utilise pas)
 *     requestBody:
 *       description: Les informations d'authentification de l'utilisateur
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe
 *     responses:
 *       '200':
 *         description: Planning récupéré avec succès
 *       '401':
 *         description: Échec de l'authentification
 */
app.post('/planning', function (req, res) {
  getPlanning(req.body.username, req.body.password, req.query.start, req.query.end)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * @swagger
 * /exactPlanning:
 *   post:
 *     summary: Récupérer le planning
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *         description: La date de début au format YYYY-MM-DD (NECESSAIRE)
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *         description: La date de fin au format YYYY-MM-DD (NECESSAIRE)
 *     requestBody:
 *       description: Les informations d'authentification de l'utilisateur
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe
 *     responses:
 *       '200':
 *         description: Planning récupéré avec succès
 *       '401':
 *         description: Échec de l'authentification
 */
app.post('/exactPlanning', function (req, res) {
  getExactPlanning(req.body.username, req.body.password, req.query.start, req.query.end)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * @swagger
 * /poststats:
 *   post:
 *     summary: Envoyer des statistiques de notes
 *     requestBody:
 *       description: Les informations d'authentification de l'utilisateur et les statistiques partagées
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe
 *               shared:
 *                 type: boolean
 *                 description: Statistiques partagées
 *     responses:
 *       '200':
 *         description: Statistiques de notes envoyées avec succès
 *       '401':
 *         description: Échec de l'authentification
 */
app.post('/poststats', function (req, res) {
  PostStatsNotes(req.body.username, req.body.password, req.body.shared)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * @swagger
 * /getstats:
 *   post:
 *     summary: Récupérer des statistiques de notes
 *     requestBody:
 *       description: Les informations d'authentification de l'utilisateur
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe
 *     responses:
 *       '200':
 *         description: Statistiques de notes récupérées avec succès
 *       '401':
 *         description: Échec de l'authentification
 */
app.post('/getstats', function (req, res) {
  GetStatsNotes(req.body.username, req.body.password)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

// Ajoutez Swagger UI à votre application
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Mauria',
      version: '1.0.0',
      description: 'API pour l\'application Mauria permettant la récupération de données Aurion et Strapi',
    },
    servers: [
      {
        url: 'https://mauriaapi.fly.dev/',
        description: 'Serveur Fly.io',
      },
    ],
  },
  apis: ["./index.js"], // Incluez ce fichier lui-même pour générer la documentation
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
