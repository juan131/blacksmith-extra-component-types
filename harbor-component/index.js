'use strict';

const nos = require('nami-utils').os;
const CompiledComponent = require('blacksmith/lib/base-components').CompiledComponent;

class HarborComponent extends CompiledComponent {
  _getVersionFromHarbor(componentToParse, componentRegex) {
    const harborMakefileURL = 'https://raw.githubusercontent.com/goharbor/harbor/master/Makefile';
    const curlOutput = nos.runProgram('curl', ['-Lk', harborMakefileURL], {retrieveStdStreams: true});
    const parsedVersion = curlOutput.stdout.match(componentRegex); 
    if (!parsedVersion || !parsedVersion[1]) {
      throw new Error(`Could not parse ${componentToParse} version from ${harborMakefileURL}`);
    }
    this.logger.info(`Parsed ${componentToParse} version ${parsedVersion[1]} from ${harborMakefileURL}`);
    return parsedVersion[1];
  }
}

module.exports = HarborComponent;
