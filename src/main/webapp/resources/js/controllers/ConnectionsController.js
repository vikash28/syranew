'use strict';

/* Setup Connections page controller */
MetronicApp.controller('ConnectionsController', ['$rootScope', '$scope', 'settings', '$http' , 'ConnectionService', 'UserService', '$timeout','$stateParams',
function ($rootScope, $scope, settings, $http, ConnectionService, UserService, $timeout,$stateParams) {

	var id=$stateParams.id;
	 
	
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        Metronic.initAjax();

		Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_connections')); // set connections link active in sidebar menu
		
		// set sidebar closed and body solid layout mode
		$rootScope.settings.layout.pageAutoScrollOnLoad = 1500;
		$rootScope.settings.layout.pageSidebarClosed = true;
			
			$('#tableConnections tbody').on( 'click', '.edit', function () {
			var row = connTable.row($(this).closest("tr"));
			alert(angular.toJson(row,true));
			var connection = row.data();
			
			// Skip if it's a File upload
			if(connection.connectionType == "Local"){
				toastr["warning"]("Can not edit a uploaded file..", "Warning");
				return false;
			}
			
			$("#connId").val(connection.id).trigger("change");
			$("#myModal_newconnection .modal-title").text("Edit Connection - " + connection.connectionName);
			$("#myModal_newconnection").modal({keyboard: false});
		});

		$('#tableConnections tbody').on( 'click', '.delete', function () {
			var $tbody = $(this);
			var row = connTable.row($tbody.closest("tr"));
			
			bootbox.confirm("Are you sure you want to delete this Connection - <b>" + row.data().connectionName + "</b> ?", function(result) {
			   if(result){
					var connectionId = row.data().id;
					
					$scope.delete(connectionId);
					
					row.remove().draw();			   
			   }
			}); 
		});
			    
		function setupEditForm(connection){
			// Setup Edit form
			
			$("input[name=connectionName]").val(connection.connectionName);
			$("input[name=connectionType]").val(connection.connectionType);
			$("input[name=hiveThriftServer]").val(connection.hiveThriftServer);
			$("input[name=hdfsConnectionString]").val(connection.hdfsConnectionString);
			$("input[name=hdfsPath]").val(connection.hdfsPath);
			$("input[name=hdfsAccessUser]").val(connection.hdfsAccessUser);
			$("input[name=hdfsFieldDelim]").val(connection.hdfsFieldDelim);
			$("input[name=redshiftDbUrl]").val(connection.redshiftDbUrl);
			$("input[name=redshiftUser]").val(connection.redshiftUser);
			$("input[name=redshiftPassword]").val(connection.redshiftPassword);
			$("input[name=s3AccessKey]").val(connection.s3AccessKey);
			$("input[name=s3SecreteKey]").val(connection.s3SecreteKey);
			$("input[name=hdfsTempDir]").val(connection.hdfsTempDir);
			
			$scope.connectionType = connection.connectionType;
			
			$timeout(function() {
				// anything you want can go here and will safely be run on the next digest.
				$(".btn-server-type").scope().$apply();
			});
		}
		
		$timeout(function() {

			$scope.connectionType = "Hive";
		
			$('#connId').change(function () {
			 
				if(this.value == -1){
					$("#connectionForm")[0].reset();
					$scope.connectionType = "Hive";
					$timeout(function() {
						// anything you want can go here and will safely be run on the next digest.
						$(".btn-server-type").scope().$apply();
					});
				} else {
					 
					//modifying for detail page
					if(id){
						var row=connTable.row('#conn-' + id);
						
					}else{
						var row = connTable.row('#conn-' + this.value);
					}
					setupEditForm(row.data());			
				}
			});		
			
			$('#myModal_newconnection').on('hidden.bs.modal', function () {
				$("#connId").val("-1").trigger('change');;
			});
		if(id){
			$("#connId").val(id).trigger("change");
		}
		}, 1000);
	});
	
	$scope.vm = {
		originalConnections: [],
		connections: [],
		isSelectionEmpty: true,
		errorMessages: [],
		infoMessages: []
	};
	
	//updateUserInfo();
	loadConnectionData();

	function showErrorMessage(errorMessage) {
		clearMessages();
		$scope.vm.errorMessages.push({description: errorMessage});
		toastr["error"](errorMessage, "Error");
	}
	
	function updateUserInfo() {
		UserService.getUserInfo()
			.then(function (userInfo) {
				$scope.vm.userName = userInfo.userName;
			},
			function (errorMessage) {
				showErrorMessage(errorMessage);
			});
	}

	function markAppAsInitialized() {
		if ($scope.vm.appReady == undefined) {
			$scope.vm.appReady = true;
		}
	}

	function loadConnectionData() {
		 
		ConnectionService.searchConnections()
			.then(function (data) {
				 
				$scope.vm.errorMessages = [];

				$scope.vm.originalConnections = _.map(data.connections, function (connection) {
					return connection;
				});

				$scope.vm.connections = _.cloneDeep($scope.vm.originalConnections);

				_.each($scope.vm.connections, function (connection) {
					connection.selected = false;
				});

				if ($scope.vm.connections && $scope.vm.connections.length == 0) {
					// showInfoMessage("No results found.");
				}
			},
			function (errorMessage) {
				showErrorMessage(errorMessage);
				markAppAsInitialized();
			});
	}
	
	function clearMessages() {
		$scope.vm.errorMessages = [];
		$scope.vm.infoMessages = [];
	}

	function showInfoMessage(infoMessage, infoTitle) {
		/*$scope.vm.infoMessages = [];
		$scope.vm.infoMessages.push({description: infoMessage});
		$timeout(function () {
			$scope.vm.infoMessages = [];
		}, 1000);*/
		$("#myModal_newconnection").modal("hide");
		toastr["info"](infoMessage, infoTitle);
	}
    
	$scope.selectionChanged = function () {
		$scope.vm.isSelectionEmpty = !_.any($scope.vm.connections, function (connection) {
			return connection.selected && !connection.deleted;
		});
	};

	$scope.add = function () {
		$("#myModal_newconnection .modal-title").text("Create New Connection");
	
		// Check if already a row created
		if($scope.vm.connections.length>0 && $scope.vm.connections[0].id==null){
			return false;
		}
		$scope.vm.connections.unshift({
			id: null,
			connectionName: null,
			connectionType: null,
			hiveThriftServer: null,
			hdfsConnectionString: null,
			hdfsPath: null,
			hdfsAccessUser: null,
			hdfsFieldDelim: null,
			redshiftDbUrl: null,
			redshiftUser: null,
			redshiftPassword: null,
			s3AccessKey: null,
			s3SecreteKey: null,
			hdfsTempDir: null,
			s3FileUrl: null,
			selected: false,
			new: true
		});
	};

	$scope.delete = function (id) {
		var deletedConnectionIds = _.chain($scope.vm.connections)
			.filter(function (connection) {
				return connection.id == id;
			})
			.map(function (connection) {
				return connection.id;
			})
			.value();

		ConnectionService.deleteConnections(deletedConnectionIds)
			.then(function () {
				clearMessages();
				showInfoMessage("Connection deleted succesfully.", "Delete");

				_.remove($scope.vm.connections, function(connection) {
					return connection.selected;
				});

				$scope.selectionChanged();
				//updateUserInfo();

			},
			function () {
				clearMessages();
				$scope.vm.errorMessages.push({description: "deletion failed."});
			});
	};

	$scope.reset = function () {
		//$scope.vm.connections = $scope.vm.originalConnections;
		
		// Hitting Reset while creating a new Conn
		//console.log($('#connId').val());
		if($('#connId').val()!="-1"){
			loadConnectionData();
		}
		
		// Save - Reset Connection is done, now reset to -1 so hitting Reset button will not hit Server repeatedly
		if($('#connId').val()=="-2"){
			$('#connId').val("-1");
		}
		
		// Magic - just trigger change on hidden connId !!
		$('#connId').trigger("change");
	};

	function getNotNew(connections) {
		return  _.chain(connections)
			.filter(function (connection) {
				return !connection.new;
			})
			.value();
	}
	
	function setupNewDirtyConnection(connection){
		
		// Continue if a Connection is getting created via S3 File Upload!!
		if(connection.connectionType == "Local"){
			return;
		}
		
		connection.connectionName = $("input[name=connectionName]").val();
		connection.connectionType = $("input[name=connectionType]").val();
		connection.hiveThriftServer = $("input[name=hiveThriftServer]").val();
		connection.hdfsConnectionString = $("input[name=hdfsConnectionString]").val();
		connection.hdfsPath = $("input[name=hdfsPath]").val();
		connection.hdfsAccessUser = $("input[name=hdfsAccessUser]").val();
		connection.hdfsFieldDelim = $("input[name=hdfsFieldDelim]").val();
		connection.redshiftDbUrl = $("input[name=redshiftDbUrl]").val();
		connection.redshiftUser = $("input[name=redshiftUser]").val();
		connection.redshiftPassword = $("input[name=redshiftPassword]").val();
		connection.s3AccessKey = $("input[name=s3AccessKey]").val();
		connection.s3SecreteKey = $("input[name=s3SecreteKey]").val();
		connection.hdfsTempDir = $("input[name=hdfsTempDir]").val();	
	}

	function prepareConnectionsDto(connections) {
		return  _.chain(connections)
			.map(function (connection) {
				return {
					id: connection.id,
					connectionName: connection.connectionName,
					connectionType: connection.connectionType,
					hiveThriftServer: connection.hiveThriftServer,
					hdfsConnectionString: connection.hdfsConnectionString,
					hdfsPath: connection.hdfsPath,
					hdfsAccessUser: connection.hdfsAccessUser,
					hdfsFieldDelim: connection.hdfsFieldDelim,
					redshiftDbUrl: connection.redshiftDbUrl,
					redshiftUser: connection.redshiftUser,
					redshiftPassword: connection.redshiftPassword,
					s3AccessKey: connection.s3AccessKey,
					s3SecreteKey: connection.s3SecreteKey,
					hdfsTempDir: connection.hdfsTempDir,
					s3FileUrl: connection.s3FileUrl,
					version: connection.version
				}
			})
			.value();
	}

	$scope.save = function () {
	    var form = $("#connectionForm");
	    var error = $('.alert-danger', form);
	    var success = $('.alert-success', form);
	    
	    syraCommon.validateConnectionForm(form);

        success.hide();
        error.hide();
	    
		if(form.valid() == false){
			return false;
		}
		
		var maybeDirty = prepareConnectionsDto(getNotNew($scope.vm.connections));

		var original = prepareConnectionsDto(getNotNew($scope.vm.originalConnections));

		var connId = $("#connId").val();
		
		var dirty = [];
		
		// Check if hidden connection ID is set from the Data table
		if(connId != -1){
			dirty = _.filter(maybeDirty).filter(function (connection) {
			
				if(connection.id != connId){
					return false;
				}

				var originalConnection = _.filter(original, function (orig) {
					return orig.id === connection.id;
				});

				if (originalConnection.length == 1) {
					originalConnection = originalConnection[0];
				}
				setupNewDirtyConnection(connection);

				return originalConnection && ( originalConnection.connectionName != connection.connectionName ||
					originalConnection.connectionType != connection.connectionType || originalConnection.hiveThriftServer != connection.hiveThriftServer ||
					originalConnection.hdfsConnectionString != connection.hdfsConnectionString || originalConnection.hdfsPath != connection.hdfsPath ||
					originalConnection.hdfsAccessUser != connection.hdfsAccessUser || originalConnection.hdfsFieldDelim != connection.hdfsFieldDelim || 
					originalConnection.redshiftDbUrl != connection.redshiftDbUrl || originalConnection.redshiftUser != connection.redshiftUser  || 
					originalConnection.redshiftPassword != connection.redshiftPassword || originalConnection.s3AccessKey != connection.s3AccessKey || 
					originalConnection.s3SecreteKey != connection.s3SecreteKey || originalConnection.hdfsTempDir != connection.hdfsTempDir )
			});
		}

		var newItems = _.filter($scope.vm.connections, function (connection) {
			
			// Setup the new connection data using jQ !!
			
			if(connection.new){
				setupNewDirtyConnection(connection);
			}
			
			return connection.new;
		});

		var saveAll = prepareConnectionsDto(newItems);
		saveAll = saveAll.concat(dirty);

		$scope.vm.errorMessages = [];

		// save all new items plus the ones that where modified
		ConnectionService.saveConnections(saveAll).then(function () {
				//$scope.search();
				if(connId == -1){
					showInfoMessage("New Connection created successfully..", "New Connection");
					$('#connId').val("-2");
				} else {
					showInfoMessage("Changes saved successfully..", "Edit connection");
				}
				$scope.reset();
				if(id){
					connTable.ajax.reload(function(){
						$("#connId").val(id).trigger("change");					
					});				
				}
				else{
					connTable.ajax.reload();
				}
			},
			function (errorMessage) {
				showErrorMessage(errorMessage);
			});

	};

	$scope.FileUploadCtrl = function(FileUploader) {

		$scope.uploaderOptions  =  {
			autoUpload:  false,  
			removeAfterUpload:  false,  
			s3Upload: true, 
			s3Options: {
				accessKeyId:  'AKIAIFFPVYPMRGQIKTSA',
				secretAccessKey:  '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',
				region:  'us-east-1',
				bucket:  'syra-usa-standard',
				folder:  ''
			}
			/*s3Options: {
				accessKeyId:  'AKIAJTW6OQHWF6ZTCBTA',
				secretAccessKey:  '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',
				region:  'us-east-1',
				bucket:  'syratest',
				folder:  ''
			}*/
		};
		
	    var uploader = $scope.uploader = new FileUploader($scope.uploaderOptions);

	    // FILTERS
	    uploader.filters.push({
	        name: 'customFilter',
	        fn: function(item /*{File|FileLikeObject}*/ , options) {
	            return this.queue.length < 1;
	        }
	    });
		
		uploader.onSuccessItem = function(fileItem, response, status, headers) {
	        console.info('onSuccessItem', fileItem, response, status, headers);
			$scope.add();
			$scope.vm.connections[0].connectionType = "Local";
			$scope.vm.connections[0].connectionName = fileItem.file.name;
			$scope.vm.connections[0].s3FileUrl = response.url;
			$scope.save();
			
			$("#myModal_hdfs_fileupload").modal("hide");

			toastr["info"](response.url,"File uploaded successfully to S3..");
	    };

	    uploader.onErrorItem = function(fileItem, response, status, headers) {
	        console.info('onErrorItem', fileItem, response, status, headers);
			toastr["error"](response.message.code,"File uploaded failed..");
	    };
		
	    // CALLBACKS

	    /*uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*\/ , filter, options) {
	        console.info('onWhenAddingFileFailed', item, filter, options);
	    };
	    uploader.onAfterAddingFile = function(fileItem) {
	        console.info('onAfterAddingFile', fileItem);
	    };
	    uploader.onAfterAddingAll = function(addedFileItems) {
	        console.info('onAfterAddingAll', addedFileItems);
	    };
	    uploader.onBeforeUploadItem = function(item) {
	        console.info('onBeforeUploadItem', item);
	    };
	    uploader.onProgressItem = function(fileItem, progress) {
	        console.info('onProgressItem', fileItem, progress);
	    };
	    uploader.onProgressAll = function(progress) {
	        console.info('onProgressAll', progress);
	    };
	    uploader.onSuccessItem = function(fileItem, response, status, headers) {
	        console.info('onSuccessItem', fileItem, response, status, headers);
	    };
	    uploader.onErrorItem = function(fileItem, response, status, headers) {
	        console.info('onErrorItem', fileItem, response, status, headers);
	    };
	    uploader.onCancelItem = function(fileItem, response, status, headers) {
	        console.info('onCancelItem', fileItem, response, status, headers);
	    };
	    uploader.onCompleteItem = function(fileItem, response, status, headers) {
	        console.info('onCompleteItem', fileItem, response, status, headers);
	    };
	    uploader.onCompleteAll = function() {
	        console.info('onCompleteAll');
	    };

	    console.info('uploader', uploader);*/
	};
}]);

