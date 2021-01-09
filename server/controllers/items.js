const Item = require('../models/item');

exports.createItem = (req, res, next) => {
  const item = new Item({
      title: req.body.title,
      body: req.body.body,
      toDoDay: req.body.toDoDay,
      creator: req.userData.userId
    });
    item.save()
    .then(result => {
      res.status(201).json({
        message: 'Item created!',
        item: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Item could not be created!'
      });
    });
}

exports.UpdateItem = (req, res, next) => {
  const item = new Item({
      _id: req.body.id,
      title: req.body.title,
      body: req.body.body,
      toDoDay: req.body.toDoDay,
      creator: req.userData.userId
    });

    Item.updateOne({_id: req.params.id, creator: req.userData.userId}, item)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({message: 'item updated!', item: result});
      } else {
        res.status(401).json({
          message: 'not authorized'
        })
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Could not update item!'
      })
    });
}

exports.getItems = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currPage = +req.query.page;
  const itemQuery = Item.find({creator: req.userData.userId});
  let fecthedItems;
  if(pageSize && currPage) {
    itemQuery
    .skip(pageSize * (currPage - 1))
    .limit(pageSize)
  }
  itemQuery
    .then(docs => {
      fecthedItems = docs;
      return Item.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Items fecthed successfully!',
        items: fecthedItems,
        totalItems: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Could not get Items!'
      })
    });
}

exports.getItem = (req, res, next) => {
  Item.findOne({_id: req.params.id, creator: req.userData.userId}).then(item => {
    if(item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({message: 'Item not found!'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Could not get item!'
    })
  });
}


exports.deleteItem = (req, res, next) => {
  Item.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({message: 'item deleted!'});
      } else {
        res.status(401).json({
          error: 'not authorized'
        })
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Could not delete the item!'
      })
    });
}


