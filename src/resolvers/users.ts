import { ObjectId } from 'mongodb';
import { ResolverContextBase, UpdateMutationPayload } from '../types/graphql';
import { ForbiddenAction, InvalidAccessToken, UsernameDuplicationError } from '../errorTypes';
import { UserInputError } from 'apollo-server-express';
import emptyMutation from '../utils/emptyMutation';
import getUserLevel from '../utils/getUserLevel';
import { UserMutationsChangeUsernameArgs, UserMutationsUpdateArgs } from '../generated/graphql';

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
    },

    /**
     * Info about user's apple account
     */
    apple?: {
      /**
       * Apple account id
       */
      id: string
    }
  }

  /**
   * User friends ids
   */
  friendsIds?: ObjectId[];

  /**
   * Dispatched friend requests
   */
  friendPendingRequestsIds?: ObjectId[];

  /**
   * Received friend requests
   */
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

  /**
   * Searches users by username and returns array of users
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async usersSearch(
    parent: undefined,
    { username }: { username: string },
    { collection }: ResolverContextBase<true>): Promise<UserDBScheme[]> {
    return await collection('users')
      .find({
        username: {
          $regex: username,
          $options: 'i',
        },
      })
      .toArray();
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
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async sendFriendRequest(
    parent: undefined,
    { id }: { id: ObjectId },
    { collection, tokenData }: ResolverContextBase<true>
  ): Promise<UpdateMutationPayload<UserDBScheme>> {
    const currentUserId = new ObjectId(tokenData.userId);
    const secondUserId = new ObjectId(id);

    const secondUser = await collection('users').findOneAndUpdate(
      {
        _id: secondUserId,
        friendsIds: {
          $ne: currentUserId,
        },
        friendRequestsIds: {
          $ne: currentUserId,
        },
      },
      {
        $push: {
          friendRequestsIds: currentUserId,
        },
      },
      { returnOriginal: false }
    );

    if (!secondUser.value) {
      throw new UserInputError('Can\'t add friend with such id: ' + id);
    }

    const updatedUser = await collection('users').findOneAndUpdate(
      {
        _id: currentUserId,
        friendsIds: {
          $ne: secondUserId,
        },
        friendPendingRequestsIds: {
          $ne: secondUserId,
        },
      },
      {
        $push: {
          friendPendingRequestsIds: secondUserId,
        },
      },
      { returnOriginal: false }
    );

    if (!updatedUser.value) {
      throw new UserInputError('Can\'t add friend with such id: ' + tokenData.userId);
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
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async cancelFriendRequest(
    parent: undefined,
    { id }: { id: ObjectId },
    { collection, tokenData }: ResolverContextBase<true>
  ): Promise<UpdateMutationPayload<UserDBScheme>> {
    const currentUserId = new ObjectId(tokenData.userId);
    const secondUserId = new ObjectId(id);

    const secondUser = await collection('users').findOneAndUpdate(
      { _id: secondUserId },
      {
        $pull: {
          friendRequestsIds: currentUserId,
        },
      },
      { returnOriginal: false }
    );

    if (!secondUser.value) {
      throw new UserInputError('Can\'t add friend with such id: ' + id);
    }

    const updatedUser = await collection('users').findOneAndUpdate(
      { _id: currentUserId },
      {
        $pull: {
          friendPendingRequestsIds: secondUserId,
        },
      },
      { returnOriginal: false }
    );

    if (!updatedUser.value) {
      throw new UserInputError('Can\'t add friend with such id: ' + tokenData.userId);
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
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async acceptFriendRequest(
    parent: undefined,
    { id }: { id: ObjectId },
    { collection, tokenData }: ResolverContextBase<true>
  ): Promise<UpdateMutationPayload<UserDBScheme>> {
    const currentUserId = new ObjectId(tokenData.userId);
    const secondUserId = new ObjectId(id);

    const newFriend = await collection('users').findOne(
      {
        _id: secondUserId,
        friendPendingRequestsIds: currentUserId,
      }
    );

    if (!newFriend) {
      throw new UserInputError('Can\'t add friend with this id: ' + id);
    }

    await collection('users').updateOne(
      { _id: secondUserId },
      {
        $pull: {
          friendPendingRequestsIds: currentUserId,
        },
        $push: {
          friendsIds: currentUserId,
        },
      }
    );

    const updatedUser = await collection('users').findOneAndUpdate(
      { _id: currentUserId },
      {
        $pull: {
          friendRequestsIds: secondUserId,
        },
        $push: {
          friendsIds: secondUserId,
        },
      },
      { returnOriginal: false }
    );

    if (!updatedUser.value) {
      throw new UserInputError('Can\'t add friend with such id: ' + tokenData.userId);
    }

    return {
      recordId: updatedUser.value._id,
      record: updatedUser.value,
    };
  },

  /**
   * Rejects friend request to user by id
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async rejectFriendRequest(
    parent: undefined,
    { id }: { id: ObjectId },
    { collection, tokenData }: ResolverContextBase<true>
  ): Promise<UpdateMutationPayload<UserDBScheme>> {
    const currentUserId = new ObjectId(tokenData.userId);
    const secondUserId = new ObjectId(id);

    const rejectedUser = await collection('users').findOneAndUpdate(
      { _id: secondUserId },
      {
        $pull: {
          friendPendingRequestsIds: currentUserId,
        },
      },
      { returnOriginal: false }
    );

    if (!rejectedUser.value) {
      throw new UserInputError('Can\'t reject friend request with such user id: ' + id);
    }

    const updatedUser = await collection('users').findOneAndUpdate(
      { _id: currentUserId },
      {
        $pull: {
          friendRequestsIds: secondUserId,
        },
      },
      { returnOriginal: false }
    );

    if (!updatedUser.value) {
      throw new UserInputError('Can\'t reject friend request with such user id: ' + tokenData.userId);
    }

    return {
      recordId: updatedUser.value._id,
      record: updatedUser.value,
    };
  },

  /**
   * Removes friend by id
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async removeFromFriends(
    parent: undefined,
    { id }: { id: ObjectId },
    { collection, tokenData }: ResolverContextBase<true>
  ): Promise<UpdateMutationPayload<UserDBScheme>> {
    const currentUserId = new ObjectId(tokenData.userId);
    const secondUserId = new ObjectId(id);

    const secondUser = await collection('users').findOneAndUpdate(
      { _id: secondUserId },
      {
        $pull: {
          friendsIds: currentUserId,
        },
      },
      { returnOriginal: false }
    );

    if (!secondUser.value) {
      throw new UserInputError('Can\'t remove friend with such id: ' + id);
    }

    const updatedUser = await collection('users').findOneAndUpdate(
      { _id: currentUserId },
      {
        $pull: {
          friendsIds: secondUserId,
        },
      },
      { returnOriginal: false }
    );

    if (!updatedUser.value) {
      throw new UserInputError('Can\'t remove friend with such id: ' + tokenData.userId);
    }

    return {
      recordId: updatedUser.value._id,
      record: updatedUser.value,
    };
  },


  /**
   * Changes username of the user
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async changeUsername(parent: undefined, args: UserMutationsChangeUsernameArgs, { collection, tokenData }: ResolverContextBase<true>): Promise<UpdateMutationPayload<UserDBScheme>> {
    try {
      const userId = new ObjectId(tokenData.userId);
      const updatedUser = await collection('users').findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            username: args.username,
          },
        },
        { returnOriginal: false });

      if (!updatedUser.value) {
        throw new InvalidAccessToken();
      }

      return {
        recordId: userId,
        record: updatedUser.value,
      };
    } catch (error) {
      if (error.name === 'MongoError' && error.code === 11000) {
        throw new UsernameDuplicationError();
      }
      throw error;
    }
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
