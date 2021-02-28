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
   * User permissions
   */
  permissions?: string[];

  /**
   * User first name
   */
  firstName?: string | null;

  /**
   * User last name
   */
  lastName?: string | null;

  /**
   * Quests that user complete
   */
  completedQuestsIds?: ObjectId[];

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
    tokenData,
  }: ResolverContextBase<true>): Promise<UserDBScheme | null> {
    console.log(tokenData);
    const currentUser = await db.collection<UserDBScheme>('users')
      .findOne({ _id: new ObjectId(tokenData.userId) });

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
    { questId }: { questId: ObjectId },
    { collection, tokenData }: ResolverContextBase<true>
  ): Promise<UpdateMutationPayload<UserDBScheme>> {
    const completedQuest = await collection('quests').findOne({ _id: questId });
    const currentUser = await collection('users').findOne({ _id: new ObjectId(tokenData.userId) });

    if (!completedQuest) {
      throw new UserInputError('There is no quest with such id: ' + questId);
    }
    if (!currentUser) {
      throw new InvalidAccessToken();
    }

    const isAlreadyCompleted = currentUser.completedQuestsIds?.some(id => id.toString() === questId.toString());

    if (isAlreadyCompleted) {
      return {
        recordId: currentUser._id,
        record: currentUser,
      };
    }

    const updatedUser = await collection('users').findOneAndUpdate(
      { _id: currentUser._id },
      {
        $inc: {
          exp: completedQuest?.earnedExp,
        },
        $addToSet: {
          completedQuestsIds: new ObjectId(questId),
        },
      },
      { returnOriginal: false });

    if (!updatedUser.value) {
      throw new InvalidAccessToken();
    }

    return {
      recordId: currentUser._id,
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

    return userExp ? Math.trunc(userExp / 100) : 0;
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
