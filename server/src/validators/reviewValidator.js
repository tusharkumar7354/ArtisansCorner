const ApiError = require("../utils/ApiError");


// Create Review Validation

const validateCreateReview = (req, res, next) => {

    const {

        productId,

        rating,

        comment

    } = req.body;


    if (

        !productId ||

        rating === undefined ||

        !comment

    ) {

        return next(

            new ApiError(

                400,

                "Product, rating and comment are required"

            )

        );

    }


    const numericRating = Number(rating);


    if (

        Number.isNaN(numericRating) ||

        numericRating < 1 ||

        numericRating > 5

    ) {

        return next(

            new ApiError(

                400,

                "Rating must be between 1 and 5"

            )

        );

    }


    req.body.rating = numericRating;


    next();

};


// Update Review Validation

const validateUpdateReview = (req, res, next) => {

    const {

        rating,

        comment

    } = req.body;


    if (

        rating === undefined &&

        comment === undefined

    ) {

        return next(

            new ApiError(

                400,

                "Rating or comment is required"

            )

        );

    }


    if (rating !== undefined) {

        const numericRating = Number(rating);


        if (

            Number.isNaN(numericRating) ||

            numericRating < 1 ||

            numericRating > 5

        ) {

            return next(

                new ApiError(

                    400,

                    "Rating must be between 1 and 5"

                )

            );

        }


        req.body.rating = numericRating;

    }


    next();

};


module.exports = {

    validateCreateReview,

    validateUpdateReview

};