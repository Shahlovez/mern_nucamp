const express = require('express');
const Partner = require('../models/partner');
const partnerRouter = express.Router();

partnerRouter.route('/')
.get((req, res, next) => {
    Partner.find()
      .then(partners => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partners);
      })
      .catch(err => next(err));
  })
.post((req, res, next) => {
    Partner.create(req.body)
      .then(partner => {
        console.log("Partner Created ", partner);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch(err => next(err));
  })
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})
.delete((req, res, next) => {
    Partner.deleteMany()
      .then(response => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch(err => next(err));
  });

partnerRouter.route('/:partnerId')
.get((req, res, next) => {
    Partner.findById(req.params.partnerId)
      .then(partner => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch(err => next(err));
  })
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /partners/${req.params.partnerId}`);
})
.put((req, res, next) => {
    Partner.findByIdAndUpdate(req.params.partnerId,{$set: req.body},
      { new: true })
      .then(partner => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch(err => next(err));
  })
.delete((req, res) => {
    Partner.findByIdAndDelete(req.params.partnerId)
    .then(response => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(response);
    })
    .catch(err => next(err));
});

// COMMENTS

partnerRouter.route("/:partnerId/comments")
  .get((req, res, next) => {
    Partner.findById(req.params.partnerId)
      .then(partner => {
        if (partner) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(partner.comments);
        } else {
         const err = new Error(`partner ${req.params.partnerId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch(err => next(err));
  })
  .post((req, res, next) => {
    Partner.findById(req.params.partnerId)
      .then((partner) => {
        if (partner) {
          partner.comments.push(req.body);
          Partner.save()
            .then((partner) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(partner);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`partner ${req.params.partnerId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /partners/${req.params.partnerId}/comments`
    );
  })
  .delete((req, res, next) => {
    Partner.findById(req.params.partnerId)
      .then((partner) => {
        if (partner) {
          for (let i = partner.comments.length - 1; i >= 0; i--) {
            partner.comments.id(partner.comments[i]._id).remove();
          }
          partner.save()
            .then(partner => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(partner);
            })
            .catch(err => next(err));
        } else {
         const err = new Error(`partner ${req.params.partnerId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch(err => next(err));
  });

// partnerRouter.route("/:partnerId/comments/:commentId")
//   .get((req, res, next) => {
//     Partner.findById(req.params.partnerId)
//       .then(partner => {
//         if (partner && partner.comments.id(req.params.commentId)) {
//           res.statusCode = 200;
//           res.setHeader("Content-Type", "application/json");
//           res.json(partner.comments.id(req.params.commentId));
//         } else if (!partner) {
//           err = new Error(`partner ${req.params.partnerId} not found`);
//           err.status = 404;
//           return next(err);
//         } else {
//           const err = new Error(`Comment ${req.params.commentId} not found`);
//           err.status = 404;
//           return next(err);
//         }
//       })
//       .catch((err) => next(err));
//   })
//   .post((req, res) => {
//     res.statusCode = 403;
//     res.end(
//       `POST operation not supported on /partners/${req.params.partnerId}/comments/${req.params.commentId}`
//     );
//   })
//   .put((req, res, next) => {
//     Partner.findById(req.params.partnerId)
//       .then((partner) => {
//         if (partner && partner.comments.id(req.params.commentId)) {
//           if (req.body.rating) {
//             partner.comments.id(req.params.commentId).rating = req.body.rating;
//           }
//           if (req.body.text) {
//             partner.comments.id(req.params.commentId).text = req.body.text;
//           }
//           partner
//             .save()
//             .then((partner) => {
//               res.statusCode = 200;
//               res.setHeader("Content-Type", "application/json");
//               res.json(partner);
//             })
//             .catch((err) => next(err));
//         } else if (!partner) {
//           err = new Error(`partner ${req.params.partnerId} not found`);
//           err.status = 404;
//           return next(err);
//         } else {
//           const err = new Error(`Comment ${req.params.commentId} not found`);
//           err.status = 404;
//           return next(err);
//         }
//       })
//       .catch((err) => next(err));
//   })
//   .delete((req, res, next) => {
//     Partner.findById(req.params.partnerId)
//       .then((partner) => {
//         if (partner && partner.comments.id(req.params.commentId)) {
//           partner.comments.id(req.params.commentId).remove();
//           partner
//             .save()
//             .then((partner) => {
//               res.statusCode = 200;
//               res.setHeader("Content-Type", "application/json");
//               res.json(partner);
//             })
//             .catch((err) => next(err));
//         } else if (!partner) {
//           err = new Error(`partner ${req.params.partnerId} not found`);
//           err.status = 404;
//           return next(err);
//         } else {
//           const err = new Error(`Comment ${req.params.commentId} not found`);
//           err.status = 404;
//           return next(err);
//         }
//       })
//       .catch(err => next(err));
//   });
module.exports = partnerRouter;
