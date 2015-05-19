#! /usr/local/bin/node

'use strict';

var matrix = require('../decisionmatrix.js');

// Package to support command-line interactivity.
// See: https://www.npmjs.com/package/inquirer
var inquirer = require('inquirer');

var actions = {
  insert: insert,
  listAndDelete: listAndDelete,
  exit: process.kill
};

// Start the prompts.
startPrompt();

function startPrompt() {
  inquirer.prompt([
    {
      message: 'What would you like to do?',
      name: 'action',
      type: 'list',
      choices: [ 
        {
          name: 'Add an entry',
          value: 'insert'
        },
        {
          name: 'List entries and delete',
          value: 'listAndDelete'
        },
        new inquirer.Separator(),
        {
          name: 'Exit',
          value: 'exit'
        }
      ]
    }
  ], function(answers) {
    actions[answers.action](answers);
  });
}

function insert() {
  inquirer.prompt({
    message: 'Provide a name for the entry:',
    name: 'title'
  }, function(answers) {
    if (answers.title !== '') {
      matrix.insert({
        title: answers.title
      }, function(err) { if (err) throw err; });
        console.log('"' + answers.title + '" was successfully added.\n');
        startPrompt();
    } else {
      console.log('No name given.\n');
      startPrompt();
    }
  });
}


function listAndDelete() {
  matrix.getAll(function(err, entities) {
    if (err) {
      throw err;
    }
    if(entities.length === 0) {
      console.log('There is nothing to list.\n');
      init();
      return;
    }
    inquirer.prompt({
      message: 'Select any entries you want to delete:',
      name: 'completed',
      type: 'checkbox',
      choices: entities.map(function(entity) {
        return {
          name: entity.title,
          checked: false,
          value: entity
        };
      })
    }, function(answers) {
      var deleted = 0;
      answers.completed.forEach(function(item) {
        matrix.delete(item.id, function(err) {
          if (err) {
            throw err;
          }
          if (++deleted === answers.completed.length) {
            startPrompt();
          }
        });
      });
    });
  });
}

