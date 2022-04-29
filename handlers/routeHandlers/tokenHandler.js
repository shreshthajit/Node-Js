// dependencies

const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { parseJSON } = require("../../helpers/utilities");
const { createRandomString } = require("../../helpers/utilities");

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._tokens[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }

  //console.log('hello world');
};

handler._tokens = {};

handler._tokens.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone && password) {
    // make sure that the user doesn't already exists
    data.read("user", phone, (err1, userData) => {
      let hashedpassword = hash(password);
      if (hashedpassword === parseJSON(userData).password) {
        let tokenId = createRandomString(20);
        let expires = Date.now() + 60 * 60 * 1000;
        let tokenObject = {
          phone,
          id: tokenId,
          expires,
        };
        //store the token
        data.create("token", tokenId, tokenObject, (err2) => {
          if (!err2) {
            callback(200, tokenObject);
          } else {
            callback(500, { error: "Could not create user!" });
          }
        });
      } else {
        callback(500, { error: "password is not valid" });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

handler._tokens.get = (requestProperties, callback) => {
  // check the id if valid
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  console.log(id);

  if (id) {
    // lookup the user
    data.read("token", id, (err, tokenData) => {
      const token = { ...parseJSON(tokenData) };
      if (!err && token) {
        callback(200, token);
      } else {
        callback(404, {
          error: "Requested token was not found!",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested token was not found!",
    });
  }
};

handler._tokens.put = (requestProperties, callback) => {
  const id =
  typeof requestProperties.body.id === 'string' &&
  requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;
const extend = !!(
  typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true
);

if (id && extend) {
  data.read('token', id, (err1, tokenData) => {
      const tokenObject = parseJSON(tokenData);
      if (tokenObject.expires > Date.now()) {
          tokenObject.expires = Date.now() + 60 * 60 * 1000;
          // store the updated token
          data.update('token', id, tokenObject, (err2) => {
              if (!err2) {
                  callback(200,{
                    message:"token was updated successfully!",
                  });
              } else {
                  callback(500, {
                      error: 'There was a server side error!',
                  });
              }
          });
      } else {
          callback(400, {
              error: 'Token already expired!',
          });
      }
  });
} else {
  callback(400, {
      error: 'There was a problem in your request',
  });
}
};

handler._tokens.delete = (requestProperties, callback) => {
  // check the phone number if valid
  const id =
  typeof requestProperties.queryStringObject.id === 'string' &&
  requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

if (id) {
  // lookup the user
  data.read('token', id, (err1, tokenData) => {
      if (!err1 && tokenData) {
          data.delete('token', id, (err2) => {
              if (!err2) {
                  callback(200, {
                      message: 'Token was successfully deleted!',
                  });
              } else {
                  callback(500, {
                      error: 'There was a server side error!',
                  });
              }
          });
      } else {
          callback(500, {
              error: 'There was a server side error!',
          });
      }
  });
} else {
  callback(400, {
      error: 'There was a problem in your request!',
  });
}
};

handler._tokens.verify = (id,phone,callback) => {
  data.read('token',id,(err,tokenData)=> {
   if(!err && tokenData){
    if(parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()){
      callback(true);
    }
    else{
     callback(false);
    }
   }
   else{
     callback(false);
   }
  });
}

module.exports = handler;
