import { AdminComponent } from './AdminComponent';
import { Deleted } from './api/deleted';
_ = lodash;

export class ListAdminComponent extends AdminComponent {
  delete() {
    var collection = typeof this.collection == 'string' ? AdminComponent.collection(this.collection) : this.collection;
    for (var id of this._selected) {
      var doc = collection.findOne({_id:new Mongo.ObjectID(id)});
      Deleted.insert({
        collection: collection._name,
        timestamp: new Date(),
        document: doc
      });
      collection.remove({_id:doc._id});
    }
  }

  get allSelected() {
    return this._selected.length == this.documents.length;
  }

  set allSelected(v) {
    if (v) {
      if (!this.selected) this.selected = {};
      for (var doc of this.documents) {
        this.selected[doc._id._str] = true;
      }
    }
    else {
      this.selected = {};
    }
  }

  get _selected() {
    return _.transform(this.selected, (selected, value, key) => {
      if (value) {
        selected.push(key);
      }
    }, [])
  }
}