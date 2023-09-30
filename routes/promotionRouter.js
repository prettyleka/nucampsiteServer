const express = require('express');
const promotionRouter = express.Router();
const Promotion = require('../models/promotion')
////token-based
const authenticate = require('../authenticate');

promotionRouter.route('/')
.get((req, res, next) => {
    Promotion.find()
    .then(promotions=>res.status(200).json(promotions))
    .catch(err=>next(err))
})
//.post((req, res, next) => {
//token-based
.post(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Promotion.create(req.body)
    .then(promotion=>res.status(200).json(promotion))
    .catch(err=>next(err))
})
//.put((req, res) => {
//token-based
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
//.delete((req, res, next) => {
//token-based
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Promotion.deleteMany()
    .then(promotions=>res.status(200).json(promotions))
    .catch(err=>next(err))
});

promotionRouter.route('/:promotionId')
.get((req, res) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion=>res.status(200).json(promotion))
    .catch(err=>next(err))
})
//.post((req, res) => {
//token-based
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotionId');
})
//.put((req, res, next) => {
//token-based
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    Promotion.findByIdAndUpdate(req.params.promotionId, req.body, {new:true})
    .then(promotion=>res.status(200).json(promotion))
    .catch(err=>next(err))
})
//.delete((req, res, next) => {
//token-based
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then(promotion=>res.status(200).json(promotion))
    .catch(err=>next(err))
});

module.exports = promotionRouter;