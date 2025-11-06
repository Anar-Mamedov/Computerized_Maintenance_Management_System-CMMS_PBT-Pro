import { atom } from "recoil";

export const selectedMenuItemState = atom({
  key: "selectedMenuItemState",
  default: "",
});

export const menuItemsState = atom({
  key: "menuItemsState",
  default: [],
});
