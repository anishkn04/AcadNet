import express from 'express'

const router = express.Router()

// Placeholder for authentication-related endpoints
// Example: Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ message: 'Auth router is working' });
});
export default router