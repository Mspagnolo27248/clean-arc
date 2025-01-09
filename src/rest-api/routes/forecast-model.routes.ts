import { ForecastModelController } from "../controllers/forecast-model-controller";

const express = require("express");
const forecastModelRoutes = express.Router();

/**
 * @swagger
 * /forecast-model/save/{id}:
 *   post:
 *     summary: Save a forecast model.
 *     description: Save a forecast model with optional ID. If no ID is provided, a new one will be generated.
 *     tags:
 *       - ForecastModel # Group this under ForecastModel
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false
 *         description: ID of the forecast model.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ModelMetaData:
 *                 type: object
 *                 properties:
 *                   uid:
 *                     type: string
 *     responses:
 *       200:
 *         description: Model saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 *       500:
 *         description: Error saving the model.
 */
forecastModelRoutes.post("/save/:id?", ForecastModelController.saveModel);

/**
 * @swagger
 * /forecast-model/load/{id}:
 *   post:
 *     summary: Load a forecast model.
 *     description: Load a forecast model by ID.
 *     tags:
 *       - ForecastModel # Group this under ForecastModel
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the forecast model to load.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Model loaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Error loading the model.
 */
forecastModelRoutes.post("/load/:id", ForecastModelController.loadModel);

/**
 * @swagger
 * /forecast-model/run:
 *   post:
 *     summary: Run a forecast model.
 *     description: Execute a forecast model and return the results.
 *     tags:
 *       - ForecastModel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForecastModelInputs'
 *     responses:
 *       200:
 *         description: Model run successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForecastModelOutputParams'
 *       500:
 *         description: Error running the model.
 */
forecastModelRoutes.post("/run", ForecastModelController.runModel);

export default forecastModelRoutes;
