import fastify from "fastify";
import * as short from "short-uuid";
import { sequelize } from "./app/services/database/sequelize.service";
import { IServer, SERVER_CONFIG } from "./app/configs/server.config";
import { registerCors, registerNamespace } from "./app/routes/index.route";
import { globalMiddleware } from "./app/middlewares/global.middleware";

// Only the calls table is needed for this assignment
import "./app/models/call.model";

export const start = async (
    args: { shouldListenOnPort: boolean } = { shouldListenOnPort: true }
) => {
    const serverConfig: IServer = SERVER_CONFIG;
    const serverInstance = getServerInstance(serverConfig);

    try {
        await sequelize.authenticate();

        // Safety net: drop any leftover FK constraints from previous schema experiments
        await sequelize.query(`ALTER TABLE IF EXISTS "calls" DROP CONSTRAINT IF EXISTS "calls_caller_id_fkey"`);
        await sequelize.query(`ALTER TABLE IF EXISTS "calls" DROP CONSTRAINT IF EXISTS "calls_creator_id_fkey"`);

        await sequelize.sync();
        console.log('Connected to PostgreSQL successfully with Sequelize.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    
    // 1. Process CORS First
    await registerCors(serverInstance);

    // 2. Attach Global Middleware (runs on EVERY request)
    serverInstance.addHook('onRequest', globalMiddleware);

    // 3. Register Routes
    await registerNamespace(serverInstance);

    if (args.shouldListenOnPort) {
        await startServer(serverInstance, serverConfig);
    }

    return serverInstance;
};

export const getServerInstance = (config: IServer): import('fastify').FastifyInstance => {
    return fastify({
        trustProxy: true,
        logger: config.ENABLE_SERVER_LOGS
            ? {
                level: "info",
                serializers: {
                    req(req) {
                        return {
                            client_ip: req.ip,
                            url: req.url,
                            method: req.method,
                        };
                    },
                    err(error: Error) {
                        return {
                            message: error.message,
                            stack: error.stack || "",
                            type: "error",
                        };
                    },
                    res(reply: { statusCode: number }) {
                        return {
                            statusCode: reply.statusCode,
                        };
                    },
                },
            }
            : false,
        genReqId: () => short.generate(),
        pluginTimeout: 20000,
        exposeHeadRoutes: false,
    });
};

export const startServer = async (
    server: import('fastify').FastifyInstance,
    config: IServer
) => {
    try {
        if (config.NODE_ENV === "production") {
            ["SIGINT", "SIGTERM"].forEach((signal) => {
                process.on(signal, () =>
                    server.close().then((err: Error | undefined) => {
                        console.log(`close application on ${signal}`);
                        process.exit(err ? 1 : 0);
                    })
                );
            });
        }

        await server.listen({ port: config.PORT, host: config.ADDRESS });
        console.log("Leaderboard Service running on port", config.PORT );
        
        console.log("\nRegistered Routes:\n" + server.printRoutes({ commonPrefix: false }));
        
        return server;
    } catch (e) {
        console.error(e);
        return null;
    }
};
