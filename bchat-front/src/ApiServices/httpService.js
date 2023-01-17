import { getJwt } from "./jwtService";

export const get = async (url, headers) => {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getJwt()}`,
        ...headers,
      },
    });

    return await res.json();
  } catch (err) {
    console.error(err);
  }
};

// export const getAuth = async (url, body) => {
//   try {
//     const res = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });

//     return await res.json();
//   } catch (err) {
//     console.error(err);
//   }
// };

//

export const post = async (url, body, headers) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getJwt()}`,
        ...headers,
      },
      body: JSON.stringify(body),
    });

    return await res.json();
  } catch (err) {
    console.error(err);
  }
};

export const postFormData = async (url, formData, headers) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      enctype: "multipart/form-data",
      headers: {
        Authorization: `Bearer ${getJwt()}`,
        ...headers,
      },
      body: formData,
    });

    return await res.json();
  } catch (err) {
    console.error(err);
  }
};

//TEST: get students without jwt
// export const testGet = async (url, headers) => {
//   try {
//     const res = await fetch(url, {
//       method: "GET",
//     });
//     return await res.json();
//   } catch (err) {
//     console.log(err);
//   }
// };
