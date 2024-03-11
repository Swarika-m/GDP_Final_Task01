require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const { put } = require('../routes/recipeRoutes');





// GET /
// Homepage

exports.homepage = async (req, res) => {

    try {

        const limitNumber = 4;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
        const Vegetarian = await Recipe.find({ 'category': 'Vegetarian' }).limit(limitNumber);
        const Drink = await Recipe.find({ 'category': 'Drink' }).limit(limitNumber);
        const NonVegetarian = await Recipe.find({ 'category': 'NonVegetarian' }).limit(limitNumber);
        const Dessert = await Recipe.find({ 'category': 'Drink' }).limit(limitNumber);
        const categoryById = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    

        const food = { categories, latest, Vegetarian, NonVegetarian, Drink, Dessert };

        res.render('index', { title: 'Recipe Blog-Home', categories, food });
    }
    catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }

}

// about page
exports.about = async(req,res) =>{
    try{
        
    res.render('about', { title: 'Recipe Blog - About'});
      
    }
    catch(error){
        res.status(500).send({ message: error.message || "Error Occured" });

    }
}

// contact page
exports.contact = async(req,res) =>{
    try{
        
    res.render('contact', { title: 'Recipe Blog - Contact'});
      
    }
    catch(error){
        res.status(500).send({ message: error.message || "Error Occured" });

    }
}

// GET /recipe
exports.exploreRecipe = async (req, res) => {
    try {
        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        res.render('recipe', { title: 'Recipe Blog - Recipe', recipe });
    }
    catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });

    }
}

// Post /search


exports.searchRecipe = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
        //  res.json(recipe);
        res.render('search', { title: 'Recipe Blog - Search', recipe });

    }
    catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });

    }

}


//GET/explore latest

exports.exploreLatest = async (req, res) => {
    try {
        const limitNumber = 20;
        const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
        res.render('explore-latest', { title: 'Recipe Blog - Explore Latest', recipe });

    }
    catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });

    }

}

// GET /categories
exports.exploreCategories = async (req, res) => {
    try {

        const limitNumber = 20;
        const categoryById = await Category.find({}).limit(limitNumber);
        
        res.render('categories', { title: 'Recipe Blog - Category', categoryById });
    }
    catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });

    }
}


// GET/categories by id

// exports.exploreCategoriesById = async (req, res) => {
//     try {
//         let categoryId = req.params.id;
//         const limitNumber = 20;
//         const recipe = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
//         // const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
//         res.render('categories', { title: 'Recipe Blog - Categories', recipe });
//     }
//     catch (error) {
//         res.status(500).send({ message: error.message || "Error Occured" });

//     }
// }



// GET/submit recipe
exports.submitRecipe = async (req, res) => {

    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');

    res.render('submit-recipe', { title: 'Recipe Blog - Submit Recipe', infoErrorsObj, infoSubmitObj });

}


// POST/submit recipe
exports.submitRecipeOnPost = async (req, res) => {
    try {

        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if (!req.files || Object.keys(req.files).length === 0) {
            console.log('No Files were uploaded.');

        } else {

            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;

            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, function (err) {
                if (err) return res.status(500).send(err);
            })
        }


        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName
        });

        await newRecipe.save();

        req.flash('infoSubmit', ' Recipe has been added.')
        res.redirect('/submit-recipe');

    }
    catch (error) {

        req.flash('infoErrors', error);
        res.redirect('/submit-recipe');

    }
}


// Render Update Recipe Form
exports.renderUpdateForm = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        res.render('update-recipe', { title: 'Recipe Blog - Update Recipe', recipe });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occurred" });
    }
}


// Handle Update Recipe Form Submission
exports.updateRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const updatedRecipe = {
            name: req.body.name,
            description: req.body.description,
            ingredients: req.body.ingredients,
            category: req.body.category
        };
        
        

        await Recipe.findByIdAndUpdate(recipeId, updatedRecipe);
        res.redirect(`/recipe/${recipeId}`);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occurred" });
    }
}

// Delete Recipe
exports.deleteRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        await Recipe.findByIdAndDelete(recipeId);
        res.redirect('/');
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occurred" });
    }
}





























//DELETE Recipes

// async function deleteRecipe(){
//         try{
    
//             await Recipe.deleteOne({name: 'Swari'});

//         }
//         catch(error){
//                console.log(error);
//         }
//     }
//     deleteRecipe();
    



// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();




//  async function insertDummyCategoryData(){

//     try{

//        await Category.insertMany([
//               {
//                 "name": "Desserts",
//                 "image": "desserts.jpg"
//               },
//               {
//                 "name": "Drinks",
//                 "image": "drinks.jpg"
//               },
//               {
//                 "name": "Non-Vegetarian Food",
//                 "image": "non-veg.jpg"
//               },
//               {
//                 "name": "Vegetarian Food",
//                 "image": "vegetarian-food.jpg"
//               }

//             ]);
//     }
//     catch(error)  {
//       console.log('err', + error)
//     }
//  }

//  insertDummyCategoryData();




