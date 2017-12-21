export class EditGuards {
  constructor(editLists) {
    this.editGuards = {};
    this.editLists = editLists;
  }

  listCollection(name) {
    return this.editLists[name].collection;
  }
  save(object) {
    var data = _.cloneDeep(object);
    delete data._id;
    delete data.$$hashKey;
    delete data.$$list;
    this.listCollection(object.$$list).update({_id:object._id}, data);
  }
  hasChanges(object) {
    var currentObject = this.listCollection(object.$$list).findOne({_id:object._id});
    for (var attr in object) {
      if (attr == '_id' || attr == '$$hashKey' || attr == '$$list') continue;
      if (!_.isEqual(object[attr], currentObject[attr])) return true;
    }
    return false;
  }
  delete(object) {
    delete this.editGuards[object.$$list][object._id._str];
    this.listCollection(object.$$list).remove({_id:object._id});
  }
  cancel(object) {
    var currentObject = this.listCollection(object.$$list).findOne({_id:object._id});
    for (var attr in object) {
      if (attr == '_id' || attr == '$$hashKey' || attr == '$$list') continue;
      object[attr] = currentObject[attr];
    }
  }

  static filter() {
    return function(list, controller, name) {
      var newList = [];
      if (!controller.editGuards[name]) {
        controller.editGuards[name] = {};
      }
      for (var item of list) {
        if (!controller.editGuards[name][item._id._str]) {
          controller.editGuards[name][item._id._str] = _.cloneDeep(item);    
          controller.editGuards[name][item._id._str].$$list = name;

        }
        newList.push(controller.editGuards[name][item._id._str]);
      }
      return newList;
    }
  }
}
