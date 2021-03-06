'use strict';

const _ = require('lodash');
const NodeApplication = require('../node-application');
const Node6Application = require('../node-application/node6');
const Node8Application = require('../node-application/node8');
const Node9Application = require('../node-application/node9');
const Node10Application = require('../node-application/node10');
const path = require('path');
const helpers = require('blacksmith/test/helpers');
const chai = require('chai');
const chaiFs = require('chai-fs');
const expect = chai.expect;
chai.use(chaiFs);

describe('Node Application', function() {
  this.timeout(5000);
  before('prepare environment', () => {
    helpers.cleanTestEnv();
  });
  afterEach('clean environment', () => {
    helpers.cleanTestEnv();
  });
  it('should return its buildDependencies', () => {
    const nodeApplication = new NodeApplication();
    expect(_.map(_.filter(nodeApplication.buildDependencies,
      bd => !bd.version || bd.version === '9'), bd => bd.id)).to.be.eql([
        'node', 'imagemagick', 'ghostscript', 'libc6', 'default-libmysqlclient-dev',
      ]
    );
  });
  it('builds a sample node application', () => {
    const log = {};
    const test = helpers.createTestEnv();
    const component = helpers.createComponent(test);
    helpers.createDummyExecutable(path.join(test.prefix, 'node/bin/npm'));
    const nodeApplication = new NodeApplication({
      version: component.version,
      id: component.id,
      licenses: [{
        type: component.licenseType,
        licenseRelativePath: component.licenseRelativePath,
        main: true
      }]
    }, {logger: helpers.getDummyLogger(log)});
    nodeApplication.id = component.id;
    nodeApplication.sourceTarball = component.sourceTarball;
    nodeApplication.additionalModules = () => ['test'];

    // Build process
    const be = helpers.getDummyBuildEnvironment(test);
    nodeApplication.setup({be});
    nodeApplication.cleanup();
    nodeApplication.extract();
    nodeApplication.copyExtraFiles();
    nodeApplication.patch();
    nodeApplication.postExtract();
    nodeApplication.build();
    nodeApplication.postBuild();
    nodeApplication.install();
    nodeApplication.install({extraArgs: ['--test']});
    nodeApplication.fulfillLicenseRequirements();
    nodeApplication.postInstall();
    nodeApplication.minify();
    expect(log.text).to.
      contain('npm" "install" "--production" "-no-optional"');
    expect(log.text).to.contain('npm" "install" "--production" "--test"');
    expect(log.text).to.contain('npm" "install" "test" "--save"');
  });
});

describe('Node6 Application', function() {
  it('should return its buildDependencies', () => {
    const nodeApplication = new Node6Application();
    const nodeBuildDep = _.find(nodeApplication.buildDependencies, bd => bd.id === 'node');
    expect(nodeBuildDep.installCommands[0]).to.match(/bitnami-pkg install node-6\..*/);
  });
});

describe('Node8 Application', function() {
  it('should return its buildDependencies', () => {
    const nodeApplication = new Node8Application();
    const nodeBuildDep = _.find(nodeApplication.buildDependencies, bd => bd.id === 'node');
    expect(nodeBuildDep.installCommands[0]).to.match(/bitnami-pkg install node-8\..*/);
  });
});

describe('Node9 Application', function() {
  it('should return its buildDependencies', () => {
    const nodeApplication = new Node9Application();
    const nodeBuildDep = _.find(nodeApplication.buildDependencies, bd => bd.id === 'node');
    expect(nodeBuildDep.installCommands[0]).to.match(/bitnami-pkg install node-9\..*/);
  });
});

describe('Node10 Application', function() {
  it('should return its buildDependencies', () => {
    const nodeApplication = new Node10Application();
    const nodeBuildDep = _.find(nodeApplication.buildDependencies, bd => bd.id === 'node');
    expect(nodeBuildDep.installCommands[0]).to.match(/bitnami-pkg install node-10\..*/);
  });
});
