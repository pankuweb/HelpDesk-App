import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ILoginState {
  token: string;
  tokenGraph: string;
  email: string;
  name: string;
  tanent: string;
  user: any;
  tokenStoreTime: any;
}

const initialState: ILoginState = {
  token: "",
  tokenGraph: "",
  email: "",
  name: "",
  tanent: "",
  user: {},
  tokenStoreTime: "",
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    updateLoginData: (state, action: PayloadAction<ILoginState>) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.user = action.payload.user;
    },
    setGraphToken: (state, action: PayloadAction<ILoginState>) => {
      state.tokenGraph = action.payload;
    },
    setTokenStoreTime: (state, action: PayloadAction<ILoginState>) => {
      state.tokenStoreTime = action.payload;
    },
    updateTanent: (state, action: PayloadAction<string>) => {
      state.tanent = action.payload;
    },
    updateShToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearLoginData: (state) => {
      state.token = "";
      state.tokenGraph = "",
      state.email = "";
      state.name = "";
      state.tanent = "";
      state.user = {};
      state.tokenStoreTime = "";
    },
  },
});

export const { updateLoginData, updateTanent, setGraphToken, updateShToken, setTokenStoreTime, clearLoginData } = loginSlice.actions;
export default loginSlice.reducer;
