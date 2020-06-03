const express = require('express');

const Users = require('../users/userDb');
const Posts = require('../posts/postDb');
const router = express.Router();

router.get('/', (req, res) => {
  Users.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving users" });
    })
});

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error adding the user"});
    })
});

router.get('/:id', validateUserId, (req, res) => {
  Users.getById(req.params.id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Unable to retrieve user" });
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then(user => {
      res.status(200).json({ message: "User has been deleted" });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Unable to delete user"});
    })
});

router.put('/:id', validateUserId, (req, res) => {
  if(req.body.name === '') {
    res.status(400).json({ message: "User must have a name" })
  } else {
    Users.update(req.params.id, req.body)
      .then(user => {
        res.status(200).json(req.body);
      })
      .catch(err => {
        console.log(err);
        req.status(500).json({ message: "Error updating the user" });
      })
  }
});

router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(500).json({ message: "Error retrieving posts" });
  })
});

router.post('/:id/posts', validatePost, (req, res) => {
  const postInfo = { ...req.body, user_id: req.params.id };
  Posts.insert(postInfo)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Unable to create the post" });
    })
});

//custom middleware
function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then(user => {
      if(user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ message: "invalid user id" })
      }
    })
    .catch(err => {
      console.log(err);
    })
};

function validateUser(req, res, next) {
  if(req.body) {
    if(req.body.name) {
      next();
    } else {
      res.status(400).json({ message: "missing required name field" });
    }
  } else {
    res.status(400).json({ message: "missing user data" });
  }
};

function validatePost(req, res, next) {
  Users.getUserPosts(req.params.id)
    .then(user => {
      if(user.length < 0) {
        res.status(400).json({ message: "missing post data" });
      } else if(user.text === '') {
        res.status(400).json({ message: "missing required text field" })
      } else {
        next();
      }
    })
    .catch(err => {
      console.log(err);
    })
};

module.exports = router;

