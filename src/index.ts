require('reflect-metadata');
require('dotenv').config();
require('module-alias/register');

import { ApolloServerExpress, app, connectDB, connectTypeorm, Logger } from './Configs';

const main = async () => {
    const PORT = process.env.PORT || 4000;

    await connectDB();
    await connectTypeorm();
    const apolloServer = await ApolloServerExpress(app);

    app.listen(PORT, () =>
        Logger.success(`Server is running on: http://localhost:${PORT}${apolloServer.graphqlPath}`)
    );
};

main().catch((err) => console.log(err));
