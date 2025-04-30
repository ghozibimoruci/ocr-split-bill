// store.ts
import { createStore } from "redux";
import { itemListReducer } from "./reducer";

export const store = createStore(itemListReducer);