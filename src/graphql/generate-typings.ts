import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();

definitionsFactory.generate({
  typePaths: ['./**/*.graphql', './**/*.gql'],
  path: join(process.cwd(), 'src/graphql/graphql.ts'),
  watch: true,
});
