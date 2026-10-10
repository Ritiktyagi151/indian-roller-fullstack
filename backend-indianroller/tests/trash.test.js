const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");

// Exercise real Mongoose query middleware with an in-memory collection adapter.
for (const name of ["Product", "Category", "Blog", "Enquiry", "SeoEntry", "Redirect"]) {
  test(`${name}: trash hides records, restore preserves data, permanent delete requires trash`, async () => {
    const Model = require(`../models/${name}`);
    const id = new mongoose.Types.ObjectId();
    let stored = { _id: id, name: "Original", image: "/uploads/keep.jpg", deletedAt: null };
    const matches = (filter) => stored && Object.entries(filter).every(([key, value]) => {
      if (value && Object.prototype.hasOwnProperty.call(value, "$ne")) return stored[key] !== value.$ne;
      return String(stored[key]) === String(value);
    });
    Model.collection.findOne = async (filter) => matches(filter) ? { ...stored } : null;
    Model.collection.findOneAndUpdate = async (filter, update) => {
      if (!matches(filter)) return null;
      stored = { ...stored, ...update.$set };
      return { ...stored };
    };
    Model.collection.findOneAndDelete = async (filter) => {
      if (!matches(filter)) return null;
      const result = stored;
      stored = null;
      return result;
    };

    assert.ok(await Model.findById(id));
    const trashed = await Model.moveToTrash({ _id: id });
    assert.ok(trashed.deletedAt instanceof Date);
    assert.equal(await Model.findById(id), null);
    assert.equal(await Model.moveToTrash({ _id: id }), null);
    // Ordinary writes cannot change an item in Trash.
    assert.equal(await Model.findByIdAndUpdate(id, { name: "Changed" }), null);
    const filter = { _id: id, deletedAt: { $ne: null } };
    assert.ok(await Model.findOne(filter).setOptions({ includeDeleted: true }));
    const restored = await Model.findOneAndUpdate(filter, { $set: { deletedAt: null } }, { returnDocument: "after", includeDeleted: true });
    assert.equal(restored.deletedAt, null);
    assert.equal(stored.image, "/uploads/keep.jpg");
    assert.equal(stored.name, "Original");
    assert.ok(await Model.findById(id));
    assert.equal(await Model.findOneAndDelete(filter, { includeDeleted: true }), null);
    await Model.moveToTrash({ _id: id });
    assert.ok(await Model.findOneAndDelete(filter, { includeDeleted: true }));
    assert.equal(await Model.findById(id), null);
  });
}
