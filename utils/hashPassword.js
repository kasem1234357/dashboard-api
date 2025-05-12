const crypto = require("crypto");
const dotenv = require('dotenv')
dotenv.config();
function hashPassword(password) {
    const hash = crypto.createHash(process.env.HASH_TYPE);
    hash.update(password);
    return hash.digest('hex');
  }
  console.log(hashPassword('kasem'))
module.exports = hashPassword
