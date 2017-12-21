export function resolve(meal) {
  return {
    name: meal.name,
    primaryImage: meal.primaryImage,
    secondaryImage: meal.secondaryImage,
    mealPlan: new Mongo.ObjectID(meal.mealPlan._str),
    portion: new Mongo.ObjectID(meal.portion._str),
    sides: [
      new Mongo.ObjectID(meal.sides[0]._str),
      new Mongo.ObjectID(meal.sides[1]._str),
    ],
    price: meal.grade == 'premium' ? parseFloat(meal.price) : null,
    sku: meal.sku,
    grade: meal.grade,
    description: meal.description,
    mainIngredient: new Mongo.ObjectID(meal.mainIngredient._str),
    allergens: _.map(meal.allergens, (id) => new Mongo.ObjectID(id._str)),
    nutritionFacts: {
      calories: parseFloat(meal.nutritionFacts.calories),
      carbohydrates: parseFloat(meal.nutritionFacts.carbohydrates),
      fat: parseFloat(meal.nutritionFacts.fat),
      protein: parseFloat(meal.nutritionFacts.protein),
      fiber: parseFloat(meal.nutritionFacts.fiber),
      sodium: parseFloat(meal.nutritionFacts.sodium),
      sugar: parseFloat(meal.nutritionFacts.sugar),
    }
  };
}
