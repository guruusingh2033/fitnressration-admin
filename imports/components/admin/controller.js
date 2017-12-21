import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import pages from '../../pages';
import { BundleTypes } from '../../api/bundleTypes';
import { Portions } from '../../api/portions';
import { MealPlans } from '../../api/mealPlans';

_ = lodash;

class AdminCtrl {
	constructor($scope, $meteor, $reactive, $compile, $element, $timeout, $rootScope) {
    $scope.viewModel(this);
    $reactive(this).attach($scope);
    this.subscribe('users');
		this.page = null;
    this.today = new Date();

    $meteor.autorun($scope, () => {
      this.user = Meteor.user();
      var name = FlowRouter.getRouteName();
      switch (name) {
      	case 'order':
      		this.order = FlowRouter.getParam('orderId');
          break;
      }
      this.page = name;
      // var template = pages[this.page].template;
      // var el = $compile(template)($scope);
      // $element.find('.main').html('').append(el);
    });

    $scope.$watch('$ctrl.page', () => {
      this.initMain();
    }, true);

    this.$compile = $compile;
    this.$scope = $scope;
    this.$element = $element;
	}

  param(param) {
    return FlowRouter.getParam(param);
  }

  initMain() {
    if (this.pageScope) {
      this.pageScope.$destroy();
    }

    if (pages[this.page]) {
      this.pageTitle = pages[this.page].title;
      
      var template = pages[this.page].template;
      this.pageScope = this.$scope.$new();
      var el = this.$compile(template)(this.pageScope);

      this.$element.find('.main .body').html('').append(el);
    }
  }
}

export default angular.module('admin', [
  angularMeteor,
  'accounts.ui',
].concat(_.transform(pages, (modules, module) => {
    modules.push(module.module.default.name);
  }, [])))
  .filter('image', function() {
    return function(value) {
      return Meteor.settings.public.imageServerUrl + '/image.php?image=' + value;
    };
  })
  .filter('upperFirst', function() {
    return (value) => {
      return _.upperFirst(value);
    };
  })
  .directive('upload', function($parse) {
    return {
      scope: true,
      link(scope, element, attrs) {
        var invoker = $parse(attrs.upload);
        element.change(function() {
          var fileReader = new FileReader;
          fileReader.onloadend = (evt) => {
            var data = (fileReader.result || evt.srcElement.result || evt.target.result).split(',')[1];
            Meteor.call('uploadImage', {
              data: data,
              type: attrs.uploadType
            }, (err, res) => {
              this.value = '';
              invoker(scope, res);
              scope.$apply();
            });
          };
          fileReader.readAsDataURL(this.files[0]);
        });
      }
    };
  })
  .component('admin', {
    templateUrl: template,
    controller: AdminCtrl
  });