// async function insertDummyRecipeData() {

//     try {

//         await Recipe.insertMany([
//             {
//                 "name": "Chocolate Cake",
//                 "category": "Dessert",
//                 "ingredients": ["250 gm all purpose flour",
//                     " 4 beaten egg",
//                     " 1 teaspoon baking powder",
//                     " 250 gm powdered sugar",
//                     " 2 tablespoon cocoa powder",
//                     "1 cup butter"
//                 ],
//                 "description": "Mix all the dry ingredients and pre-heat the oven. To prepare this easy chocolate cake recipe, pre-heat the oven to 180°C. Meanwhile, grease and line a 7-inch round cake tin with baking paper and butter. Now, sieve together the flour, cocoa powder and baking powder. Keep the dry ingredients aside. Take a glass bowl and mix butter and sugar into it. Beat these ingredients till light and fluffy. Make sure that the sugar has dissolved. Now, beat in the eggs, two at a time and allowing at least two minutes gap between each addition. Lightly fold in the flour into the mixture. Pour the batter into the prepared tin and bake for 35 to 40 minutes. Pour the batter into the prepared tin and bake for 35 to 40 minutes. Check if the cake is baked properly by inserting a toothpick into the centre. If it comes out clean, then the cake is done. Transfer the cake onto a wire rack and allow it to cool completely. Cover with your favourite toppings. Then slice and serve.",
//                 "image": "chocolate-cake.jpg"
//             },

//             {
//                 "name": "Gujarati Kadhi",

//                 "category": "Vegetarian",

//                 "ingredients": [
//                     "1 cup yoghurt ",
//                     "sendha namak as required",
//                     "1/2 teaspoon mustard seeds",
//                     " 2 Pinches asafoetida",
//                     "2 teaspoon sugar",
//                     "4 tablespoon water chestnut flour",
//                     "2 teaspoon ghee",
//                     "1/2 teaspoon cumin seeds",
//                     "2 red chilli",
//                     "12 curry leaves",
//                     "1 handful chopped coriander leaves"],

//                 "description": "Mix flour with curd and make a light batter. Cook this batter on low flame. Take a deep bottomed pan and heat on a moderate flame. Pour this batter in it and keep stirring. Gradually, add the curry leaves, sugar, salt and bring it to a boil. Keep the flame to low or the yoghurt mixture will curdle. Gradually, add the curry leaves, sugar, salt and bring it to a boil. Take another pan for tempering the kadhi. Heat the pan on medium heat and melt ghee in it. Once the ghee is hot enough add cumin seeds, mustard seeds, asafoetida and red chillies Keep the flame to low or the yoghurt mixture will curdle. Temper the spices in ghee. Add tempering to the kadhi and cook for another 15 minutes. If you want to make this dish a bit spicier, you can add some red chilli powder to the kadhi. However, Gujarati food is usually mildly spicy. You can also add a pinch of sugar if you want to make it slightly sweet. Garnish with coriander leaves and serve hot.",

//                 "image": "gujKadhi.jpg"

//             },

//             {
//                 "name": "Chicken Masala Fry",
//                 "category": "NonVegetarian",
//                 "ingredients": [
//                     "500 gm chopped chicken",
//                     "1/2 tablespoon garlic paste",
//                     "1/2 tablespoon ginger paste",
//                     " 1/2 tablespoon garam masala powder",
//                     "1 stalk curry leaves",
//                     "4 tablespoon vegetable oil",
//                     "1 large grated onion",
//                     "1 chopped green chilli",
//                     "1 tablespoon red chilli powder",
//                     "1 tablespoon coriander powder",
//                     "salt as required",
//                     "2 dry red chili"],
//                 "description": "Fry onions and chilies.Heat oil in a pan and then add dry red chilli, green chillies, curry leaves and onions to it. Fry them until they turn golden in colour. Next, add ginger and garlic paste and fry till the mixture gets golden-brown in colour. Add the chicken pieces. Now, add the chicken pieces to the mixture and fry the chicken till it loses all the moisture. Cook the masala. Now, add coriander powder, red chilli powder, garam masala, and salt to the pan. Sprinkle 4 tbsps of water. Cook it for about 15 mins. Your Chicken Masala Fry is ready. ",

//                 "image": "chicken.jpg"


//             },
//             {
//                 "name": "Coconut Pineapple Drink",
//                 "category": "Drink",
//                 "ingredients": [
//                     "2 cup coconut water",
//                     "1/2 cup pineapple",
//                     "2 pinches salt",
//                     "1/2 cup coconut",
//                     "1 tablespoon sugar"
//                 ],
//                 "description": "Combine all the ingredients in a mixer and blend till coarse. Allow to rest for a while and then pour in a pub glass. Garnish with ice cubes and pineapple slice and serve.",
//                 "image": "coco-pine.jpg"


//             }


//         ]);
//     }


//     catch (error) {
//         console.log('err', + error)
//     }

// }

// insertDummyRecipeData();



// {
//     "name": "",
//         "category": "",
//             "ingredients": [],
//                 "description": "",
//                     "image": ""


// }


