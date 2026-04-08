import { config } from 'dotenv';
config();

// Import flows to ensure they are registered with the Genkit instance
import './flows/chat-flow';
import './flows/recommend-projects-flow';

// Genkit flows registered - no console output to prevent leakage
