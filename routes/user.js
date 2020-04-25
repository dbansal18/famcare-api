var express = require('express');
var router = express.Router();
var User = require('./../models/User');
const {OAuth2Client} = require('google-auth-library');

/* GET home page. */
router.get('/', function(req, res, next) {
  User.find({}, {email: 1}).then((users) => {
  	res.send(users);
  })
});

router.post('/signin', (req, res, next) => {
	const idtoken = req.headers.authorization;
	const CLIENT_ID = '601951843890-jbcqv1r0pdm4pkqkp38qnpf48aphsqra.apps.googleusercontent.com';
	const client = new OAuth2Client(CLIENT_ID);
	async function verify(token) {
	  const ticket = await client.verifyIdToken({
	      idToken: token,
	      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
	      // Or, if multiple clients access the backend:
	      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
	  });
	  const payload = ticket.getPayload();
	  // console.log('user', payload.email);
	  // const userid = payload['sub'];
	  // If request specified a G Suite domain:
	  //const domain = payload['hd'];
	  if(CLIENT_ID == payload.aud) {
	  	User.findOne({email: payload.email}).then((user, err) => {
	  		if(err) res.status(404).json(err);
	  		if(user) {
	  			user.authCode = idtoken;
	  			user.save().then((loggedUser) => res.status(200).json(loggedUser))
	  					.catch((err) => res.sendStatus(401))
	  		}
	  		else {
	  			new User({
	  				userid: payload.sub,
				    email: payload.email,
				    name: payload.name,
				    thumbnail: payload.picture,
				    role: 'user',
				    groups: [],
				    authCode: idtoken,
	  			}).save().then((user, err) => {
	  				if(user) res.status(200).json(user);
	                else res.status(404).json(err);
	  			})
	  		}
 	  	})
	  }
	}
	// const idtoken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjhjNThlMTM4NjE0YmQ1ODc0MjE3MmJkNTA4MGQxOTdkMmIyZGQyZjMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNjAxOTUxODQzODkwLWpiY3F2MXIwcGRtNHBrcWtwMzhxbnBmNDhhcGhzcXJhLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNjAxOTUxODQzODkwLWpiY3F2MXIwcGRtNHBrcWtwMzhxbnBmNDhhcGhzcXJhLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE3MTM5NDA0MTM4Mzc5NjMyMjI0IiwiZW1haWwiOiJiYW5zYWxkZWVwYW5zaHUwOEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Im0tbjJEMXl2dnp6b09iVmdWNFZnNGciLCJuYW1lIjoiRGVlcGFuc2h1IEJhbnNhbCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQUF1RTdtQlR0X2JESVVvaXczMWl5TEtMUnU1azdVUmdTQkMzMUsyeVBxSG14QT1zOTYtYyIsImdpdmVuX25hbWUiOiJEZWVwYW5zaHUiLCJmYW1pbHlfbmFtZSI6IkJhbnNhbCIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNTcwMjczNDg1LCJleHAiOjE1NzAyNzcwODUsImp0aSI6IjA4ZTFjM2ZlODRmYzhhOGNjYjdlMmE0NWY2ZTFhMzIwMzZkMjk0OGQifQ.V30u4LwUBdB1VJZ0oXj6hqm39Fz7DB5S-l2vHYG5SPcYs49nvBC0xknNNjXElaZd4a1uuq7erxqQPtlPb1mtJJ4qJK7OBXFuJl4ndf3t7cxNQu8OvjQsc8z3Nvoj-Zc4DGLc5WLtwfRYbuJbM2pCFLeIFaaxAQY838ONt7sPGYQq-uS5eSR-yZXwCM45UaKd5U8hf0QA0K-v3oOifSPtcDDF0lyzfwuXA_kBMykH2KnGI6nRdIqYgZKBWLtwxqcqqdtlk-VVmN2oV2wMUOu4oETbQJKI1isTGtUGGfW4zPBe4TGmVtokEY-po5k0g2-8Vjkvqn21bmKOT-rRCENd2g";
	verify(idtoken).catch(console.error);
})

module.exports = router;
