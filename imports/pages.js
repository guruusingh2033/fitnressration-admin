export default {
  orders: {
    module: require('./components/orders/list/controller'),
    template: `<orders></orders>`,
    path: '/orders',
    title: 'Orders'
  },
  addOrder: {
    module: require('./components/orders/add/controller'),
    template: `<addorder></addorder>`,
    path: '/orders/add',
    title: 'Add Order'
  },
  order: {
    module: require('./components/orders/view/controller'),
    template: `<order order="$ctrl.order"></order>`,
    path: '/orders/:orderId',
    title: 'Orders'
  },

  fulfillmentCapacity: {
    module: require('./components/fulfillment-capacity/controller'),
    template: `<fulfillmentcapacity></fulfillmentcapacity>`,
    path: '/fulfillment/capacity',
    title: 'Fulfillment Capacity'
  },
  fulfillmentSchedule: {
    module: require('./components/fulfillment-schedule/controller'),
    template: `<fulfillmentschedule></fulfillmentschedule>`,
    path: '/fulfillment/schedule',
    title: 'Fulfillment Schedule'
  },
  fulfillmentCharges: {
    module: require('./components/fulfillment-charges/controller'),
    template: `<fulfillmentcharges></fulfillmentcharges>`,
    path: '/fulfillment/charges',
    title: 'Fulfillment Charges'
  },
  fulfillmentSettings: {
    module: require('./components/fulfillment-settings/controller'),
    template: `<fulfillmentsettings></fulfillmentsettings>`,
    path: '/fulfillment/settings',
    title: 'Fulfillment Settings'
  },
  
  inventoryStatus: {
    module: require('./components/inventory-status/controller'),
    template: `<inventorystatus></inventorystatus>`,
    path: '/inventory/status',
    title: 'Inventory Status',
    sub: [
      {path:'/inventory/status/overview', params:{view:'overview'}},
      {path:'/inventory/status/adjustment', params:{view:'adjustment'}},
      {path:'/inventory/status/non-sales', params:{view:'nonSales'}},
      {path:'/inventory/status/restock', params:{view:'restock'}},
    ]
  },

  promotions: {
    module: require('./components/promotions/list/controller'),
    template: `<promotions></promotions>`,
    path: '/promotions',
    title: 'Promotion'
  },
  editPromotion: {
    module: require('./components/promotions/edit/controller'),
    template: `<editpromotion promotion-id="$ctrl.param('promotionId')"></editpromotion>`,
    path: '/promotions/:promotionId/edit',
    title: 'Edit Promotion'
  },
  addPromotion: {
    module: require('./components/promotions/add/controller'),
    template: `<addpromotion></addpromotion>`,
    path: '/promotions/add',
    title: 'Add Promotion'
  },

  meals: {
    module: require('./components/meals/list/controller'), 
    template: `<meals></meals>`,
    path: '/products/meals',
    title: 'Meals'
  },
  editMeal: {
    module: require('./components/meals/edit/controller'),
    template: `<editmeal mealid="$ctrl.param('mealId')"></editmeal>`,
    path: '/products/meals/:mealId/edit',
    title: 'Edit Meal'
  },
  addMeal: {
    module: require('./components/meals/add/controller'),
    template: `<addmeal></addmeal>`,
    path: '/products/meals/add',
    title: 'Add Meal'
  },

  sides: {
    module: require('./components/sides/list/controller'),
    template: `<sides></sides>`,
    path: '/products/sides',
    title: 'Sides'
  },
  editSide: {
    module: require('./components/sides/edit/controller'),
    template: `<editside sideid="$ctrl.param('sideId')"></editside>`,
    path: '/products/sides/:sideId/edit',
    title: 'Edit Side'
  },
  addSide: {
    module: require('./components/sides/add/controller'),
    template: `<addside></addside>`,
    path: '/products/sides/add',
    title: 'Add Side'
  },

  ingredients: {
    module: require('./components/ingredients/list/controller'),
    template: `<ingredients></ingredients>`,
    path: '/products/ingredients',
    title: 'Ingredients'
  },
  editIngredient: {
    module: require('./components/ingredients/edit/controller'),
    template: `<editingredient ingredientid="$ctrl.param('ingredientId')"></editingredient>`,
    path: '/products/ingredients/:ingredientId/edit',
    title: 'Edit Ingredient'
  },
  addIngredient: {
    module: require('./components/ingredients/add/controller'),
    template: `<addingredient></addingredient>`,
    path: '/products/ingredients/add',
    title: 'Add Ingredient'
  },

  mealPlans: {
    module: require('./components/meal-plans/list/controller'),
    template: `<mealplans></mealplans>`,
    path: '/products/meal-plans',
    title: 'Meal Plans'
  },
  editMealPlan: {
    module: require('./components/meal-plans/edit/controller'),
    template: `<editmealplan mealplanid="$ctrl.param('mealPlanId')"></editmealplan>`,
    path: '/products/meal-plans/:mealPlanId/edit',
    title: 'Edit Meal Plan'
  },
  addMealPlan: {
    module: require('./components/meal-plans/add/controller'),
    template: `<addmealplan></addmealplan>`,
    path: '/products/meal-plans/add',
    title: 'Add Meal Plan'
  },

  portions: {
    module: require('./components/portions/list/controller'),
    template: `<portions></portions>`,
    path: '/products/portions',
    title: 'Portions'
  },
  editPortion: {
    module: require('./components/portions/edit/controller'),
    template: `<editportion portion-id="$ctrl.param('portionId')"></editportion>`,
    path: '/products/portions/:portionId/edit',
    title: 'Edit Portion'
  },
  addPortion: {
    module: require('./components/portions/add/controller'),
    template: `<addportion></addportion>`,
    path: '/products/portions/add',
    title: 'Add Portion'
  },

  bundleTypes: {
    module: require('./components/bundle-types/list/controller'),
    template: `<bundletypes></bundletypes>`,
    path: '/products/bundle-types',
    title: 'Bundle Types'
  },
  editBundleType: {
    module: require('./components/bundle-types/edit/controller'),
    template: `<editbundletype bundle-type-id="$ctrl.param('bundleTypeId')"></editbundletype>`,
    path: '/products/bundle-types/:bundleTypeId/edit',
    title: 'Edit Bundle Type'
  },
  addBundleType: {
    module: require('./components/bundle-types/add/controller'),
    template: `<addbundletype></addbundletype>`,
    path: '/products/bundle-types/add',
    title: 'Add Bundle Type'
  },

  addOns: {
    module: require('./components/add-ons/list/controller'),
    template: `<addons></addons>`,
    path: '/products/add-ons',
    title: 'Add-ons'
  },
  editAddOn: {
    module: require('./components/add-ons/edit/controller'),
    template: `<editaddon add-on-id="$ctrl.param('addOnId')"></editaddon>`,
    path: '/products/add-ons/:addOnId/edit',
    title: 'Edit Add-on'
  },
  addAddOn: {
    module: require('./components/add-ons/add/controller'),
    template: `<addaddon></addaddon>`,
    path: '/products/add-ons/add',
    title: 'Add Add-on'
  },

  partners: {
    module: require('./components/partners/list/controller'),
    template: `<partners></partners>`,
    path: '/partners',
    title: 'Partners'
  },
  editPartner: {
    module: require('./components/partners/edit/controller'),
    template: `<editpartner partner-id="$ctrl.param('partnerId')"></editpartner>`,
    path: '/partners/:partnerId/edit',
    title: 'Edit Partner'
  },
  addPartner: {
    module: require('./components/partners/add/controller'),
    template: `<addpartner></addpartner>`,
    path: '/partners/add',
    title: 'Add Partner'
  },

  anomalyTriggers: {
    module: require('./components/anomaly-triggers/list/controller'),
    template: `<anomalytriggers></anomalytriggers>`,
    path: '/inventory/anomaly-triggers',
    title: 'Anomaly Triggers'
  },

  users: {
    module: require('./components/users/list/controller'), 
    template: `<users></users>`,
    path: '/users',
    title: 'Users'
  },
  user: {
    module: require('./components/users/view/controller'),
    template: `<user user-id="$ctrl.param('userId')"></user>`,
    path: '/users/:userId',
    title: 'User'
  },
  // addMeal: {
  //   module: require('./components/meals/add/controller'),
  //   template: `<addmeal></addmeal>`,
  //   path: '/products/meals/add',
  //   title: 'Add Meal'
  // },

};
