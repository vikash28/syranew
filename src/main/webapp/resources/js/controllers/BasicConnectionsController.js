'use strict';

/* Setup Basic Connections page controller with only Add functionality */
MetronicApp.controller('BasicConnectionsController', ['$rootScope', '$scope', 'settings', '$http' , 'ConnectionService', 'UserService', '$timeout',
function ($rootScope, $scope, settings, $http, ConnectionService, UserService, $timeout) {

    $scope.$on('$viewContentLoaded', function() {
		$scope.connectionType = "Hive";		
	});
	
	function showInfoMessage(infoMessage, infoTitle) {
		$("#myModal_newconnection").modal("hide");
		toastr["info"](infoMessage, infoTitle);
	}

	function showErrorMessage(errorMessage) {
		toastr["error"](errorMessage, "Error");
	}
	
    var form = $("#connectionForm");
    var error = $('.alert-danger', form);
    var success = $('.alert-success', form);
    
    syraCommon.validateConnectionForm(form);	
	
	$scope.reset = function () {
		$("#myModal_newconnection #connectionForm")[0].reset();
		$scope.connectionType = "Hive";
		$timeout(function() {
			$("#myModal_newconnection .btn-server-type").scope().$apply();
		});	
	};

	$scope.save = function () {
        success.hide();
        error.hide();
		
		if(form.valid() == false){
			return false;
		}
		
		var connection = {};
		
		connection.id = null;
		connection.selected = false;
		connection.new = true;
		connection.connectionName = $("#myModal_newconnection input[name=connectionName]").val();
		connection.connectionType = $("#myModal_newconnection input[name=connectionType]").val();
		connection.hiveThriftServer = $("#myModal_newconnection input[name=hiveThriftServer]").val();
		connection.hdfsConnectionString = $("#myModal_newconnection input[name=hdfsConnectionString]").val();
		connection.hdfsPath = $("#myModal_newconnection input[name=hdfsPath]").val();
		connection.hdfsAccessUser = $("#myModal_newconnection input[name=hdfsAccessUser]").val();
		connection.hdfsFieldDelim = $("#myModal_newconnection input[name=hdfsFieldDelim]").val();
		connection.redshiftDbUrl = $("#myModal_newconnection input[name=redshiftDbUrl]").val();
		connection.redshiftUser = $("#myModal_newconnection input[name=redshiftUser]").val();
		connection.redshiftPassword = $("#myModal_newconnection input[name=redshiftPassword]").val();
		connection.s3AccessKey = $("#myModal_newconnection input[name=s3AccessKey]").val();
		connection.s3SecreteKey = $("#myModal_newconnection input[name=s3SecreteKey]").val();
		connection.hdfsTempDir = $("#myModal_newconnection input[name=hdfsTempDir]").val();	
		
		var connections = [connection];
		
		ConnectionService.saveConnections(connections).then(function (response) {
			showInfoMessage("New Connection created successfully..", "New Connection");
			$scope.reset();
			
			var connId = response[0].id;
			if($(".form-wizard li.active .step").attr("href") == "#tab1"){
				connSourceTable.ajax.reload();
				
				setTimeout(function(){
					$("#sourceConnId").val(connId).trigger("change");
				},3000);
			} else {
				connTargetTable.ajax.reload();

				setTimeout(function(){
					$("#targetConnId").val(connId).trigger("change");
				},3000);
			}
		},
		function (errorMessage) {
			showErrorMessage(errorMessage);
		});

	};

}]);
