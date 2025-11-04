import { combineReducers } from "redux";
import loginReducer from "./slices/loginSlice";
import ticketReducer from "./slices/ticketSlice";
import requestReducer from "./slices/requestSlice";
import usersReducer from "./slices/userSlice";

const rootReducer = combineReducers({
  login: loginReducer,
  tickets: ticketReducer,
  requests: requestReducer,
  users: usersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
