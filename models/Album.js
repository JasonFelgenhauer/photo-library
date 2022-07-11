const { Schema, model } = require('mongoose');

const albumSchema = new Schema(
	{
		title: { type: String, required: true },
		images: [String],
	},
	{ timestamps: true }
);

module.exports = model('Album', albumSchema);
