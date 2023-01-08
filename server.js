const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

app.use('/controller', express.static(__dirname + '/controller'));


app.listen(8080, () => {
  console.log('Server listening on http://localhost:8080');
});