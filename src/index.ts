require('reflect-metadata');
require('dotenv').config();
require('module-alias/register');

import { ApolloServerExpress, connectDB, connectTypeorm, Logger } from './Configs';

const main = async () => {
    const PORT = process.env.PORT || 4000;

    await connectDB();
    await connectTypeorm();
    const { apolloServer, httpServer } = await ApolloServerExpress();

    httpServer.listen(PORT, () =>
        Logger.success(`Server is running on: http://localhost:${PORT}${apolloServer.graphqlPath}`)
    );
};

main().catch((err) => Logger.error(err));
