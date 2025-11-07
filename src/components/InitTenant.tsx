import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientTenetBaseURL } from "../backend/TokenAPI";
import { setGraphToken, updateShToken, updateTanent } from "../redux/slices/loginSlice";
import { AZURE_APP_CLIENT_ID, SHA_TANENT } from "@env";
import AzureAuth from "react-native-azure-auth";

const azureAuth = new AzureAuth({
  clientId: AZURE_APP_CLIENT_ID,
});

const InitTenant: React.FC = () => {
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state?.login?.email);

  const refreshAccessToken = async () => {
    try {
      if (!userEmail) {
        console.warn("No userId found in store, skipping token refresh");
        return null;
      }

      const cachedRefresh = await azureAuth.auth.cache.getRefreshToken(userEmail);
      const refreshToken = cachedRefresh?.refreshToken;

      if (!refreshToken) {
        console.warn("No refresh token found for user:", userEmail);
        return null;
      }

      const newTokens = await azureAuth.auth.refreshTokens({
        refreshToken: refreshToken,
        scope: "https://xzm41.sharepoint.com/.default offline_access",
      });

      const graphTokens = await azureAuth.auth.refreshTokens({
        refreshToken: newTokens.refreshToken,
        scope: "User.Read User.ReadBasic.All openid profile email offline_access",
      });

      dispatch(setGraphToken(graphTokens.accessToken));
      dispatch(updateShToken(newTokens.accessToken));

      return newTokens.accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  };

  useEffect(() => {
    const getInitialTenant = async () => {
      await refreshAccessToken();
      const res = await getClientTenetBaseURL(SHA_TANENT);
      dispatch(updateTanent(res));
    };
    getInitialTenant();
  });

  return null;
};

export default InitTenant;
