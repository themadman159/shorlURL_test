import { Request, Response } from "express";

const express = require('express');
const router = express.Router();

const { getData, insertData, increviewCount, insertShortURL } = require('../controller/controller')

router.post('/insert', insertData)
router.put('/insert/increviewCount/:historyID', increviewCount)
router.get('/data', getData)
router.put('/insert/shortURL', insertShortURL )


module.exports = router;