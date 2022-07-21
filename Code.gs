var cc = DataStudioApp.createCommunityConnector();

function getAuthType() {
  var AuthTypes = cc.AuthType;
  return cc
    .newAuthTypeResponse()
    .setAuthType(AuthTypes.NONE)
    .build();
}

function getConfig(request) {
  var config = cc.getConfig();

  config.newInfo()
    .setId('coprInstructions')
    .setText('Set up your connection to Copr');

  config.newTextInput()
    .setId('coprOwnerName')
    .setName('Enter a single user or group name')
    .setHelpText('e.g. @llvm-fedora-team')
    .setPlaceholder('@llvm-fedora-team');
/*
  config.newTextInput()
    .setId('coprProjectName')
    .setName('Enter a single project name')
    .setHelpText('e.g. llvm-snapshots')
    .setPlaceholder('llvm-snapshots');

  config.newTextInput()
    .setId('coprPackageName')
    .setName('Enter a single package to filter by or leave it blank to get all packages')
    .setHelpText('e.g. clang')
    .setPlaceholder('clang');

  config.newSelectSingle()
    .setId('coprBuildStatus')
    .setName('status')
    .setHelpText('Select a build status state to filter by or select "all"')
    .addOption("all")
    .addOption("failed")
    .addOption("succeeded")
  // TODO(kwk): Add more states as we go

  config.newInfo()
    .setId('coprExpertInstructions')
    .setText('!!!Experts only!!!');
*/

  config.newTextInput()
    .setId('coprApiUrl')
    .setName('API URL to Copr')
    .setHelpText('e.g. the offical Fedora Copr https://copr.fedorainfracloud.org/api_3/build/list/')
    .setPlaceholder('https://copr.fedorainfracloud.org/api_3/build/list/');

  config.setDateRangeRequired(true);

  return config.build();
}

function getFields(request) {
    var cc = DataStudioApp.createCommunityConnector();
    var fields = cc.getFields();
  var types = cc.FieldType;
  var aggregations = cc.AggregationType;

  fields.newDimension()
    .setId('coprSourcePackageName') // .e.g python-lit, clang, llvm, mlir, etc.
    .setDescription('The package being built')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('coprBuildId') // e.g. 4654158
    .setDescription('A number representing this build')
    .setType(types.NUMBER);

  // TODO(kwk): Incrementally add the fields below once we have the basiscs working
  /*
    fields.newDimension()
      .setId('coprSourcePackageVersion') // .e.g 15.0.0~pre20220721.gaabc4b13e8c9c1-2.fc35
      .setDescription('The version of the package being built')
      .setType(types.TEXT);
  
    fields.newDimension()
      .setId('coprBuildStartedOn') // e.g. 1658364764
      .setDescription('The timestamp when the build started')
      .setType(types.NUMBER);
  
    fields.newDimension()
      .setId('coprBuildStartedOnYYYYMMDD')
      .setName('Date when the build started')
      .setDescription('The date when the build started in year month day format.')
      .setFormula('DATE_FROM_UNIX_DATE($coprBuildStartedOn)')
      .setType(types.YEAR_MONTH_DAY);
  
    fields.newDimension()
      .setId('coprBuildEndedOn') // e.g. 1658364799
      .setDescription('The timestamp when the build ended')
      .setType(types.NUMBER);
  
    fields.newDimension()
      .setId('coprBuildEndedOnYYYYMMDD')
      .setName('Date when the build ended')
      .setDescription('The date when the build ended in year month day format.')
      .setFormula('DATE_FROM_UNIX_DATE($coprBuildEndedOn)')
      .setType(types.YEAR_MONTH_DAY);
  
    fields.newDimension()
      .setId('coprBuildState') // e.g. failed or succeeded
      .setDescription('The result of the build')
      .setType(types.NUMBER);
  
    fields.newDimension()
      .setId('coprBuildSubmittedOn') // e.g. 1658364539
      .setDescription('The timestamp when the build was submitted')
      .setType(types.NUMBER);
  
    fields.newDimension()
      .setId('coprBuildSubmittedOnYYYYMMDD')
      .setName('Date when the build was submitted')
      .setDescription('The date when the build was submitted in year month day format.')
      .setFormula('DATE_FROM_UNIX_DATE($coprBuildSubmittedOn)')
      .setType(types.YEAR_MONTH_DAY);
    
    fields.newDimension()
      .setId('coprBuildSubmitter') // e.g. kkleine
      .setDescription('The submitter who kicked of this build')
      .setType(types.TEXT);
  
    fields.newDimension()
      .setId('coprBuild') // e.g. kkleine
      .setDescription('The submitter who kicked of this build')
      .setType(types.TEXT);
    
    fields.newDimension()
      .setId('coprBuildTimeInSeconds')
      .setName('Build time in seconds')
      .setDescription('The build time of a package in seconds (coprBuildEnded-coprBuildStarted)')
      .setFormula('$coprBuildEndedOn - $coprBuildStartedOn')
      .setType(types.NUMBER)
      .setAggregation(aggregations.NONE);
  
    fields.newMetric()
      .setId('coprBuildTimeInSecondsAvg')
      .setName('Average build time in seconds')
      .setDescription('The build time of a package in seconds')
      .setFormula('AVG($coprBuildTimeInSeconds)')
      .setType(types.NUMBER)
      .setAggregation(aggregations.AUTO);
  
    fields.newMetric()
      .setId('coprBuildTimeInSecondsStddev')
      .setName('Standard deviation from the build time in seconds')
      .setDescription('The standard deviation from the build time of a package in seconds')
      .setFormula('STDDEV($coprBuildTimeInSeconds)')
      .setType(types.NUMBER)
      .setAggregation(aggregations.AUTO);
  
    fields.newMetric()
      .setId('coprBuildTimeInSecondsMin')
      .setName('Minimum build time in seconds')
      .setDescription('The minumum build time of a package in seconds')
      .setFormula('MIN($coprBuildTimeInSeconds)')
      .setType(types.NUMBER)
      .setAggregation(aggregations.AUTO);
  
    fields.newMetric()
      .setId('coprBuildTimeInSecondsMax')
      .setName('Maximum build time in seconds')
      .setDescription('The maximum build time of a package in seconds')
      .setFormula('MAX($coprBuildTimeInSeconds)')
      .setType(types.NUMBER)
      .setAggregation(aggregations.AUTO);
    
    fields.newMetric()
      .setId('coprBuildTimeInSecondsMedian')
      .setName('Median build time in seconds')
      .setDescription('The median build time of a package in seconds')
      .setFormula('MEDIAN($coprBuildTimeInSeconds)')
      .setType(types.NUMBER)
      .setAggregation(aggregations.AUTO);
    */

  return fields;
}

