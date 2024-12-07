import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

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
                url: 'http://localhost:8000', // Change it based on your server configuration
            },
        ],
    },
    apis: [path.join(__dirname, '../src/routes/*')], // Path to the API route files
};

export const swaggerSpec = swaggerJsdoc(options);
