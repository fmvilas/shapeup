#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const inquirer = require('inquirer');

const program = new Command();

program.version('1.0.0');

program
  .command('init')
  .description('Configure your ShapeUp dashboard')
  .action(async () => {
    const questions = [
      { type: 'input', name: 'owner', message: 'Enter your Github username:' },
      { type: 'input', name: 'projectNumber', message: 'Enter a project number:' },
      { type: 'input', name: 'fullname', message: 'Enter Your full name:' },
      { type: 'input', name: 'email', message: 'Enter email:' },
      { type: 'input', name: 'project', message: 'Enter your project Name:' },
      { type: 'input', name: 'website', message: 'Enter your website:' },
      { type: 'password', name: 'githubToken', message: 'Enter GitHub token:' },
    ];

    const answers = await inquirer.prompt(questions);

    const config = {
      owner: answers.owner || '',
      projectNumber: parseInt(answers.projectNumber) || '',
      fullname: answers.fullname || '',
      email: answers.email || '',
      project: answers.project || '',
      website: answers.website || '',
    };

    config.tagline = `Visualize the progress of my work at <a href="${config.website}" target="_blank">${config.project}</a>. Want to propose that I work on something? <a href="https://github.com/${config.owner}/shapeup/issues/new?assignees=&labels=Pitch&template=pitch.yaml&title=" target="_blank">Time to pitch!</a>`;

    const configFilePath = 'shapeup.config.js';
    fs.writeFileSync(configFilePath, `module.exports = ${JSON.stringify(config, null, 2)};\n`);

    const envFilePath = '.env.local';
    fs.writeFileSync(envFilePath, `GITHUB_TOKEN=${answers.githubToken}\n`);

    console.log('Configuration generated successfully!');
  });


program.parse(process.argv);
