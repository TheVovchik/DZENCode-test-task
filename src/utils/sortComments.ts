import { Comment } from '../types/Comment';
import { Order, SortBy } from '../types/SortBy';

export const sortComments = (
  comments: Comment[], sortBy: SortBy, order: Order,
) => {
  const modifiedComments = [...comments];

  switch (sortBy) {
    case SortBy.RATING: {
      if (order === Order.ASC) {
        modifiedComments.sort((commentA, commentB) => (
          commentB.rating - commentA.rating));
      } else {
        modifiedComments.sort((commentA, commentB) => (
          commentA.rating - commentB.rating));
      }

      return modifiedComments;
    }

    case SortBy.LOGIN: {
      if (order === Order.ASC) {
        modifiedComments.sort((commentA, commentB) => (
          commentB.userName.localeCompare(commentA.userName)));
      } else {
        modifiedComments.sort((commentA, commentB) => (
          commentA.userName.localeCompare(commentB.userName)));
      }

      return modifiedComments;
    }

    case SortBy.DATE: {
      if (order === Order.ASC) {
        modifiedComments.sort((commentA, commentB) => (
          Date.parse(commentB.createdAt.toString())
            - Date.parse(commentA.createdAt.toString())));
      } else {
        modifiedComments.sort((commentA, commentB) => (
          Date.parse(commentA.createdAt.toString())
            - Date.parse(commentB.createdAt.toString())));
      }

      return modifiedComments;
    }

    default:
      return modifiedComments;
  }
};
