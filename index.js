
// This is a test of api.video 
// 

const dotenv = require ("dotenv").config()
const AV_SANDBOX_KEY = process.env.AV_SANDBOX_KEY || ''
let AV_BEARER_TOKEN = { expires_at: 0 }  /* we'll refresh this as needed. */ 

const axios = require( "axios")
const express= require ( "express")

const PORT = process.env.PORT || 5000			/* PORT number */



async function getBearerToken(){
  // check if the current token is still valid.   
  if (AV_BEARER_TOKEN.expires_at > Date.now() / 1000) return AV_BEARER_TOKEN.access_token 
  await axios.post(
    'https://sandbox.api.video/auth/api-key',
    {apiKey:  AV_SANDBOX_KEY},
    {headers: {Accept: 'application/json', 'Content-Type': 'application/json'}}
  )
  .then( (response ) => {
    AV_BEARER_TOKEN = response.data 
    AV_BEARER_TOKEN.expires_at =  Date.now() / 1000 + response.data.expires_in
  })
  .catch( (error) =>  console.error(error) ); 
  return AV_BEARER_TOKEN.access_token;
} 
app = express(); 

/* Serve up static assets, i.e. the Frontend of the site. */
app.use( '/', express.static('public'))  

/** If the frontend requests an upload Token, supply one. */
app.get('/uploadToken', async (req,res) => { 
  axios.post( 'https://sandbox.api.video/upload-tokens', {},
    {headers: {
        'accept': 'application/vnd.api.video+json', 
        'authorization': 'Bearer '+await getBearerToken()  }
    }
  )
  .then(uploadToken => res.send(uploadToken.data.token) )
  .catch(error => res.send(error) )
})


// if the frontend needs video status, provide it. 
app.get('/videoStatus/:id', async (req, res) =>{  
  axios.get(`https://sandbox.api.video/videos/${req.params.id}/status`, 
  {headers: {
    'accept': 'application/json', 
    'authorization': 'Bearer '+ await getBearerToken()  }
  })
  .then(response => res.send(response.data))
})
 

//Go live
app.listen(PORT,  () => {
  console.log("We are live " );
});