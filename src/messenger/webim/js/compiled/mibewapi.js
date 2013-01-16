/*
 This file is part of Mibew Messenger project.
 http://mibew.org

 Copyright (c) 2005-2011 Mibew Messenger Community
 License: http://mibew.org/license.php
*/
function MibewAPI(a){this.protocolVersion="1.0";if("object"!=typeof a||!(a instanceof MibewAPIInteraction))throw Error("Wrong interaction type");this.interaction=a}
MibewAPI.prototype.checkFunction=function(a,b){if("undefined"==typeof a["function"]||""==a["function"])throw Error("Cannot call for function with no name");if(b)for(var c=0;c<this.interaction.reservedFunctionNames.length;c++)if(a["function"]==this.interaction.reservedFunctionNames[c])throw Error("'"+a["function"]+"' is reserved function name");if("object"!=typeof a.arguments)throw Error("There are no arguments in '"+a["function"]+"' function");var d=0,f=this.interaction.getObligatoryArguments(a["function"]),
e;a:for(e in a.arguments)for(c=0;c<f.length;c++)if(e==f[c]){d++;continue a}if(d!=f.length)throw Error("Not all obligatory arguments are set in '"+a["function"]+"' function");};
MibewAPI.prototype.checkRequest=function(a){if("string"!=typeof a.token){if("undefined"==typeof a.token)throw Error("Empty token");throw Error("Wrong token type");}if(""==a.token)throw Error("Empty token");if("object"!=typeof a.functions||!(a.functions instanceof Array)||0==a.functions.length)throw Error("Empty functions set");for(var b=0;b<a.functions.length;b++)this.checkFunction(a.functions[b])};
MibewAPI.prototype.checkPackage=function(a){if("undefined"==typeof a.signature)throw Error("Missed package signature");if("undefined"==typeof a.proto)throw Error("Missed protocol version");if(a.proto!=this.protocolVersion)throw Error("Wrong protocol version");if("undefined"==typeof a.async)throw Error("'async' flag is missed");if("boolean"!=typeof a.async)throw Error("Wrong 'async' flag value");if("object"!=typeof a.requests||!(a.requests instanceof Array)||0==a.requests.length)throw Error("Empty requests set");
for(var b=0;b<a.requests.length;b++)this.checkRequest(a.requests[b])};MibewAPI.prototype.getResultFunction=function(a,b){"undefined"==typeof b&&(b=null);var c=null,d;for(d in a)if(a.hasOwnProperty(d)&&"result"==a[d]["function"]){if(null!==c)throw Error("Function 'result' already exists in functions list");c=a[d]}if(!0===b&&null===c)throw Error("There is no 'result' function in functions list");if(!1===b&&null!==c)throw Error("There is 'result' function in functions list");return c};
MibewAPI.prototype.buildResult=function(a,b){var c=this.interaction.getObligatoryArgumentsDefaults("result"),d;for(d in c)c.hasOwnProperty(d)&&(a[d]=c[d]);return{token:b,functions:[{"function":"result",arguments:a}]}};MibewAPI.prototype.encodePackage=function(a){var b={signature:""};b.proto=this.protocolVersion;b.async=!0;b.requests=a;return encodeURIComponent(JSON.stringify(b)).replace(/\%20/gi,"+")};
MibewAPI.prototype.decodePackage=function(a){a=JSON.parse(decodeURIComponent(a.replace(/\+/gi," ")));this.checkPackage(a);return a};function MibewAPIInteraction(){this.obligatoryArguments={};this.reservedFunctionNames=[]}
MibewAPIInteraction.prototype.getObligatoryArguments=function(a){var b=[];if("object"==typeof this.obligatoryArguments["*"])for(var c in this.obligatoryArguments["*"])this.obligatoryArguments["*"].hasOwnProperty(c)&&b.push(c);if("object"==typeof this.obligatoryArguments[a])for(c in this.obligatoryArguments[a])this.obligatoryArguments[a].hasOwnProperty(c)&&b.push(c);return b};
MibewAPIInteraction.prototype.getObligatoryArgumentsDefaults=function(a){var b={};if("object"==typeof this.obligatoryArguments["*"])for(var c in this.obligatoryArguments["*"])this.obligatoryArguments["*"].hasOwnProperty(c)&&(b[c]=this.obligatoryArguments["*"][c]);if("object"==typeof this.obligatoryArguments[a])for(c in this.obligatoryArguments[a])this.obligatoryArguments[a].hasOwnProperty(c)&&(b[c]=this.obligatoryArguments[a][c]);return b};
function MibewAPIExecutionContext(){this.returnValues={};this.functionsResults=[]}
MibewAPIExecutionContext.prototype.getArgumentsList=function(a){var b=a.arguments,c=a.arguments.references,d,f,e;for(e in c)if(c.hasOwnProperty(e)){f=c[e];if("undefined"==typeof this.functionsResults[f-1])throw Error("Wrong reference in '"+a["function"]+"' function. Function #"+f+" does not call yet.");if("undefined"==typeof b[e]||""==b[e])throw Error("Wrong reference in '"+a["function"]+"' function. Empty '"+e+"' argument.");d=b[e];if("undefined"==typeof this.functionsResults[f-1][d])throw Error("Wrong reference in '"+
a["function"]+"' function. There is no '"+d+"' argument in #"+f+" function results");b[e]=this.functionsResults[f-1][d]}return b};MibewAPIExecutionContext.prototype.getResults=function(){return this.returnValues};
MibewAPIExecutionContext.prototype.storeFunctionResults=function(a,b){var c,d;for(d in a.arguments["return"])if(a.arguments["return"].hasOwnProperty(d)){c=a.arguments["return"][d];if("undefined"==typeof b[d])throw Error("Variable with name '"+d+"' is undefined in the results of the '"+a["function"]+"' function");this.returnValues[c]=b[d]}this.functionsResults.push(b)};
