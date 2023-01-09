import { post } from "./httpService";
//import { setJwt } from "./jwtService";

export const API_URL = "http://localhost:4000";

export const registerUser = async (user) => {
  try {
    return await post(`${API_URL}/register`, user);
  } catch (err) {
    return {
      data: [],
      error: err,
    };
  }
};

export const authenticateUser = async (user) => {
  try {
    console.log(user);
    return await post(`${API_URL}/authenticate`, user);
  } catch (err) {
    return {
      data: [],
      error: err,
    };
  }
};

// export const test = async () => {
//   try {
//     return testGet(`${API_URL}/students`);
//   } catch (err) {
//     return {
//       data: [],
//       error: err,
//     };
//   }
// };
