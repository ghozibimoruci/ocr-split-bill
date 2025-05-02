// actions.ts
export const ADD_ITEM = "ADD_ITEM";
export const REMOVE_ITEM = "REMOVE_ITEM";

export const addItem = (item: { name: string; price: string; }) => ({
  type: ADD_ITEM,
  payload: item,
});

export const removeItem = (index: number) => ({
  type: REMOVE_ITEM,
  payload: index,
});