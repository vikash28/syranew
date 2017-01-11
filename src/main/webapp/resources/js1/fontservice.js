
angular.module('frontendServices', [])
    .service('ConnectionService', ['$http', '$q', function($http, $q) {
        return {
            searchConnections: function(folderId) {
                var deferred = $q.defer();

                $http.get('/Syra/connection/',{
                    params: {   "folderId": folderId
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        //alert(response.data);
                    	deferred.resolve(response.data);
                    }
                    else {
                    	//alert('con search');
                    	deferred.reject('Error retrieving list of connections');
                    }
                });

                return deferred.promise;
            },

            deleteConnections: function(deletedConnectionIds) {
                var deferred = $q.defer();

                $http({
                    method: 'DELETE',
                    url: '/Syra/connection',
                    data: deletedConnectionIds,
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve();
                    }
                    else {
                    //	alert('con del');
                        deferred.reject('Error deleting connections');
                    }
                });

                return deferred.promise;
            },

            saveConnections: function(dirtyConnections) {
                var deferred = $q.defer();
             
                $http({
                    method: 'POST',
                    url: '/Syra/connection/',
                    data: dirtyConnections,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "text/plain, application/json"
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve(response.data);
                    }
                    else {
                    	alert('con save');
                    	deferred.reject("Error saving connections: " + response.data);
                    }
                });

                return deferred.promise;
            }
        }
    }])
	.service('FolderService', ['$http', '$q', function($http, $q) {
        return {
            searchFolders: function() {
                var deferred = $q.defer();

                $http.get('/Syra/folder/',{
                    params: {
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve(response.data);
                    }
                    else {
                        deferred.reject('Error retrieving list of folders');
                    }
                });

                return deferred.promise;
            },

            deleteFolders: function(deletedFolderIds) {
                var deferred = $q.defer();

                $http({
                    method: 'DELETE',
                    url: '/Syra/folder',
                    data: deletedFolderIds,
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve();
                    }
                    else {
                        deferred.reject('Error deleting folders');
                    }
                });

                return deferred.promise;
            },

            saveFolders: function(dirtyFolders) {
                var deferred = $q.defer();

                $http({
                    method: 'POST',
                    url: '/Syra/folder',
                    data: dirtyFolders,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "text/plain, application/json"
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve(response.data);
                    }
                    else {
						deferred.reject("Error saving folders: " + response.data);
                    }
                });

                return deferred.promise;
            }
        }
    }])
    .service('MappingService', ['$http', '$q', function($http, $q) {
        return {
            searchMappings: function() {
                var deferred = $q.defer();

                $http.get('/Syra/mapping/',{
                    params: { 
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve(response.data);
                    }
                    else {
                       //alert('map search');
                       deferred.reject('Error retrieving list of mappings');
                    }
                });

                return deferred.promise;
            },

            deleteMappings: function(deletedMappingIds) {
                var deferred = $q.defer();

                $http({
                    method: 'DELETE',
                    url: '/mapping',
                    data: deletedMappingIds,
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve();
                    }
                    else {
                    //	alert('map del');
                    	deferred.reject('Error deleting mappings');
                    }
                });

                return deferred.promise;
            },

            saveMappings: function(dirtyMappings) {
                var deferred = $q.defer();

                $http({
                    method: 'POST',
                    url: '/mapping',
                    data: dirtyMappings,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "text/plain, application/json"
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve(response.data);
                    }
                    else {
                    	//alert('map save');
                    	deferred.reject("Error saving mappings: " + response.data);
                    }
                });

                return deferred.promise;
            }
        }
    }])

    .service('ScheduleService', ['$http', '$q', function($http, $q) {
        return {
            searchSchedules: function(jobName) {
                var deferred = $q.defer();

                $http({
                    method: 'GET',
                    url: '/schedule/',
                    params: {"jobName": jobName}
                })				
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve(response.data);
                    }
                    else {
                        deferred.reject('Error retrieving list of schedules');
                    }
                });

                return deferred.promise;
            },            
			pauseSchedule: function(triggerName) {
                var deferred = $q.defer();

                $http({
                    method: 'GET',
                    url: '/schedule/pause',
                    params: {"triggerName": triggerName}
                })				
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve(response.data);
                    }
                    else {
                        deferred.reject('Error retrieving list of schedules');
                    }
                });

                return deferred.promise;
            },
			resumeSchedule: function(triggerName) {
                var deferred = $q.defer();

                $http({
                    method: 'GET',
                    url: '/schedule/resume',
                    params: {"triggerName": triggerName}
                })				
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve(response.data);
                    }
                    else {
                        deferred.reject('Error retrieving list of schedules');
                    }
                });

                return deferred.promise;
            },
            deleteSchedule: function(triggerName) {
                var deferred = $q.defer();

                $http({
                    method: 'DELETE',
                    url: '/schedule',
                    data: triggerName,
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve();
                    }
                    else {
                        deferred.reject('Error deleting schedules');
                    }
                });

                return deferred.promise;
            },

            saveSchedules: function(dirtySchedules) {
                var deferred = $q.defer();

                $http({
                    method: 'POST',
                    url: '/schedule',
                    data: dirtySchedules,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "text/plain, application/json"
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve(response.data);
                    }
                    else {
						deferred.reject("Error saving schedules: " + response.data);
                    }
                });

                return deferred.promise;
            }
        }
    }])	
    .service('UserService', ['$http','$q', function($http, $q) {
        return {
            getUserInfo: function() {
                var deferred = $q.defer();

                $http.get('/Syra/user')
                    .then(function (response) {
                        if (response.status == 200) {
                            deferred.resolve(response.data);
                        }
                        else {
                           deferred.reject('Error retrieving user info');
                        }
                });

                return deferred.promise;
            },
            getUserLog: function(UserId) {
                var deferred = $q.defer();

                $http({
                    method: 'GET',
                    url: '/Syra/user/userlog',
                    params: {"UserId": UserId}
                }).then(function (response) {
                        if (response.status == 200) {
                            deferred.resolve(response.data);
                        }
                        else {
                           deferred.reject('Error retrieving user info2');
                        }
                });

                return deferred.promise;
            },
            logout: function () {
                $http({
                    method: 'POST',
                    url: '/Syra/logout'
                })
                .then(function (response) {
                    if (response.status == 200) {
                    window.location.reload();
                    }
                    else {
                        console.log("Logout failed!");
                    }
                });
            },
            fileupload: function(file) {
                var deferred = $q.defer();
 
                $http({
                    method: 'POST',
                    url: 'http://localhost/bootstrap-chat-example/test.php',
                    data: file,
                    headers: {
                        //"Access-Control-Allow-Origin":"*",
                       // "Access-Control-Allow-Methods":"POST, GET, OPTIONS, PUT, DELETE, HEAD",
                        "X_FILENAME": file.name
                    }
                }).then(function (response) {
                        if (response.status == 200) {
                            deferred.resolve(response.data);
                        }
                        else {
                           deferred.reject('Error retrieving file');
                        }
                });

                return deferred.promise;
            }         
        };
    }]);