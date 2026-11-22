import { createSelector } from 'reselect';

export const getBooks = createSelector(
  state => state.books.entities,
  books => books,
);
