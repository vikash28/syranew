
angular.module('frontendServices', [])
    .service('ListBucket', ['$http', '$q', function($http, $q) {
        return {
        	GetAllBucket: function(GetAllBucketJson) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: 'http://54.187.140.159:8080/Syra/api/s3operation/bucketlists',
                    data: GetAllBucketJson,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve(response.data);
                    }
                    else {
                    	deferred.reject("Error" + response.data);
                    }
                });
                
                return deferred.promise;
            },
            GetAllServeFile: function(GetAllServeFileJson) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: 'http://54.187.140.159:8080/Syra/api/ftp/getfileslist',
                    data: GetAllBucketJson,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve(response.data);
                    }
                    else {
                    	deferred.reject("Error" + response.data);
                    }
                });
                
                return deferred.promise;
            },
           
        }
  
	}])	 
    .service('ListCredential', ['$http', '$q', function($http, $q) {
        return {
            saveS3Credential: function(saveS3CredentialJson) {
                var deferred = $q.defer();
 
                $http({
                    method: 'POST',
                    url: '/Syra/S3Credentials',
                    data: saveS3CredentialJson,
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
                    	deferred.reject("Error" + response.data);
                    }
                });
                
                return deferred.promise;
            },
            searchS3Credentials: function(userId) {
                var deferred = $q.defer();
 
                $http({
                    method: 'PUT',
                    url: '/Syra/S3Credentials',
                    params: {"userId": userId},
                    headers: {
                        "Content-Type": "text/plain",
                        "Accept": "text/plain, application/json"
                    }
                }) 
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve(response.data);
                    }
                    else {
                    	deferred.reject("Error" + response.data);
                    }
                });
                
                return deferred.promise;
            },
            saveServerCredential: function(saveServerCredentialJson) {
                    var deferred = $q.defer();
                   
                    $http({
                        method: 'POST',
                        url: '/Syra/ServerCredentials',
                        data: saveServerCredentialJson,
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
                        	deferred.reject("Error" + response.data);
                        }
                    });
                    
                    return deferred.promise;
                },
                searchServerCredentials: function(userId) {
                    var deferred = $q.defer();
     
                    $http({
                        method: 'PUT',
                        url: '/Syra/ServerCredentials',
                        params: {"userId": userId},
                        headers: {
                            "Content-Type": "text/plain",
                            "Accept": "text/plain, application/json"
                        }
                    }) 
                    .then(function (response) {
                        if (response.status == 200) {
                            deferred.resolve(response.data);
                        }
                        else {
                        	deferred.reject("Error" + response.data);
                        }
                    });
                    
                    return deferred.promise;
                },
                saveJob: function(savejobJson) {
                    var deferred = $q.defer();
                   
                    $http({
                        method: 'POST',
                        url: '/Syra/Jobs',
                        data: savejobJson,
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
                        	deferred.reject("Error" + response.data);
                        }
                    });
                    
                    return deferred.promise;
                },
                searchJob: function(userId) {
                    var deferred = $q.defer();
     
                    $http({
                        method: 'PUT',
                        url: '/Syra/Job',
                        params: {"userId": userId},
                        headers: {
                            "Content-Type": "text/plain",
                            "Accept": "text/plain, application/json"
                        }
                    }) 
                    .then(function (response) {
                        if (response.status == 200) {
                            deferred.resolve(response.data);
                        }
                        else {
                        	deferred.reject("Error" + response.data);
                        }
                    });
                    
                    return deferred.promise;
                },
        }
  
	}])  
    .service('Bucket', ['$http', '$q', function($http, $q) {
        return {
        	CreateBucket: function(CreateBucketJson) {
                var deferred = $q.defer();
 
                $http({
                    method: 'POST',
                    url: 'http://54.187.140.159:8080/Syra/api/s3operation/createbucket',
                    data: CreateBucketJson,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve(response.data);
                    }
                    else {
                    	deferred.reject("Error" + response.data);
                    }
                });
                
                return deferred.promise;
            },

            deleteBucket: function(deleteBucketJson) {
                var deferred = $q.defer();

                $http({
                    method: 'DELETE',
                    url: 'http://54.187.140.159:8080/Syra/api/s3operation/deletebucket',
                    data: deleteBucketJson,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve(response.data);
                    }
                    else {
                    	deferred.reject("Error" + response.data);
                    }
                });

                return deferred.promise;
            },

            getBucketContian: function(getBucketContianJson) {
                var deferred = $q.defer();
             
                $http({
                    method: 'POST',
                    url: 'http://54.187.140.159:8080/Syra/api/s3operation/bucketcontains',
                    data: getBucketContianJson,
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
                    	deferred.reject("Error" + response.data);
                    }
                });

                return deferred.promise;
            },
            getBucketProperties: function(getBucketPropertiesJson) {
                var deferred = $q.defer();
             
                $http({
                    method: 'POST',
                    url: 'http://54.187.140.159:8080/Syra/api/s3operation/bucketdetails',
                    data: getBucketPropertiesJson,
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
                    	deferred.reject("Error" + response.data);
                    }
                });

                return deferred.promise;
            },
            uploadfileBucket: function(uploadfileBucketJson) {
                var deferred = $q.defer();
                alert(angular.toJson(uploadfileBucketJson,true));
                $http({
                    method: 'POST',
                    url: 'http://54.187.140.159:8080/Syra/api/s3operation/fileupload',
                    data: uploadfileBucketJson,
                    headers: {
                        "Content-Type": "application/json",
                       // "Accept": "text/plain, application/json"
                    }
                })
                .then(function (response) {
                	if (response.status == 200) {
                        deferred.resolve(response.data);
                    }
                    else {
                    	deferred.reject("Error" + response.data);
                    }
                });

                return deferred.promise;
            }
        }
    }])
	.service('BucketContain', ['$http', '$q', function($http, $q) {
        return {
        	CreateBucketFolder: function(CreateBucketFolderJson) {
                var deferred = $q.defer();

                $http({
                    method: 'POST',
                    url: 'http://54.187.140.159:8080/Syra/api/s3operation/createfolder',
                    data: CreateBucketFolderJson,
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
                        deferred.reject('Error'+response.data);
                    }
                });

                return deferred.promise;
            },

            DeleteBucketFolder: function(DeleteBucketFolderJson) {
                var deferred = $q.defer();

                $http({
                    method: 'DELETE',
                    url: 'http://54.187.140.159:8080/Syra/api/s3operation/deletefolder',
                    data: DeleteBucketFolderJson,
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
                    	deferred.reject('Error'+response.data);
                    }
                });

                return deferred.promise;
            },

            BucketObjectPreview: function(BucketObjectPreviewJson) {
                var deferred = $q.defer();

                $http({
                    method: 'POST',
                    url: 'http://54.187.140.159:8080/Syra/api/s3operation/filepreview',
                    data: BucketObjectPreviewJson,
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
            },
            
            BucketObjectDetails: function(BucketObjectDetailsJson) {
                var deferred = $q.defer();

                $http({
                    method: 'POST',
                    url: 'http://54.187.140.159:8080/Syra/api/s3operation/getobjectdetails',
                    data: BucketObjectDetailsJson,
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