const jwtLocalKey = "chatjwt";

export const setJwt = (token) => {
  localStorage.setItem(jwtLocalKey, token);
};

export const getJwt = () => {
  return localStorage.getItem(jwtLocalKey);
};

export const removeJwt = () => {
  localStorage.removeItem(jwtLocalKey);
};
