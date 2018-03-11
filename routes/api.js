const express = require('express');
const router = express.Router();
const mongoEnv = require('../mongoEnv');
const assert = require('assert');
const md5 = require('md5');
const ObjectID = require('mongodb').ObjectID;

const signin = async (req, res) => {
  let db = req.db, query = req.query, col, docs;
  let username = query.username, password = query.password;
  if (!username || !password) {
    return res.send({
      errcode: 1,
      msg: '信息不全'
    })
  };
  try {
    col = await db.collection(mongoEnv.dbInfo.userCol);
    docs = await col.find({username: username}).toArray();
    db.close();
    if (docs.length === 0) {
      return res.send({
        errorcode: 2,
        msg: '用户不存在'
      })
    }
    let result =  docs[0].password === md5(password) ? {
      errorcode: 0,
      msg: ''
    } : {
      errorcode: 3,
      msg: '密码错误'
    }
    db.close()
    res.send(result);
  } catch (error) {
    console.log(error.stack);
    db.close();
    res.status(500).end()
  }
}

const signup = async (req, res) => {
  const db = req.db, body = req.body;
  let username = body.username, password = body.password;
  if (!username || !password) {
    return res.send({
      err_code: 1,
      msg: '信息不全'
    })
  }
  try {
    let col = await db.collection(mongoEnv.dbInfo.userCol);
    let exist = await col.find({username: username}).toArray();
    if (exist.length) {
      return res.send({
        errorcode: 2,
        msg: '用户已存在'
      })
    }
    let rowCheck = await col.insert({
      username: username,
      password: md5(password)
    });
    db.close()
    assert.equal(1, rowCheck.insertedCount);
    let result = rowCheck.insertedCount === 1 ? {
      errorcode: 0,
      msg: ''
    } : {
      errorcode: 3,
      msg: '系统故障'
    }
    db.close()
    res.send(result)
  } catch (error) {
    console.log(error.stack);
    db.close()
    res.status(500).end()
  }
}

const addLottery = async (req, res) => {
  const db = req.db, body = req.body;
  let obj = body.obj, username = body.username;
  try {
    let col = await db.collection(mongoEnv.dbInfo.lotteryCol);
    obj.status = 'in-process'
    let insertDoc = await col.insert(obj);
    assert(1, insertDoc.insertedCount);
    let userCol = await db.collection(mongoEnv.dbInfo.userCol);
    let createLotterys = await userCol.find({ username: username }).toArray()
    createLotterys[0].createLotterys.push(insertDoc.insertedIds[0]);
    let updateDoc = await userCol.updateOne({ username: username }, {
      $set: {
        createLotterys: createLotterys[0].createLotterys
      }
    });
    assert(1, updateDoc.upsertedCount);
    let result = insertDoc.insertedCount === 1 ? {
      errorcode: 0,
      msg: insertDoc
    } : {
      errorcode: 1,
      msg: '系统故障'
    };
    db.close()
    res.send(result);
  } catch (error) {
    console.log(error.stack);
    db.close();
    res.status(500).end();
  }
}

const myCreateLottery = async (req, res) => {
  const db = req.db, query = req.query;
  const username = query.username;
  try {
    let userCol = await db.collection(mongoEnv.dbInfo.userCol);
    let userInfo = await userCol.find({ username: username}).toArray();
    if (!userInfo.length) {
      res.status(404).end();
      return;
    }
    let queryId = userInfo[0].createLotterys.map(item => ObjectID(item));
    let lotteryCol = await db.collection(mongoEnv.dbInfo.lotteryCol);
    let myLottery = await lotteryCol.find({ _id: { $in: queryId } }).toArray();
    db.close();
    res.send(myLottery);
  } catch (error) {
    console.log(error.stack)
    db.close()
    res.status(500).end()
  }
}

const getLotteryDetail = async (req, res) => {
  const db = req.db, query = req.query;
  try {
    let lotteryCol = await db.collection(mongoEnv.dbInfo.lotteryCol);
    let lotteryDetail = await lotteryCol.find({ _id: ObjectID(query.id)}).toArray();
    if (!lotteryDetail.length) {
      res.send({
        errorcode: 1,
        msg: '系统故障'
      });
      return
    }
    db.close();
    res.send(lotteryDetail);
  } catch (error) {
    console.log(error.stack);
    db.close();
    res.status(500).end();
  }
}

router.get('/signin', (req, res) => {
  signin(req, res);
});

router.post('/signup', (req, res) => {
  signup(req, res);
});

router.post('/addLottery', (req, res) => {
  addLottery(req, res);
})

router.get('/myCreateLottery', (req, res) => {
  myCreateLottery(req, res);
})

router.get('/getLotteryDetail', (req, res) => {
  getLotteryDetail(req, res);
})

module.exports = router;
