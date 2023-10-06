const express = require('express');
const partnerRouter = express.Router();
const Partner = require('../models/partner')
const cors = require('./cors');

////token-based
const authenticate = require('../authenticate');
partnerRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors,(req, res, next) => {
    Partner.find()
    .then(partners=>res.status(200).json(partners))
    .catch(err=>next(err))
})
//.post((req, res, next) => {
//token-based
.post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Partner.create(req.body)
    .then(partner=>res.status(200).json(partner))
    .catch(err=>next(err))
})
//.put((req, res) => {
//token-based
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})
//.delete((req, res, next) => {
//token-based
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Partner.deleteMany()
    .then(partners=>res.status(200).json(partners))
    .catch(err=>next(err))
});

partnerRouter.route('/:partnerId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res) => {
    Partner.findById(req.params.partnerId)
    .then(partner=>res.status(200).json(partner))
    .catch(err=>next(err))
})
//.post((req, res) => {
//token-based
.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /partnerId');
})
//.put((req, res, next) => {
//token-based
.put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin,(req, res) => {
    Partner.findByIdAndUpdate(req.params.partnerId, req.body, {new:true})
    .then(partner=>res.status(200).json(partner))
    .catch(err=>next(err))
})
//.delete((req, res, next) => {
//token-based
.delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Partner.findByIdAndDelete(req.params.partnerId)
    .then(partner=>res.status(200).json(partner))
    .catch(err=>next(err))
});

module.exports = partnerRouter;