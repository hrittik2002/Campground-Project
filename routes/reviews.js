const exprss  = require('express');
const router = exprss.Router({ mergeParams : true });
const reviews = require('../controllers/reviews.js')
const { validateReview , isLoggedIn , isReviewAuthor} = require('../middleware');
const ExpressError = require('../utils/ExpressError.js')
const catchAsync = require('../utils/catchAsync.js')


// Create a review
router.post('/' , isLoggedIn ,validateReview ,  catchAsync(reviews.createReview))

//delete a review
router.delete('/:reviewId' , isLoggedIn , isReviewAuthor ,catchAsync(reviews.deleteReview))

/**
 * exporting
 */
module.exports = router;