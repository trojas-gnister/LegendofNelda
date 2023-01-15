const express = require('express');
const exphbs = require('express-handlebars');
const apiRoutes = require('./controllers/routes/apiRoutes');
const htmlRoutes = require('./controllers/routes/htmlRoutes');
const PORT = process.env.PORT || 3001;


const PORT = process.env.PORT || 8080;
const app = express();

app.use(sessionMiddleware);
const hbs = exphbs.create();

app.use(express.static('public'));
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);



app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

  

app.listen(PORT, () => {
  console.log(`Server available at localhost: ${PORT}`);
  });