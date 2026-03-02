import { FastifyRequest, FastifyReply } from 'fastify';
import { ResponseHelper } from '../helpers/response.helper';

/**
 * Global authentication or request validation middleware.
 * This function will run before any route handler processes the request.
 */
export const globalMiddleware = async (req: FastifyRequest, reply: FastifyReply) => {
    // You can add global logic here (e.g., Token Validation, API Key checks, Request Logging)
    console.log(`[Middleware] Incoming payload to: ${req.url} [Method: ${req.method}]`);
    
    // Example Authorization Check: Uncomment to enforce token validation
    /*
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Will reject the request and immediately prevent the route handler from running
        return ResponseHelper.error(reply, "Unauthorized access", 401);
    }
    */
};
