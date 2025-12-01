import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      enum: ['catering', 'decoration', 'photography', 'music', 'venue', 'other'],
      required: true
    },
    image: {
      type: String,
      default: null
    },
    minGuests: {
      type: Number,
      default: 50
    },
    maxGuests: {
      type: Number,
      default: 500
    },
    isActive: {
      type: Boolean,
      default: true
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: {
      type: Number,
      default: 0
    },
    customizationOptions: [
      {
        optionName: String,
        optionType: {
          type: String,
          enum: ['text', 'select', 'number', 'date']
        },
        isRequired: Boolean,
        choices: [String] // Nếu type là select
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);
