import { post, patchFormData } from "./httpService";
//import { setJwt } from "./jwtService";

export const API_URL = "http://localhost:4000";

export const registerUser = async (user) => {
  try {
    //return await post(`${API_URL}/register`, user);
    return await post(`${API_URL}/api/v1/users`, user);
  } catch (err) {
    return {
      data: [],
      error: err,
    };
  }
};

export const authenticateUser = async (user) => {
  try {
    //console.log(user);
    //return await post(`${API_URL}/authenticate`, user);
    return await post(`${API_URL}/api/v1/auth`, user);
  } catch (err) {
    return {
      data: [],
      error: err,
    };
  }
};

export const updateUserProfile = async (formData, userId) => {
  try {
    console.log("authService", formData);
    //return await postFormData(`${API_URL}/updateUserProfile`, formData);
    return await patchFormData(`${API_URL}/api/v1/users/${userId}`, formData);
  } catch (err) {
    return {
      data: [],
      error: err,
    };
  }
};
