/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import Recipe from '../api/recipe/recipe.model';
import Ingredient from '../api/ingredient/ingredient.model';

Thing.find({}).removeAsync()
  .then(() => {
    Thing.create({
      name: 'Development Tools',
      info: 'Integration with popular tools such as Bower, Grunt, Babel, Karma, ' +
             'Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, ' +
             'Stylus, Sass, and Less.'
    }, {
      name: 'Server and Client integration',
      info: 'Built with a powerful and fun stack: MongoDB, Express, ' +
             'AngularJS, and Node.'
    }, {
      name: 'Smart Build System',
      info: 'Build system ignores `spec` files, allowing you to keep ' +
             'tests alongside code. Automatic injection of scripts and ' +
             'styles into your index.html'
    }, {
      name: 'Modular Structure',
      info: 'Best practice client and server structures allow for more ' +
             'code reusability and maximum scalability'
    }, {
      name: 'Optimized Build',
      info: 'Build process packs up your templates as a single JavaScript ' +
             'payload, minifies your scripts/css/images, and rewrites asset ' +
             'names for caching.'
    }, {
      name: 'Deployment Ready',
      info: 'Easily deploy your app to Heroku or Openshift with the heroku ' +
             'and openshift subgenerators'
    });
  });

/*
Ingredient.find({}).removeAsync()
  .then(() => {
    Ingredient.create({
      name: 'Sachet de fondue',
      archive: ''
    }, {
      name: 'Vin blanc',
      archive: ''
    }, {
      name: 'Raclette',
      archive: ''
    });
  });


Recipe.find({}).removeAsync()
  .then(() => {
    Recipe.create({
      name: 'Fondue savoyarde',
      rating: 4,
      imagePath: '',
      description: 'Une bonne fondue toute faite, tout simplement !', 
      accepted: '',
      archive: '',
      ingredients : [],
      creationDate: '',
      boughtDate: ''
    });
  });

*/