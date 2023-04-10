const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

const sourceRepoName = core.getInput('source-repo');
const targetRepoName = core.getInput('repo-name');
const ghToken = core.getInput('org-admin-token');
var createRepoData = JSON.stringify(
  {
    "owner": "+targetOrgName+",
    "name":"+targetRepoName+",
    "description":"Repo created from a template",
    "include_all_branches":false,
    "private":true}'
  }
);
const targetOrgName = github.context.payload.repository.owner.login;

var config = {
  method: 'post',
  url: 'https://api.github.com/repos/'+targetOrgName+'/'+sourceRepoName+'/generate',
  headers: { 
    'Accept': 'application/vnd.github.v3+json', 
    'Authorization': 'Bearer '+ghToken, 
    'Content-Type': 'application/json'
  },
  data : createRepoData
};

axios(config)
.then(function (response) {
  console.log("Repo "+targetRepoName+' created successfully!');
  core.setOutput("repo-url", "https://github.com/"+targetOrgName+"/"+targetRepoName);
})
.catch(function (error) {
  core.setOutput("repo-url", "");
  core.setFailed(error.message);
});
