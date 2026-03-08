import { config } from 'dotenv';
config();

// Import flows to ensure they are registered with the Genkit instance
import './flows/chat-flow';
import './flows/recommend-projects-flow';

console.log('Genkit flows registered for development.');
