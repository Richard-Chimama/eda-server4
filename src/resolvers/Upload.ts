import { GraphQLScalarType, Kind } from 'graphql';


export const UploadScalar = new GraphQLScalarType({
    name: 'Upload',
    description: 'The `Upload` scalar type represents a file upload.',
    parseValue(value) {
      return value; // value from the client input variables
    },
    serialize(value) {
      return value; // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value; // hard-coded value in the GraphQL query
      }
      return null;
    },
  });
  