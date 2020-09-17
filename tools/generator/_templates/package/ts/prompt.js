
// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
module.exports = [
  {
    type: 'select',
    name: 'category',
    message: 'Select package category',
    choices: ['services', 'libraries', 'tools', 'tests']
  },
  {
    type: 'input',
    name: 'package',
    message: "Enter package name :"
  },
]
