'use strict';

(function() {

class MainController {

  constructor($http, $scope, $filter) {
    this.$http = $http;
    this.$filter = $filter;
    this.recipes = [];
    this.newRating = 0;
    this.newDate = new Date();
    this.justAdded = false;
    this.newQuantity = "";
    this.displayList = true;
    this.shoplists = [];
    this.selectedShoplist;

    this.getRecipes();
    this.getShoplists();
  }

  // Retourne toutes les recettes ainsi que les ingredients qui les composent
  getRecipes() {
    this.$http.get('/api/recipes').then(response => {
      this.recipes = response.data;
      /*for(var k in this.recipes) {
        this.getIngredients(this.recipes[k]);
      }*/
    }); 
  }

  // Retourne toutes les shoplists en cours
  getShoplists() {
    this.$http.get('/api/shoplists').then(response => {
      this.shoplists = response.data;
    }); 
  }

  // Remplit le tableau d'ingredients de la recette passée en paramétre
  getIngredients(recipe) {

    this.$http.get('/api/recipes/' + recipe._id + "/ingredients").then(response => {
      recipe.ingredients = response.data;
    });
  } 

  // Modifie la recette passée en paramétre pour l'archiver ou non
  toggleArchiveRecipe(aRecipe) {
    if (aRecipe) {
      var tmpRecipe = aRecipe;
      tmpRecipe.archive = ! tmpRecipe.archive;
      this.$http.put('/api/recipes/' + tmpRecipe._id, tmpRecipe).success(function(data){
        aRecipe = tmpRecipe;
      });
    }
  }

  // Modifie la notation d'une recette avec la note passée en paramétre
  rateRecipe(aRecipe, rating) {
    if (aRecipe) {
      var tmpRecipe = aRecipe;
      tmpRecipe.rating = rating;
      this.$http.put('/api/recipes/' + tmpRecipe._id, tmpRecipe).success(function(data){
        aRecipe = tmpRecipe;
      });
    }
  }

  // Modifie la description d'une recette avec celle passée en paramétre
  updateDescription(aRecipe, description) {
    if (aRecipe) {
      var tmpRecipe = aRecipe;
      tmpRecipe.description = description;
      this.$http.put('/api/recipes/' + tmpRecipe._id, {"description": description}).success(function(data){
        aRecipe = tmpRecipe;
      });
    }
  }

  // Accepte la recette en parametre
  updateAccepted(aRecipe) {
    if (aRecipe) {
      var tmpRecipe = aRecipe;
      this.$http.put('/api/recipes/' + tmpRecipe._id, {"accepted": tmpRecipe.accepted}).success(function(data){
        aRecipe = tmpRecipe;
      });
    }
  }

  // Ajoute une recette avec les infos du formulaire
  addRecipe() {
    if (this.name) {
      var image = "../../assets/images/noimage.png";
      /*if(this.flow.files.length > 0) {
        image = "/upload/" + this.flow.files[0].name;
        this.flow.opts.target='/upload';
        this.flow.upload();
      }*/
      this.$http.post('/api/recipes', { 
        name: this.name,
        description: this.description, 
        imagePath: image, 
        boughtDate: this.newDate, 
        creationDate: Date.now,
        rating: this.newRating 
      }).success((function(that) {
        return function(data) {
          that.getIngredients(data);
          that.recipes.push(data);
          that.justAdded = data;
        }
      })(this));
      this.name = '';
      this.description = '';
      this.flow = '';
      this.newRating = 0;      
      this.newDate = new Date();
    }
  }

  // Prépare la notation d'une nouvelle recette
  rateNewRecipe(rating) {
    this.newRating = rating;
  }

  // Permet de filtrer les ingrédients qui n'ont pas une quantité à 0
  filterIngredients(ingredient) {
    if (ingredient.quantity != 0) return true;
    return false;
  }

  // Ajoute un ingredient à une recette
  addIngredient(recipe, ingredient, quantity) {
    if(recipe && ingredient && quantity && quantity.length>0) {
      // verifier que la recipe ne contient pas deja l'ingredient, sinon on le supprime pour le modifier juste après
      var ingredientToSearch = recipe.ingredients.find(function(element, index, array) {return element.name == ingredient});
      if(ingredientToSearch && ingredientToSearch.quantity != 0) {
        recipe = this.removeIngredient(recipe, ingredientToSearch);
      }

      this.$http.post('/api/recipes/'+recipe._id+'/ingredients', {
        name: ingredient, 
        quantity: quantity
      }).then(response => {
        this.getIngredients(recipe);
      });
    }    
    this.newIngredient = "";
    this.newQuantity = "";
  }

  // Supprime un ingrédient d'une recette
  removeIngredient(recipe, ingredient) {
    if(recipe && ingredient) {
      this.$http.delete('/api/recipes/' + recipe._id + '/ingredients/' + ingredient._id)
      .then(response => {
        this.getIngredients(recipe);
      });
    }
    return recipe;
  }

  // Supprime définitivement une recette
  deleteRecipe(recipe) {
    if(recipe) {
      this.$http.delete('/api/recipes/' + recipe._id)
      .then(response => {
        var recipeToDelete = this.recipes.find(function(element, index, array) {return element._id == recipe._id});
        var indexToDelete = this.recipes.indexOf(recipeToDelete);
        this.recipes.splice(indexToDelete, 1);
      });
    }    
  }

  // Permet de sauvegarder la liste de courses et met à jour la liste des propositions en conséquence
  addShopList() {
    var nowDate = new Date();
    var formatedDate = this.$filter('date')(nowDate, "dd/MM/yyyy"); 
    if(!this.newShoplistName) {
      this.newShoplistName = "Liste du " + formatedDate;
    }
    this.$http.post('/api/shoplists/', {
      name: this.newShoplistName, 
      boughtDate: nowDate,
      archive:false
    }).then(response => {
      this.newShoplistName = "";
      var idShopList = response.data._id;
      var acceptedRecipes = this.$filter('filter')(this.recipes, {accepted:true}); 
      var acceptedIds = [];
      for(var k in acceptedRecipes) {
        acceptedIds.push(acceptedRecipes[k]._id);
      }
      this.$http.post('/api/shoplists/' + idShopList + '/recipes', {
        id: JSON.stringify(acceptedIds)
      }).then(response => {
        this.getRecipes();
        this.shoplists.push(response.data);
      });
    });  
  }
}

angular.module('foodHelperApp')
  .controller('MainController', MainController);

})();
