import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ILoginState {
  services: any;
  subServices: any;
  subServicesLevelWise: any;
  priority: any;
  requestTypes: any;
  departments: any;
  assets: any;
  settings: any;
}

const initialState: ILoginState = {
  services: [],
  subServices: [],
  subServicesLevelWise: [],
  priority: [],
  requestTypes: [],
  departments: [],
  assets: [],
  settings: {},
};

const requestSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<ILoginState>) => {
      state.services = action.payload;
    },
    setSubServices: (state, action: PayloadAction<ILoginState>) => {
      state.subServices = action.payload;
    },
    setSubServicesLevelWise: (state, action: PayloadAction<ILoginState>) => {
      state.subServicesLevelWise = action.payload;
    },
    setPriority: (state, action: PayloadAction<ILoginState>) => {
      state.priority = action.payload;
    },
    setRequestTypes: (state, action: PayloadAction<ILoginState>) => {
      state.requestTypes = action.payload;
    },
    setDepartments: (state, action: PayloadAction<ILoginState>) => {
      state.departments = action.payload;
    },
    setAssets: (state, action: PayloadAction<ILoginState>) => {
      state.assets = action.payload;
    },
    setSettings: (state, action: PayloadAction<ILoginState>) => {
      state.settings = action.payload;
    },
    clearRequestData: (state) => {
      state.services = [];
      state.subServices = [];
      state.priority = [];
      state.requestTypes = [];
      state.departments = [];
      state.assets = [];
      state.settings = [];
      state.subServicesLevelWise = [];
    },
  },
});

export const { setServices, setSubServices, setPriority, setRequestTypes, setDepartments, setAssets, setSettings, setSubServicesLevelWise, clearRequestData } = requestSlice.actions;
export default requestSlice.reducer;
