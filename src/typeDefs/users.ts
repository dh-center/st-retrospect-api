import { gql } from 'apollo-server-express';

export default gql`
    type User {
        """
        User's ID
        """
        id: ID! @renameField(name: "_id")

        """
        Username
        """
        username: String
        
        """
        User saved routes
        """
        savedRoutes: [Route]
    }

    extend type Query {
        """
        Get info about user
        """
        me: User
    }
`;
