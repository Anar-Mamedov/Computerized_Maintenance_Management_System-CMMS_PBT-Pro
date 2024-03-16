import { atom } from "recoil";

export const userState = atom({
  key: "userState", // Benzersiz bir key
  default: { userId: null, userName: null, userResimID: null }, // Başlangıç değeri
});

export const authTokenState = atom({
  key: "authTokenState",
  default: "",
});
