import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    validate: {
      validator: (value) => ["income", "expense"].includes(value),
      message: (props) => `${props.value} is not a valid category type`,
    },
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
