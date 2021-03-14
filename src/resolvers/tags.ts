import { ObjectId } from 'mongodb';
import {
  CreateMutationPayload,
  DeleteMutationPayload,
  MultilingualString,
  ResolverContextBase,
  UpdateMutationPayload
} from '../types/graphql';
import { CreateTagInput, UpdateTagInput } from '../generated/graphql';
import { UserInputError } from 'apollo-server-express';
import mergeWithCustomizer from '../utils/mergeWithCustomizer';
import emptyMutation from '../utils/emptyMutation';

/**
 * Tag scheme in database
 */
export interface TagDBScheme {
  /**
   * Tag id in database
   */
  _id: ObjectId;

  /**
   * Tag value
   */
  value: MultilingualString;
}

const TagMutations = {
  /**
   * Creates new tag
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async create(
    parent: undefined,
    { input }: { input: CreateTagInput },
    { collection }: ResolverContextBase<true>
  ): Promise<CreateMutationPayload<TagDBScheme>> {
    const newInput = {
      ...input,
    };

    const tag = (await collection('tags').insertOne(newInput)).ops[0];

    return {
      recordId: tag._id,
      record: tag,
    };
  },

  /**
   * Updates existing tag
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async update(
    parent: undefined,
    { input }: { input: UpdateTagInput },
    { collection }: ResolverContextBase<true>
  ): Promise<UpdateMutationPayload<TagDBScheme>> {
    const { id, ...rest } = input;
    const newInput: TagDBScheme = {
      _id: new ObjectId(id),
      ...rest,
    };

    const originalTag = await collection('tags').findOne({
      _id: newInput._id,
    });

    if (!originalTag) {
      throw new UserInputError('There is no tag with such id: ' + newInput._id);
    }

    const updatedTag = await collection('tags').findOneAndUpdate(
      { _id: newInput._id },
      {
        $set: mergeWithCustomizer(originalTag, newInput),
      },
      { returnOriginal: false });

    if (!updatedTag.value) {
      throw new UserInputError('Can\'t update tag with such id: ' + newInput._id);
    }

    return {
      recordId: newInput._id,
      record: updatedTag.value,
    };
  },

  /**
   * Deletes existing tag
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async delete(
    parent: undefined,
    { id }: { id: ObjectId },
    { collection }: ResolverContextBase<true>
  ): Promise<DeleteMutationPayload> {
    await collection('tags').deleteOne({ _id: id });

    return {
      recordId: id,
    };
  },
};

const Mutation = {
  tag: emptyMutation,
};

export default {
  Mutation,
  TagMutations,
};
