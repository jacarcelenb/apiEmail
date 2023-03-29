import express from 'express';
const app = express();
import  morgan from 'morgan';
import cors from 'cors';
import SibApiV3Sdk from "sib-api-v3-sdk"

const client = SibApiV3Sdk.ApiClient.instance

const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.APIKEY

//Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2)

//Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors())

//Nuestro primer WS Get
app.get('/', (req, res) => {
    res.json(
        {
            "Title": "Hola mundo"
        }
    );
})

app.post('/sendEmail', async (req, res) => {

  const {subject , sender , to} = req.body;

  await new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(
    {
      'subject':subject,
      'sender' : {'email':sender, 'name':'Jorge Carcelen'},
      'to' : [{'name': 'John Doe', 'email': to}],
       'templateId':3,
      'params' : {'emailVerification':'https://backendbadgego.onrender.com/api/groups'}
    }
  ).then(function(data) {
    console.log(data);
  }, function(error) {
    console.error(error);
  });

  res.json(
      {
          "Status": "Correo enviado"
      }
  );
})

//Iniciando el servidor
app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});


