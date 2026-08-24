export const isEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const isPassword = (password) => {
  return password.length >= 8;
};

export const isRequired = (value) => {
  return value?.toString().trim().length > 0;
};

export const isPhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone.trim());
};

export const isPincode = (pincode) => {
  return /^\d{6}$/.test(pincode.trim());
};

export const isPersonName = (name) => {
  return /^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/.test(name.trim());
};

export const isCityOrState = (value) => {
  return /^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/.test(value.trim());
};

export const isAddress = (address) => {
  const value = address.trim();

  return value.length >= 5 && value.length <= 200;
};