import mongoose from "mongoose";

const userProductSchema = new mongoose.Schema({
    products: [
        {
            name: {
                type: String,
                required: true,
                trim: true
            },
            price: {
                type: Number,
                required: true,
                min: 0
            },
            description: {
                type: String,
                trim: true
            },
            supply: {
                type: Number,
                required: true,
                min: 0
            },
            stat: {
                yearlySalesTotal: {
                    type: Number,
                    default: 0
                },
                yearlyTotalSoldUnits: {
                    type: Number,
                    default: 0
                }
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Registration',
        required: true
    }
}, { timestamps: true });

const UserProduct = mongoose.model("UserProduct", userProductSchema);
export default UserProduct;
