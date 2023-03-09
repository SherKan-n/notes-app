const express = require('express');
const mysql = require("mysql");
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
//---------------------------------------
require("dotenv").config();
//---------------------------------------
const PORT = process.env.PORT || 3000;
console.log(process.env.MYSQL_NOTES);
const token_mysql = process.env.MYSQL_NOTES.split("|");
//---------------------------------------
const pool = mysql.createPool({
   connectionLimit: 5,
   host: token_mysql[0],
   user: token_mysql[1],
   password: token_mysql[2],
   database: token_mysql[3],
});
//---------------------------------------
const app = express();
//---------------------------------------
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../')));
//---------------------------------------
app.post('/notes/user/register', (req, res) => {
   pool.getConnection(async function (err, connection) {
      if (err) throw err;
      const passwordHash = bcrypt.hashSync(req.body.password, 8);
      const usersCount = await getUserCount(req.body.email, connection);

      req.body.password = passwordHash;

      if (usersCount != 0) res.status(200).send({ success: false, message: 'This email is already taken !' });
      else {
         connection.query("INSERT INTO `users` SET ?", req.body, function (err, result) {
            if (!err) res.status(200).send({ success: true, message: 'You have successfully registered !' });
            connection.release();
         });
      }
   });
});
//---------------------------------------
app.post('/notes/user/login', (req, res) => {
   pool.getConnection(function (err, connection) {
      if (err) throw err;
      const { email, password } = req.body;

      connection.query("SELECT * FROM `users` WHERE `email` = '" + email + "' LIMIT 1", function (err, result) {
         if (!err) {
            const userStats = result[0];

            if (result.length == 0) res.status(200).send({ success: false, message: "User not found !\nPlease check your email and password !" });
            else {
               bcrypt.compare(password, userStats.password, function (err, result) {
                  if (result) {
                     delete userStats.password;
                     res.status(200).send({ success: true, userStats: userStats, message: 'You have successfully logged in !' })
                  }
                  else res.status(200).send({ success: false, message: "Wrong password !" });
               })
            }
         }
         connection.release();
      });
   });
});
//---------------------------------------
app.post('/notes/note/add', (req, res) => {
   pool.getConnection(function (err, connection) {
      if (err) throw err;

      connection.query("INSERT INTO `notes` SET ?", req.body, function (err, result) {
         if (!err) res.status(200).send({ success: true, message: 'The note has been successfully added !' });
         connection.release();
      });
   });
});
//---------------------------------------
app.post('/notes/note/delete', (req, res) => {
   pool.getConnection(function (err, connection) {
      if (err) throw err;
      const { id, uid } = req.body;

      connection.query("DELETE FROM `notes` WHERE `id` = '" + id + "' AND `uid` = '" + uid + "' LIMIT 1", req.body, function (err, result) {
         if (!err) res.status(200).send({ success: true, message: 'The note was successfully deleted !' });
         else res.status(200).send({ success: false, message: 'Note not found !' });
         connection.release();
      });
   });
});
//---------------------------------------
app.post('/notes/note/completed', (req, res) => {
   pool.getConnection(function (err, connection) {
      if (err) throw err;
      const { id, uid, type, typeLevel } = req.body;

      connection.query("UPDATE `notes` SET `type` = '" + type + "', `typeLevel` = '" + typeLevel + "' WHERE `id` = '" + id + "' AND `uid` = '" + uid + "' LIMIT 1", req.body, function (err, result) {
         if (!err) res.status(200).send({ success: true, message: 'The note was successfully updated to completed !' });
         else res.status(200).send({ success: false, message: 'Note not found !' });
         connection.release();
      });
   });
});
//---------------------------------------
app.get('/notes/note/get/all/:uid', (req, res) => {
   pool.getConnection(function (err, connection) {
      if (err) throw err;
      const { uid } = req.params;

      if (!uid) {
         res.status(200).send({ success: false, message: 'Wrong request URL !' });
         connection.release();
         return;
      }
      connection.query("SELECT * FROM `notes` WHERE `uid` = '" + uid + "' AND `folder` IS NULL ORDER BY `typeLevel` DESC, `date` DESC", function (err, result) {
         if (!err) res.status(200).send({ success: true, notes: result })
         connection.release();
      });
   });
});
//---------------------------------------
app.post('/notes/folder/add', (req, res) => {
   pool.getConnection(function (err, connection) {
      if (err) throw err;

      connection.query("INSERT INTO `folders` SET ?", req.body, function (err, result) {
         if (!err) res.status(200).send({ success: true, message: 'The folder has been successfully created !' });
         connection.release();
      });
   });
});
//---------------------------------------
app.post('/notes/folder/delete', (req, res) => {
   pool.getConnection(function (err, connection) {
      if (err) throw err;
      const { id, uid } = req.body;

      connection.query("DELETE FROM `folders` WHERE `id` = '" + id + "' AND `uid` = '" + uid + "' LIMIT 1", req.body, function (err, result) {
         if (err) res.status(200).send({ success: false, message: 'Folder not found !' });

         connection.query("DELETE FROM `notes` WHERE `folder` = '" + id + "' AND `uid` = '" + uid + "'", req.body, function (err, result) {
            if (!err) res.status(200).send({ success: true, message: 'The folder was successfully deleted !' });
            connection.release();
         });
      });
   });
});
//---------------------------------------
app.post('/notes/folder/completed', (req, res) => {
   pool.getConnection(function (err, connection) {
      if (err) throw err;
      const { id, uid, type, typeLevel } = req.body;

      connection.query("UPDATE `folders` SET `type` = '" + type + "', `typeLevel` = '" + typeLevel + "' WHERE `id` = '" + id + "' AND `uid` = '" + uid + "' LIMIT 1", req.body, function (err, result) {
         if (!err) res.status(200).send({ success: true, message: 'The folder was successfully updated to completed !' });
         else res.status(200).send({ success: false, message: 'Folder not found !' });
         connection.release();
      });
   });
});
//---------------------------------------
app.get('/notes/folder/get/all/:uid', (req, res) => {
   pool.getConnection(function (err, connection) {
      if (err) throw err;
      const { uid } = req.params;

      if (!uid) {
         res.status(200).send({ success: false, message: 'Wrong request URL !' });
         connection.release();
         return;
      }
      connection.query("SELECT * FROM `folders` WHERE `uid` = '" + uid + "' ORDER BY `typeLevel` DESC, `date` DESC", function (err, result) {
         if (!err) res.status(200).send({ success: true, folders: result })
         connection.release();
      });
   });
});
//---------------------------------------
app.get('/notes/folder/get/notes/:folderID/:uid', (req, res) => {
   pool.getConnection(function (err, connection) {
      if (err) throw err;
      const { folderID, uid } = req.params;

      if (!uid || !folderID) {
         res.status(200).send({ success: false, message: 'Wrong request URL !' });
         connection.release();
         return;
      }
      connection.query("SELECT * FROM `notes` WHERE `uid` = '" + uid + "' AND `folder` = '" + folderID + "' ORDER BY `typeLevel` DESC, `date` DESC", function (err, result) {
         if (!err) res.status(200).send({ success: true, notes: result })
         connection.release();
      });
   });
});
//---------------------------------------
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
//==============================================================================
function getUserCount(email, connection) {
   return new Promise((res, rej) => {
      connection.query("SELECT * FROM `users` WHERE `email` = '" + email + "'", function (err, result) {
         if (!err) res(result.length);
      });
   });
}