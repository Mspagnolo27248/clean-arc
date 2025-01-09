import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { swaggerComponents } from './swaggerComponents';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ARG Backend Boiler',
            version: '1.0.0',
            description: 'endpoints to manage application.',
        },
        servers: [
            {
                url: 'http://localhost:8001', // Change it based on your server configuration
            },
        ],
        components: {
            schemas: swaggerComponents.components.schemas, // Integrate your schemas here
          }
    },
    apis: [path.join(__dirname, '../src/rest-api/routes/*')], // Path to the API route files
};

export const swaggerSpec = swaggerJsdoc(options);
