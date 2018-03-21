const formidable = require('formidable')
const Image = require('./../models/ImageSchema')
const Tag = require('./../models/TagSchema')
const fs = require('fs')

let handleImageForm = (res) => {
  fs.readFile('./views/index.html', (err, data) => {
    if (err) {
      console.log(err);
      return
    }
    res.writeHead(200, {
      'Content-Type': 'text/html'
    })
    let dispalyTags = ''

    Tag.find({}).then(tags => {
      for (let tag of tags) {
        dispalyTags += `<div class='tag' id="${tag._id}">${tag.tagName}</div>`
      }
      data = data
        .toString()
        .replace(`<div class='replaceMe'></div>`, dispalyTags);
      res.end(data)
    });
  });
};

let addImage = (req, res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, (err, fields, file) => {
    if (err) {
      console.log(err)
      return
    }
    fields.tags = fields.tagsID.split(',')
    fields.tags.pop()
    delete fields.tagsId

    Image.create(fields).then(img => {
      let imgTags = img.tags
      Tag.update(
        { _id: { $in: imgTags } },
        { $push: { images: img._id } },
        { multi: true }
      ).then(handleImageForm(res))
        .catch(err => {
          console.log(err)
          return
        })
      handleImageForm(res)
    }).catch(err => {
      console.log(err)
      return
    })
  })
}

function deleteImg(req, res) {
  let imgID = req.pathquery.id;
  Image.findOneAndRemove({ _id: imgID }).then((data) => {
    Tag.find({}).then((tags) => {
      for (let tag of tags) {
        for (let imageID of tag.images) {
          if (imageID.toString() === imgID.toString()) {
            tag.images.splice(tag.images.indexOf(imageID), 1);
          }
        }
        tag.save();
      }
    })
  }).catch((err) => {
    console.warn(err);
  });
  handleImageForm(res);
}

module.exports = (req, res) => {
  if (req.pathname === '/addImage' && req.method === 'POST') {
    addImage(req, res)
  } else if (req.pathname === '/delete' && req.method === 'GET') {
    deleteImg(req, res)
  } else {
    return true
  }
}
