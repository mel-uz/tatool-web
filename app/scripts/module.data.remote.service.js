'use strict';

angular.module('tatool')
  .factory('moduleDataRemoteService', ['$log', '$q', '$http', 'trialDataService', function ($log, $q, $http, trialDataService) {
    $log.debug('ModuleDataRemoteService: initialized');

    var data = {};

    data.closeModulesDB = function() {
      // we don't need to close a connection in remote mode
    };

    // initialize modules db
    data.openModulesDB = function(userName, mode, callback) {
      // we don't need to to open a connection in remote mode
      data.api = mode;

      if (callback !== null) {
        callback();
      }
    };

    // return all modules from DB
    data.getAllModules = function() {
      var deferred = $q.defer();

      $http.get('/api/' + data.api + '/modules')
        .success(function (data) {
          deferred.resolve(data);
        })
        .error(function (error) {
          deferred.reject(error.message);
        });
      
      return deferred.promise;
    };

    // return all repository modules from DB
    data.getRepositoryModules = function() {
      var deferred = $q.defer();

      $http.get('/api/' + data.api + '/repository')
        .success(function (data) {
          deferred.resolve(data);
        })
        .error(function (error) {
          deferred.reject(error.message);
        });
      
      return deferred.promise;
    };

    // get a module from db by its moduleId
    data.getModule = function(moduleId) {
      var deferred = $q.defer();

      $http.get('/api/' + data.api + '/modules/' + moduleId)
        .success(function (data) {
          if (data === 'null') {
            data = null;
          }
          deferred.resolve(data);
        })
        .error(function (error) {
          deferred.reject(error.message);
        });

      return deferred.promise;
    };

    // get a module from the repository by its moduleId
    data.getRepositoryModule = function(moduleId) {
      var deferred = $q.defer();

      $http.get('/api/' + data.api + '/repository/' + moduleId)
        .success(function (data) {
          if (data === 'null') {
            data = null;
          }
          deferred.resolve(data);
        })
        .error(function (error) {
          deferred.reject(error.message);
        });

      return deferred.promise;
    };

    // add new module to db
    data.addModule = function(module) {
      var deferred = $q.defer();
      var moduleJson = JSON.parse(JSON.stringify(module));

      $http.post('/api/' + data.api + '/modules/' + module.moduleId, moduleJson)
        .success(function (data) {
          if (data === 'null') {
            data = null;
          }
          deferred.resolve(data);
        })
        .error(function (error) {
          deferred.reject(error.message);
        });

      return deferred.promise;
    };

    // publish module to repository
    data.publishModule = function(module) {
      var deferred = $q.defer();
      var moduleJson = JSON.parse(JSON.stringify(module));

      $http.post('/api/' + data.api + '/modules/' + module.moduleId + '/publish', moduleJson)
        .success(function (data) {
          if (data === 'null') {
            data = null;
          }
          deferred.resolve(data);
        })
        .error(function (error) {
          deferred.reject(error.message);
        });

      return deferred.promise;
    };

    // unpublish module from repository
    data.unpublishModule = function(module) {
      var deferred = $q.defer();

      $http.get('/api/' + data.api + '/modules/' + module.moduleId + '/unpublish')
        .success(function (data) {
          if (data === 'null') {
            data = null;
          }
          deferred.resolve(data);
        })
        .error(function (error) {
          deferred.reject(error.message);
        });

      return deferred.promise;
    };

    // delete a module and all of its trials
    data.deleteModule = function(userName, moduleId) {
      var deferred = $q.defer();

      $http.delete('/api/' + data.api + '/modules/' + moduleId)
        .success(function (data) {
          if (data === 'null') {
            data = null;
          }
          trialDataService.deleteModuleTrials(userName, moduleId).then(
            function(data) {
              deferred.resolve(data);
            }, function() {
              deferred.reject('Error during removal of module trials.');
            });
        })
        .error(function (error) {
          deferred.reject(error.message);
        });

      return deferred.promise;
    };

    return data;

  }]);