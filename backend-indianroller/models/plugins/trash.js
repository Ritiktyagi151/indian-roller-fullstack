// Keep records and their references intact while hiding them from normal queries.
module.exports = function trashPlugin(schema) {
  schema.add({ deletedAt: { type: Date, default: null, index: true } });
  schema.pre(/^(find|count|distinct|update|replace|delete)/, function () {
    if (!this.getOptions().includeDeleted) this.where({ deletedAt: null });
  });
  schema.statics.moveToTrash = function (filter) {
    return this.findOneAndUpdate(filter, { $set: { deletedAt: new Date() } }, { returnDocument: "after" });
  };
};
