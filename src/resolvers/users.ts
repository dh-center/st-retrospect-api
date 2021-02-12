import { ObjectId } from 'mongodb';
import { ResolverContextBase, UpdateMutationPayload } from '../types/graphql';
import { InvalidAccessToken } from '../errorTypes';
import { UserInputError } from 'apollo-server-express';
import emptyMutation from '../utils/emptyMutation';

/**
 * Information about user in database
 */
export interface UserDBScheme {
  /**
   * User id
   */
  _id: ObjectId;

  /**
   * Username
   */
  username: string;

  /**
   * User password for logging in
   */
  password?: string;

  /**
   * User photo
   */
  photo?: string | null;

  /**
   * User email address
   */
  email?: string;

  /**
   * Is user with administrator privileges or not
   */
  isAdmin?: boolean;

  /**
   * User first name
   */
  firstName?: string | null;

  /**
   * User last name
   */
  lastName?: string | null;

  /**
   * User experience
   */
  exp: number;

  /**
   * User level
   */
  level: number;

  /**
   * Information about auth providers
   */
  auth?: {
    /**
     * Info about user's google account
     */
    google?: {
      /**
       * Google id of the user
       */
      id: string;
    };

    /**
     * Info about user's vk account
     */
    vk?: {
      /**
       * Vk account id
       */
      id: number
    }

    /**
     * Info about user's Facebook account
     */
    facebook?: {
      /**
       * Facebook account id
       */
      id: number
    }
  }
}

const Query = {
  /**
   * Returns the data of the user who makes the request
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async me(parent: undefined, args: undefined, {
    db,
    user,
  }: ResolverContextBase): Promise<UserDBScheme | null> {
    const currentUser = await db.collection<UserDBScheme>('users')
      .findOne({ _id: new ObjectId(user.id) });

    if (!currentUser) {
      throw new InvalidAccessToken();
    }

    return currentUser;
  },
};

const UserMutations = {
  /**
   * Gives the user the experience of the completed quest
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async completeQuest(
    parent: undefined,
    { questId }: { questId: string },
    { collection, user }: ResolverContextBase
  ): Promise<UpdateMutationPayload<UserDBScheme>> {
    console.log('questId');

    const completedQuest = await collection('quests').findOne({ _id: new ObjectId(questId) });

    if (!completedQuest) {
      throw new UserInputError('There is no quest with such id: ' + questId);
    }

    const updatedUser = await collection('users').findOneAndUpdate(
      { _id: new ObjectId(user.id) },
      {
        $inc: {
          exp: completedQuest?.earnedExp,
        },
      },
      { returnOriginal: false });

    if (!updatedUser.value) {
      throw new InvalidAccessToken();
    }

    return {
      recordId: new ObjectId(user.id),
      record: updatedUser.value,
    };
  },
};

const User = {
  /**
   * Return user level based on user exp
   *
   * @param parent - user from parent resolver
   */
  async level(parent: UserDBScheme): Promise<number> {
    const userExp = parent.exp;

    return Math.trunc(userExp / 100);
  },
};

const Mutation = {
  user: emptyMutation,
};

export default {
  Query,
  UserMutations,
  User,
  Mutation,
};
