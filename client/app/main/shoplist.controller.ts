'use strict';

(function($stateParams, $state) {

class ShoplistController {

  constructor($http, $scope, $filter, $stateParams, $state) {
    this.$state = $state;
    this.$http = $http;
    this.$filter = $filter;
    this.shoplists = [];  
    this.selectedShoplist; 
    this.formatedShoplist = {};  

    this.getShoplists($stateParams.shoplist);   
  }

  // Retourne toutes les shoplists en cours (si le parametre existe, on recupere la shoplist sélectionnée)
  getShoplists(idSelected) {
    this.$http.get('/api/shoplists').then(response => {      
      this.shoplists = response.data;
      if(idSelected) {
        this.selectedShoplist = this.getShoplist(idSelected);
      }
    }); 
  }

  // Retourne une shoplist en particulier
  getShoplist(id) {
    for(var k in this.shoplists) {
      if(this.shoplists[k]._id == id) {
        for(var j in this.shoplists[k].recipes) {
          this.getIngredients(this.shoplists[k].recipes[j]);          
        }
        return this.shoplists[k];
      }
    }
  }

  // Ajoute la liste d'ingrédients en paramètre à la liste de courses formatée
  addIngredientsToFormattedShoplist(ingredients) {
    for(var i in ingredients) {
      var name = ingredients[i].name;
      var quantity = ingredients[i].quantity;
      if(this.formatedShoplist[name] && quantity != "0") {
        this.formatedShoplist[name].quantities.push(quantity);
      } else if (quantity != "0") {
        this.formatedShoplist[name] = {};
        this.formatedShoplist[name].quantities = [quantity];
      }
    }
  }

  // Remplit le tableau d'ingredients de la recette passée en paramétre
  getIngredients(recipe) {
    this.$http.get('/api/recipes/' + recipe._id + "/ingredients").then(response => {
      recipe.ingredients = response.data;
      this.addIngredientsToFormattedShoplist(recipe.ingredients);
    });
  } 

  // Modifie la recette passée en paramétre pour l'archiver ou non
  removeRecipeFromShoplist(aShoplist, aRecipe) {
    this.recipeDone(aRecipe);

    if (aShoplist, aRecipe) {
      this.$http.delete('/api/shoplists/' + aShoplist._id + '/recipes/' + aRecipe._id)
      .success((function(that) {
        return function(data) {
          for(var k in aShoplist.recipes) {
            if(aShoplist.recipes[k]._id == aRecipe._id) {
              aShoplist.recipes.splice(k, 1);
              that.formatedShoplist = {};  
              for(var j in that.selectedShoplist.recipes) {
                that.getIngredients(that.selectedShoplist.recipes[j]);          
              }
            }
          }
        }
      })(this));
    }
  }

  // Modifie la notation d'une recette avec la note passée en paramétre
  rateRecipe(aRecipe, rating) {
    if (aRecipe) {
      var tmpRecipe = aRecipe;
      tmpRecipe.rating = rating;
      this.$http.put('/api/recipes/' + tmpRecipe._id, {'rating':rating}).success(function(data){
        aRecipe = tmpRecipe;
      });
    }
  }

  // Modifie la date de consommation d'une recette
  recipeDone(aRecipe) {
    if (aRecipe) {
      var tmpRecipe = aRecipe;
      tmpRecipe.boughtDate = new Date();
      this.$http.put('/api/recipes/' + tmpRecipe._id, {'boughtDate':tmpRecipe.boughtDate}).success(function(data){
        aRecipe = tmpRecipe;
      });
    }
  }

  // Permet de filtrer les ingrédients qui n'ont pas une quantité à 0
  filterIngredients(ingredient) {
    if (ingredient.quantity != 0) return true;
    return false;
  }

  // Supprime définitivement une shoplist
  deleteShoplist(shoplist) {
    if(shoplist) {
      this.$http.delete('/api/shoplists/' + shoplist._id)
      .then(response => {
        var shoplistToDelete = this.shoplists.find(function(element, index, array) {return element._id == shoplist._id});
        var indexToDelete = this.shoplists.indexOf(shoplistToDelete);
        this.shoplists.splice(indexToDelete, 1);
        this.$state.go("main");
      });
    }    
  }

}

angular.module('foodHelperApp')
  .controller('ShoplistController', ShoplistController);

})();
