import { atom } from "recoil";

export const UserState = atom({
  // return
  // displayName: 'value',
  // email: 'value',
  // photoUrl: 'value',
  // uid: 'value',
  key: "UserState",
  default: undefined,
});

export const AdminState = atom({
  key: "AdminState",
  default: undefined,
});

export const AuthState = atom({
  key: "AuthState",
  default: undefined,
});

export const VisitedPresences = atom({
  key: "VisitedPresences",
  default: [],
});

export const VisitedPresencesLoaded = atom({
  key: "VisitedPresencesLoaded",
  default: false,
});

export const ShowSidebar = atom({
  key: "ShowSidebar",
  default: false,
});
