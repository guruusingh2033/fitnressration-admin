import angular from 'angular';
import angularMeteor from 'angular-meteor';
import admin from '../imports/components/admin/controller';
import pages from '../imports/pages';
_ = lodash;
Meteor.startup(() => {
  angular.module('app', [
    angularMeteor,
    admin.name,
  ]);
});

FlowRouter.route('/', {
  name: 'root'
});

for (var pageName in pages) {
  var page = pages[pageName];
  FlowRouter.route(page.path, {
    name: pageName,
  });
  if (page.sub) {
    for (var subPage of page.sub) {
      FlowRouter.route(subPage.path, _.merge({
        name: pageName,
      }, subPage.params));
    }
  }
}
