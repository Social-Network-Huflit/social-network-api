require('reflect-metadata');
require('dotenv').config();
import ApolloServerExpress from './Configs/ApolloServerExpress';
import app from './Configs/app';
import Logger from './Configs/Logger';
import connectDB from './Configs/Mongoose';

const main = async () => {
    const PORT = process.env.PORT || 4000;

    await connectDB();
    const apolloServer = await ApolloServerExpress(app);

    app.listen(PORT, () =>
        Logger.success(`Server is running on: http://localhost:${PORT}${apolloServer.graphqlPath}`)
    );
};

main().catch((err) => console.log(err));
