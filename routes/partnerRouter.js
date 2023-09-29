const express = require('express');
const partnerRouter = express.Router();
const Partner = require('../models/partner')
////token-based
const authenticate = require('../authenticate');
partnerRouter.route('/')
.get((req, res, next) => {
    Partner.find()
    .then(partners=>res.status(200).json(partners))
    .catch(err=>next(err))
})
//.post((req, res, next) => {
//token-based
.post(authenticate.verifyUser, (req, res, next) => {
    Partner.create(req.body)
    .then(partner=>res.status(200).json(partner))
    .catch(err=>next(err))
})
//.put((req, res) => {
//token-based
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})
//.delete((req, res, next) => {
//token-based
.delete(authenticate.verifyUser, (req, res, next) => {
    Partner.deleteMany()
    .then(partners=>res.status(200).json(partners))
    .catch(err=>next(err))
});

partnerRouter.route('/:partnerId')
.get((req, res) => {
    Partner.findById(req.params.partnerId)
    .then(partner=>res.status(200).json(partner))
    .catch(err=>next(err))
})
//.post((req, res) => {
//token-based
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /partnerId');
})
//.put((req, res, next) => {
//token-based
.put(authenticate.verifyUser, (req, res) => {
    Partner.findByIdAndUpdate(req.params.partnerId, req.body, {new:true})
    .then(partner=>res.status(200).json(partner))
    .catch(err=>next(err))
})
//.delete((req, res, next) => {
//token-based
.delete(authenticate.verifyUser, (req, res, next) => {
    Partner.findByIdAndDelete(req.params.partnerId)
    .then(partner=>res.status(200).json(partner))
    .catch(err=>next(err))
});

module.exports = partnerRouter;