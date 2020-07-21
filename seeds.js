const mongoose = require("mongoose"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment");

const data = [
  {
    name: "Tofino",
    image:
      "https://images.unsplash.com/photo-1514981945131-4a9ada3f8d4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=966&q=80",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic necessitatibus iusto saepe autem animi officia quia, et praesentium debitis, molestias, molestiae minima vitae maiores quibusdam error aspernatur facilis sapiente neque.",
  },
  {
    name: "Banff",
    image:
      "https://images.unsplash.com/photo-1532137965533-84bbd6f04371?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic necessitatibus iusto saepe autem animi officia quia, et praesentium debitis, molestias, molestiae minima vitae maiores quibusdam error aspernatur facilis sapiente neque.",
  },
  {
    name: "Yellow Knife",
    image:
      "https://images.unsplash.com/photo-1525177089949-b1488a0ea5b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic necessitatibus iusto saepe autem animi officia quia, et praesentium debitis, molestias, molestiae minima vitae maiores quibusdam error aspernatur facilis sapiente neque.",
  },
];
//remove all campgrounds
function seedDB() {
  Campground.deleteMany({}, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("removed campgrounds");
    //add campgrounds with seeded data
    data.forEach((seed) => {
      Campground.create(seed, (err, campground) => {
        err ? console.log(err) : console.log("added campground");
        //create comment
        Comment.create(
          {
            text: "this place is great but wish there was internet",
            author: "dale Dickens",
          },
          (err, comment) => {
            if (err) {
              console.log(err);
            } else {
              campground.comments.push(comment);
              campground.save();
              console.log("created new comment");
            }
          }
        );
      });
    });
  });
  //add comments
}

module.exports = seedDB;
