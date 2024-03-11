const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: ' Ths field is required. '
  },
  image: {
    type: String,
    required: ' Ths field is required. '
  }

});

module.exports = mongoose.model('Category', categorySchema);








