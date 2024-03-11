// const express = require('express');
// const router = express.Routes();
// const recipeController = require('../controllers/recipeController');
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');


//App Routes
router.get('/', recipeController.homepage);
router.get('/categories', recipeController.exploreCategories);
router.get('/recipe/:id', recipeController.exploreRecipe);
// router.get('/categories/:id', recipeController.exploreCategoriesById);
router.post('/search', recipeController.searchRecipe);


router.get('/explore-latest', recipeController.exploreLatest);

router.get('/submit-recipe', recipeController.submitRecipe);
router.post('/submit-recipe', recipeController.submitRecipeOnPost);

router.get('/about', recipeController.about);
router.get('/contact', recipeController.contact);

router.get('/recipe/:id/update', recipeController.renderUpdateForm);
router.post('/recipe/:id/update', recipeController.updateRecipe);
router.post('/recipe/:id/delete', recipeController.deleteRecipe);

module.exports = router;
