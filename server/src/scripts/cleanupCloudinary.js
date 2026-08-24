require("dotenv").config();

const connectDB = require("../config/DB");
const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product");

const getUsedPublicIds = async () => {
    const products = await Product.find({}, "images").lean();
    const usedPublicIds = new Set();

    for (const product of products) {
        for (const image of product.images || []) {
            if (image.public_id) {
                usedPublicIds.add(image.public_id);
            }
        }
    }

    return usedPublicIds;
};

const getCloudinaryImages = async () => {
    const resources = [];
    let nextCursor;

    do {
        const options = {
            type: "upload",
            prefix: "ArtisansCorner/",
            max_results: 500
        };

        if (nextCursor) {
            options.next_cursor = nextCursor;
        }

        const result = await cloudinary.api.resources(options);

        resources.push(...result.resources);
        nextCursor = result.next_cursor;
    } while (nextCursor);

    return resources;
};

const cleanupCloudinary = async () => {
    try {
        await connectDB();

        const usedPublicIds = await getUsedPublicIds();
        const cloudinaryImages = await getCloudinaryImages();

        const orphanedImages = cloudinaryImages.filter(
            (image) => !usedPublicIds.has(image.public_id)
        );

        console.log("---------------------------------");
        console.log(
            `Cloudinary images: ${cloudinaryImages.length}`
        );
        console.log(
            `Used images: ${usedPublicIds.size}`
        );
        console.log(
            `Unused images: ${orphanedImages.length}`
        );

        for (const image of orphanedImages) {
            console.log(
                `Deleting: ${image.public_id}`
            );

            const result = await cloudinary.uploader.destroy(
                image.public_id
            );

            console.log(
                `Result: ${result.result}`
            );
        }

        console.log("---------------------------------");
        console.log("Cloudinary cleanup completed.");
        console.log("---------------------------------");

        process.exit(0);
    } catch (error) {
        console.error(
            "Cloudinary cleanup failed:",
            error
        );

        process.exit(1);
    }
};

cleanupCloudinary();