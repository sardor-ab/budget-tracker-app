import asyncHandler from "express-async-handler";
import Subscription from "../models/subscriptionModel.js";

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

const convertToTransaction = async (subscriptions) => {
  subscriptions.map((subscription) => {
    const {
      title,
      type,
      categories,
      amount,
      payee,
      date,
      description,
      card,
      attachment,
    } = subscription;

    const transaction = {
      title,
      type,
      categories,
      amount,
      payee,
      date,
      description,
      card,
      attachment,
    };

    return transaction;
  });

  // const transaction = {
  //   type: "expense",
  //   card: subscription.card,
  //   user: subscription.user,
  //   date: subscription.date,
  //   payee: subscription.payee,
  //   title: subscription.title,
  //   amount: subscription.amount,
  //   attachment: subscription.attachment,
  //   description: subscription.description,
  //   categories: subscription.categoryList,
  // };
};

export const getUserSubscriptions = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { date } = req.query;

  const subscriptions = await Subscription.aggregate([
    {
      $set: {
        card_id: {
          $toString: "$card",
        },
      },
    },
    {
      $match: {
        card_id: id,
      },
    },
    {
      $sort: {
        startDate: parseInt(date),
      },
    },
  ]);

  res.status(200).json({
    success: true,
    subscriptions,
    message: "Subscriptions fetched successfully!",
  });
});

export const updateSubscription = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    startDate,
    endDate,
    amount,
    payee,
    categoryList,
    lastPaymentDate,
    nextPaymentDate,
    paymentRepetition,
    durationNumber,
  } = req.body;

  const user = req.user;
  const { card, subscription } = req.query;

  const local = await Subscription.findById(subscription);

  if (startDate < new Date() && new Date() < local.lastPaymentDate) {
    // create transaction
  }

  await Subscription.findByIdAndUpdate(
    subscription,
    {
      $set: {
        title,
        description,
        startDate,
        endDate,
        amount,
        payee,
        categoryList,
        lastPaymentDate,
        nextPaymentDate,
        paymentRepetition,
        durationNumber,
      },
    }
    // { new: true },
    // function (error) {
    //   if (error) {
    //     return res.send(error);
    //   } else {
    //     return res.json({
    //       success: true,
    //       message: "Subscription updated successfully",
    //     });
    //   }
    // }
  );

  return res.json({
    success: true,
    message: "Subscription updated successfully",
  });
});

export const createSubscription = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    startDate,
    amount,
    categoryList,
    payee,
    durationNumber,
    durationUnit,
  } = req.body;
  const user = req.user;
  const id = req.query.card;
  const firstPaymentDate = new Date(startDate);
  const lastPaymentDate = new Date(startDate);
  const paymentRepetition = durationUnit;

  let duration = durationNumber;

  let endDate = new Date(lastPaymentDate);
  let nextPaymentDate = new Date(lastPaymentDate);

  switch (durationUnit) {
    case "week":
      endDate.setDate(lastPaymentDate.getDate() + duration * 7);
      nextPaymentDate.setDate(lastPaymentDate.getDate() + 7);
      break;
    case "month":
      endDate.setMonth(lastPaymentDate.getMonth() + duration);
      nextPaymentDate.setMonth(lastPaymentDate.getMonth() + 1);

      const qtyOfNextMonth = getDaysInMonth(
        nextPaymentDate.getFullYear(),
        nextPaymentDate.getMonth()
      );

      const qtyOfLastMonth = getDaysInMonth(
        endDate.getFullYear(),
        endDate.getMonth()
      );

      if (qtyOfNextMonth < lastPaymentDate.getDate()) {
        nextPaymentDate.setDate(qtyOfNextMonth);
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() - 1);
      }
      if (qtyOfLastMonth < firstPaymentDate.getDate()) {
        endDate.setDate(qtyOfLastMonth);
        endDate.setMonth(endDate.getMonth() - 1);
      }

      break;
    case "year":
      endDate.setFullYear(lastPaymentDate.getFullYear() + duration);
      nextPaymentDate.setFullYear(lastPaymentDate.getFullYear() + 1);
      break;
  }

  const subscription = {
    card: id,
    user,
    title,
    description,
    startDate,
    endDate,
    amount,
    payee,
    categoryList,
    lastPaymentDate,
    nextPaymentDate,
    paymentRepetition,
    durationNumber,
  };

  await Subscription.create(subscription);

  const subscriptions = await Subscription.find({ card: id });

  res.status(200).json({
    success: true,
    subscriptions,
    message: "Subscription created successfully!",
  });
});
export const deleteSubscription = asyncHandler(async (req, res) => {
  const { card, subscription } = req.query;

  const user = req.user;

  await Subscription.findByIdAndRemove({ _id: subscription });
  // await Subscription.findByIdAndRemove({ _id: subscription }, async (err) => {
  //   if (err) {
  //     return res.status(400).json({
  //       success: false,
  //       error: err,
  //     });
  //   } else {
  //     const subscriptions = await Subscription.find({ user, card });

  //     res.status(200).json({
  //       success: true,
  //       subscriptions,
  //       message: "Subscription deleted successfully!",
  //     });
  //   }
  // });
  const subscriptions = await Subscription.find({ user, card });

  res.status(200).json({
    success: true,
    subscriptions,
    message: "Subscription deleted successfully!",
  });
});
