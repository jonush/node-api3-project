const express = require('express');

const Posts = require('./postDb');
const router = express.Router();

router.get('/', (req, res) => {
  Posts.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500).json({ message: "Error retrieving posts" });
    })
});

router.get('/:id', validatePostId, (req, res) => {
  Posts.getById(req.params.id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving the post" });
    })
});

router.delete('/:id', validatePostId, (req, res) => {
  Posts.remove(req.params.id)
    .then(post => {
      res.status(200).json({ message: "Post has been deleted" });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Unable to delete the post" });
    })
});

router.put('/:id', validatePostId, (req, res) => {
  Posts.update(req.params.id, req.body)
    .then(post => {
      res.status(200).json(req.body);
    })
    .catch(err => {
      console.log(err);
      req.status(500).json({ message: "Unable to update the post" });
    })
});

// custom middleware
function validatePostId(req, res, next) {
  Posts.getById(req.params.id)
    .then(post => {
      if(post) {
        res.post = post;
        next();
      } else {
        res.status(400).json({ message: "invalid post id" });
      }
    })
    .catch(err => {
      console.log(err);
    })
}

module.exports = router;
