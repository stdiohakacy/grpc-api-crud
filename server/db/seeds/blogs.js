
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('blogs').del()
    .then(function () {
      // Inserts seed entries
      return knex('blogs').insert([
        {author: "Stephane", title: "Stephs Blog title", content: "First blog"},
        {author: "Paulo", title: "Paulos Blog title", content: "First blog"},
        {author: "James", title: "James Blog title", content: "First blog"},
      ]);
    });
};
