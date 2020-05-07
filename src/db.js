const mongoose = require('mongoose');

mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(res => console.log('mongodb connected'))
  .catch(err => console.log(err));
