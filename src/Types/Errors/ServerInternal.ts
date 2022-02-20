import { ApolloError } from 'apollo-server-errors';

export default class ServerInternal extends ApolloError {
  constructor(message: string) {
    super(message, 'SERVER_INTERNAL_ERROR');

    Object.defineProperty(this, 'name', { value: 'ServerInternal' });
  }
}