import { formatDate } from '../../date';
_ = lodash;

export function resolve(promotionData) {
  var promotion = _.clone(promotionData);

  if (!promotion.hasPremiumAllowance) {
    promotion.premiumAllowance = null;
  }

  if (!promotion.hasPremiumCap) {
    promotion.premiumCap = null;
  }

  if (!promotion.limitedUsage) {
    promotion.usageLimit = null;
  }
  
  if (promotion.mealPlan._str == 'all') {
    promotion.mealPlan = null;
  }
  else {
    promotion.mealPlan = new Mongo.ObjectID(promotion.mealPlan._str);
  }

  if (promotion.portion._str == 'all') {
    promotion.portion = null;
  }
  else {
    promotion.portion = new Mongo.ObjectID(promotion.portion._str);
  }

  if (promotion.bundleType._str == 'all') {
    promotion.bundleType = null;
  }
  else {
    promotion.bundleType = new Mongo.ObjectID(promotion.bundleType._str);
  }

  if (promotion.type != 'discount') {
    delete promotion.discount;
  }
  if (promotion.type != 'override') {
    delete promotion.overridePrice;
  }
  promotion.start = formatDate(promotion.start);
  promotion.end = formatDate(promotion.end);
  promotion.fulfillmentStart = formatDate(promotion.fulfillmentStart);
  promotion.fulfillmentEnd = formatDate(promotion.fulfillmentEnd);

  return promotion;
}