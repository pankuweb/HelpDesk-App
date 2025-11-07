import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ILoginState {
  users: Array;
  graphUsers: Array;
  nonM365Users: Array;
}

const initialState: ILoginState = {
  users: [],
  graphUsers: [],
  nonM365Users: [],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateUsersData: (state, action: PayloadAction<ILoginState>) => {
      state.users = action.payload;
    },
    setGraphUsersData: (state, action: PayloadAction<ILoginState>) => {
      state.graphUsers = action.payload;
    },
    setNonM365UsersData: (state, action: PayloadAction<ILoginState>) => {
      state.nonM365Users = action.payload;
    },
    clearUsersData: (state) => {
      state.users = [];
      state.graphUsers = [];
    },
  },
});

export const { updateUsersData, setGraphUsersData, setNonM365UsersData, clearUsersData } = usersSlice.actions;
export default usersSlice.reducer;
