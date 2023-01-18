const stringToColor = (string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

const initializeName = (name) => {
  return name.split(" ").length > 1
    ? `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`
    : `${name.split(" ")[0][0]}`;
};

export const stringAvatar = (name) => {
  if (!name || name === "") name = "N A";
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initializeName(name),
  };
};

export const stringSmallAvatar = (name) => {
  if (!name || name === "") name = "N A";
  return {
    sx: {
      bgcolor: stringToColor(name),
      fontSize: 12,
      width: 16,
      height: 16,
    },
    children: initializeName(name),
  };
};

export const stringLargeAvatar = (name) => {
  if (!name || name === "") name = "N A";
  return {
    sx: {
      bgcolor: stringToColor(name),
      fontSize: 24,
      width: 45,
      height: 45,
    },
    children: initializeName(name),
  };
};
