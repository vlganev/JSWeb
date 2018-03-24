const fs = require('fs')
const db = require('./../config/dataBase')
const qs = require('querystring')
const url = require('url')
const formidable = require('formidable')
const shortid = require('shortid')

const viewAllPath = './views/viewAll.html'
const viewAddPath = './views/addMeme.html'
const viewDetailsPath = './views/details.html'

let memeGenerator = (id, title, memeSrc, description, privacy) => {
  return {
    id: id,
    title: title,
    memeSrc: memeSrc,
    description: description,
    privacy: privacy,
    dateStamp: Date.now()
  }
}

let defaultResponse = (res, data) => {
  res.writeHead(200, {
    'Content-type': 'text/html'
  })
  res.end(data)
}

let viewAll = (req, res) => {
  let memes = db.getDb()
  memes = memes.sort((a, b) => {
    return b.dateStamp - a.dateStamp
  }).filter(currMeme => currMeme.privacy === 'on')

  fs.readFile(viewAllPath, 'utf8', (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    let memeString = '';
    for (let meme of memes) {
      memeString += `
      <div class="meme">
        <a href="/getDetails?id=${meme.id}">
        <img class="meme  Poster" src="${meme.memeSrc}"/>          
      </div>`
    }

    data = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', memeString)
    defaultResponse(res, data)
  })
}

let viewAddMeme = (req, res) => {
  fs.readFile(viewAddPath, 'utf8', (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    defaultResponse(res, data)
  })
}

let addMeme = (req, res) => {
  let form = new formidable.IncomingForm()

  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log(err);
      return;
    }
    let uploadFile = files['meme'];
    if (uploadFile.type === 'image/jpeg') {
      let folderNumber = db.getDb().length % 1000;
      let imagePath = `/public/memeStorage/${folderNumber}`
      if (!fs.existsSync('.' + imagePath)) {
        fs.mkdirSync('.' + imagePath);
      }
      let imgFileExtension = uploadFile.name.split('.').pop();
      let uniqueId = shortid.generate();
      uploadFile.name = `${uniqueId}.${imgFileExtension}`;

      fs.copyFile(uploadFile.path, `.${imagePath}/` + uploadFile.name, err => {
        if (err) {
          console.log(err);
          return;
        }
        let memeObj = memeGenerator(uniqueId, fields.memeTitle, `.${imagePath}/` + uploadFile.name, fields.memeDescription, fields.status)
        console.log(memeObj)
        db.add(memeObj)

        res.writeHead(302, {
          Location: '/viewAllMemes'
        })
        res.end();
      });
    } else {
      res.write('Only .jpg files accepted');
      res.end();
    }
  });
}

let getDetails = (req, res) => {
  let targetedMemeId = qs.parse(url.parse(req.url).query).id
  let targetedMeme = db.getDb().find(searched => searched.id === targetedMemeId)
  fs.readFile(viewDetailsPath, (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    let replacement = `
    <div class="content">
      <img src="${targetedMeme.memeSrc}" alt=""/>
      <h3>Title  ${targetedMeme.title}</h3>
      <p> ${targetedMeme.description}</p>
      <button><a href="${targetedMeme.posterSrc}">Download Meme</a></button>
    </div>`
    data = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', replacement)
    defaultResponse(res, data)
  })
}

module.exports = (req, res) => {
  if (req.pathname === '/viewAllMemes' && req.method === 'GET') {
    viewAll(req, res)
  } else if (req.pathname === '/addMeme' && req.method === 'GET') {
    viewAddMeme(req, res)
  } else if (req.pathname === '/addMeme' && req.method === 'POST') {
    addMeme(req, res)
  } else if (req.pathname.startsWith('/getDetails') && req.method === 'GET') {
    getDetails(req, res)
  } else {
    return true
  }
}
