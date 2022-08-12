/*const CLIENT_ID = '702366528192-4pvgpuk2ggi754k1vpla87sd7teka89a.apps.googleusercontent.com'

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
async function verify() {

}
// verify().then(console.log('completed')).catch(console.error);


module.exports = async function (req, res, next) {

    if (!req.header('x-auth-google-token'))
        return res.status(403).send('google token required')

    try {
        const ticket = await client.verifyIdToken({
            idToken: req.header('x-auth-google-token'),
            // idToken: id_token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });

        const payload = ticket.getPayload();
        const userid = payload['sub']
        const email = payload['email']
        const picture = payload['picture']


        req.profile_image = picture
        req.userid = userid
        req.email = email

        next()

    } catch (err) {
        console.log(err)
        res.status(403).send('Invalid Token')
    }
}
*/

const {getAuth}  = require('firebase-admin/auth');
const admin = require('firebase-admin');

function auth(req, res, next) {

  const idToken = req.headers['x-auth-google-token'];

  admin.auth().verifyIdToken(idToken).then(data=>{
    console.log(data);
    req.profile_image = data.picture;
    req.userid = data.uid;
    req.email = data.email;
    next();
  }).catch(error=>{
      console.log(error);
  })
  
//   getAuth()
//   .verifyIdToken(idToken)
//   .then((decodedToken) => {
//     const uid = decodedToken.uid;
//     console.log(uid);
//     // ...
//   })
//   .catch((error) => {
//     res.status(403).send("Could not authenticate "+error)
//   });
}

module.exports = auth;