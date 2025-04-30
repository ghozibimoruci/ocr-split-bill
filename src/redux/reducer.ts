// reducer.ts
import { ADD_ITEM, REMOVE_ITEM } from "./actions";

export interface ItemProps {
  name: string;
  price: string;
  qty: string;
}

const initialState: ItemProps[] = [];

export const itemListReducer = (state = initialState, action: any): ItemProps[] => {
  switch (action.type) {
    case ADD_ITEM:
      return [...state, action.payload];
    case REMOVE_ITEM:
      return state.filter((_, index) => index !== action.payload);
    default:
      return state;
  }
};