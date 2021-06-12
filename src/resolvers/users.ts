import { ObjectId } from 'mongodb';
import { ResolverContextBase, UpdateMutationPayload } from '../types/graphql';
import { ForbiddenAction, InvalidAccessToken } from '../errorTypes';
import { UserInputError } from 'apollo-server-express';
import emptyMutation from '../utils/emptyMutation';
import getUserLevel from '../utils/getUserLevel';
import { UserMutationsUpdateArgs } from '../generated/graphql';

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

  friendsIds?: ObjectId[];

  friendPendingRequestsIds?: ObjectId[];

  friendRequestsIds?: ObjectId[];
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
    const isAvailable = getUserLevel(currentUser.exp) >= completedQuest.minLevel || !completedQuest.minLevel;

    if (!isAvailable) {
      throw new ForbiddenAction();
    }
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
          exp: completedQuest?.earnedExp || 0,
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

  /**
   * Updates user data
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async update(
    parent: undefined,
    { input }: UserMutationsUpdateArgs,
    { collection }: ResolverContextBase<true>
  ): Promise<UpdateMutationPayload<UserDBScheme>> {
    const updatedUser = await collection('users').findOneAndUpdate(
      { _id: new ObjectId(input.id) },
      {
        $set: {
          permissions: input.permissions,
        },
      },
      { returnOriginal: false });

    if (!updatedUser.value) {
      throw new UserInputError('There is no user with such id: ' + input.id);
    }

    return {
      recordId: updatedUser.value._id,
      record: updatedUser.value,
    };
  },

  /**
   * Sends friend request to user by id
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param id - new friend id
   * @param collection - this object is shared across all resolvers that execute for a particular operation
   * @param tokenData - information about user whose does this mutation
   */
  async sendFriendRequest(
    parent: undefined,
    { id }: { id: ObjectId },
    { collection, tokenData }: ResolverContextBase<true>
  ): Promise<UpdateMutationPayload<UserDBScheme>> {
    const newFriend = await collection('users').findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $push: {
          friendRequestsIds: new ObjectId(tokenData.userId),
        },
      },
      { returnOriginal: false }
    );

    if (!newFriend.value) {
      throw new UserInputError('There is no user with such id: ' + id);
    }

    const updatedUser = await collection('users').findOneAndUpdate(
      { _id: new ObjectId(tokenData.userId) },
      {
        $push: {
          friendPendingRequestsIds: new ObjectId(id),
        },
      },
      { returnOriginal: false }
    );

    if (!updatedUser.value) {
      throw new UserInputError('There is no user with such id: ' + tokenData.userId);
    }

    return {
      recordId: updatedUser.value._id,
      record: updatedUser.value,
    };
  },

  /**
   * Cancels friend request to user by id
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param id - a user to whom we are canceling the request
   * @param collection - this object is shared across all resolvers that execute for a particular operation
   * @param tokenData - information about user whose does this mutation
   */
  async cancelFriendRequest(
    parent: undefined,
    { id }: { id: ObjectId },
    { collection, tokenData }: ResolverContextBase<true>
  ): Promise<UpdateMutationPayload<UserDBScheme>> {
    const secondUser = await collection('users').findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $pull: {
          friendRequestsIds: new ObjectId(tokenData.userId),
        },
      },
      { returnOriginal: false }
    );

    if (!secondUser.value) {
      throw new UserInputError('There is no user with such id: ' + id);
    }

    const updatedUser = await collection('users').findOneAndUpdate(
      { _id: new ObjectId(tokenData.userId) },
      {
        $pull: {
          friendPendingRequestsIds: new ObjectId(id),
        },
      },
      { returnOriginal: false }
    );

    if (!updatedUser.value) {
      throw new UserInputError('There is no user with such id: ' + tokenData.userId);
    }

    return {
      recordId: updatedUser.value._id,
      record: updatedUser.value,
    };
  },

  /**
   * Accepts friend request to user by id
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param id - new friend id
   * @param collection - this object is shared across all resolvers that execute for a particular operation
   * @param tokenData - information about user whose does this mutation
   */
  async acceptFriendRequest(
    parent: undefined,
    { id }: { id: ObjectId },
    { collection, tokenData }: ResolverContextBase<true>
  ): Promise<UpdateMutationPayload<UserDBScheme>> {
    const newFriend = await collection('users').findOne(
      {
        _id: new ObjectId(id),
        friendRequestsIds: [
          new ObjectId(tokenData.userId),
        ],
      }
    );

    if (!newFriend) {
      throw new UserInputError('Can\'t add friend with this id: ' + id);
    }

    await collection('users').updateOne(
      { _id: new ObjectId(id) },
      {
        $pull: {
          friendRequestsIds: new ObjectId(tokenData.userId),
        },
        $push: {
          friendsIds: new ObjectId(tokenData.userId),
        },
      }
    );

    const updatedUser = await collection('users').findOneAndUpdate(
      { _id: new ObjectId(tokenData.userId) },
      {
        $pull: {
          friendPendingRequestsIds: new ObjectId(id),
        },
        $push: {
          friendsIds: new ObjectId(id),
        },
      },
      { returnOriginal: false }
    );

    if (!updatedUser.value) {
      throw new UserInputError('There is no user with such id: ' + tokenData.userId);
    }

    return {
      recordId: updatedUser.value._id,
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

    return getUserLevel(userExp);
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
