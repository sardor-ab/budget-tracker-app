import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    card: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Card",
    },
    title: {
      type: String,
      required: true,
    },
    categoryList: [],
    amount: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    lastPaymentDate: {
      type: Date,
      required: true,
    },
    nextPaymentDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
    attachment: {
      type: String,
    },
    payee: {
      type: String,
      required: true,
    },
    paymentRepetition: {
      type: String,
      required: true,
    },
    durationNumber: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