function getSchema(request) {
  var fields = getFields(request).build();
  return { schema: fields };
}

function responseToRows(requestedFields, response, packageName) {
  // Transform parsed data and filter for requested fields
  return response.map(function (buildInfo) {
    var row = [];
    requestedFields.asArray().forEach(function (field) {
      switch (field.getId()) {
        case 'coprBuildId':
          return row.push(buildInfo.id);
        case 'coprSourcePackageName':
          return row.push(buildInfo.source_package.name);
        default:
          return row.push('');
        // TODO(kwk): Tranlate more rows here when more fields are enabled above 
      }
    });
    return { values: row };
  });
}

function getData(request) {
  /*var requestedFields = getFields().forIds(
    request.fields.map(function (field) {
      return field.name;
    })
  );*/
  var requestedFieldIds = request.fields.map(function(field) {
    return field.name;
  });
  var requestedFields = getFields().forIds(requestedFieldIds);


  try {
    var response = fetchDataFromApi(request)
    var parsedResponse = JSON.parse(response).items;
    var rows = responseToRows(requestedFields, parsedResponse);
  } catch (e) {
    cc.newUserError()
      .setDebugText('Error fetching data from API. Exception details: ' + e)
      .setText(
        'The connector has encountered an unrecoverable error. Please try again later, or file an issue if this error persists.'
      )
      .throwException();
  }
  return {
    schema: requestedFields.build(),
    rows: rows
  };
}


/**
 * Gets response for UrlFetchApp.
 *
 * @param {Object} request Data request parameters.
 * @returns {string} Response text for UrlFetchApp.
 */
function fetchDataFromApi(request) {
  // Build the URL based on config variables
  var config = getConfig(request);
  var url = [
    config.valueOf('coprApiUrl').toString(),
    '?ownername=',
    config.valueOf('coprOwnerName'),
    '&projectname=',
    config.valueOf('coprProjectName')
  ];
  var coprPackageName = config.valueOf('coprPackageName').toString()
  if (coprPackageName != "") {
    url.push('&packagename=', coprPackageName)
  }
  var coprBuildStatus = config.valueOf('coprBuildStatus').toString()
  if (coprBuildStatus != "all") {
    url.push('&status=', coprBuildStatus)
  }

  var response = UrlFetchApp.fetch(url.join(''));
  return response;
}
