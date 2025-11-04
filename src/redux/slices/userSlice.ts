import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ILoginState {
  users: Array;
  graphUsers: Array;
  
}

const initialState: ILoginState = {
  users: [],
  graphUsers: [],
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
    clearUsersData: (state) => {
      state.users = [];
      state.graphUsers = [];
    },
  },
});

export const { updateUsersData, setGraphUsersData, clearUsersData } = usersSlice.actions;
export default usersSlice.reducer;
