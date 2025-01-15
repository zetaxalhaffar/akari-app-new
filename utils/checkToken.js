import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
const useCheckToken = () => {
  useEffect(() => {
    SecureStore.getItemAsync("access_token").then((token) => {
      console.log(token);
    });
  }, []);
};


export default useCheckToken;