const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const encryptionKey = process.env.ENCRYPTION_KEY.padEnd(32, " ");
const ivLength = 16;

let encrypt = (text) => {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(encryptionKey, "utf-8"),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
};

let response = (data, status) => {
  return {
    con: status,
    data: status === true ? data : data,
    // data: status === true ? encrypt(JSON.stringify(data)) : data,
    message: status === true ? "Success" : "Unsuccessful",
    status: status === true ? 200 : 500,
    length: status === true ? data.length : 0,
  };
};

module.exports = {
  encrypt,
  response,
};
