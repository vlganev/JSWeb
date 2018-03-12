let fs = require('fs');
let db = {}

let isKey = key => {
    if (typeof (key) !== 'string') {
        throw new Error('This key is not a string => ' + key)
    }
}

let keyExists = key => {
    if (db.hasOwnProperty(key)) {
        throw new Error('This key already exists => ' + key);
    }
}

let getAll = () => {
    if (Object.values(db).length === 0) {
        return 'There are no items in the db';
    }
    return db;
}

let put = (key, value) => {
    isKey(key);
    keyExists(key);
    db[key] = value;
}

let get = (key) => {
    isKey(key);
    return db[key];
}

let update = (key, value) => {
    isKey(key);
    db[key] = value;
}

let deleteItem = key => {
    isKey(key);
    delete db[key];
}

let clear = () => {
    db = {};
}

let save = () => {
    fs.writeFileSync('./data.json', JSON.stringify(db), 'utf8');
}

let load = () => {
    db = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
}


module.exports = {
    put: put,
    get: get,
    getAll: getAll,
    update: update,
    delete: deleteItem,
    clear: clear,
    save: save,
    load: load
}