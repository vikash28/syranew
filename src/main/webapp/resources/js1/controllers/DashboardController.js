'use strict';
 
/* Setup Connections page controller */
angular.module('MetronicApp').controller('DashboardController', ['$scope', '$rootScope', '$filter', 'settings','ConnectionService' , 'FolderService' ,'UserService' ,'$timeout','$stateParams','$state' , function(   $scope, $rootScope,$filter ,settings ,ConnectionService,FolderService , UserService ,$timeout,$stateParams,$state  ) {
 	 
 	    
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
       
        $scope.connectionType = "Hive";
        $('.btn-server-type').click(function()
        		{
        	    var getconnectionType=$(this).attr('btn-radio');
        	    //alert(getconnectionType);
        	    if(getconnectionType !="")
        	    	{
        	    	$scope.connectionType = getconnectionType;
            	    $scope.$apply();
        	    	}
        	    else
        	    	{
        	    	$scope.connectionType = "Hive";
            	    $scope.$apply();
        	    	}
        });
        
        $scope.save = function () {
        		$scope.postdataconnection=[];
        		var connectionformtype=$('#connectionformtype').val();
        	
        		if(connectionformtype == "create")
        		{
         		$scope.postdataconnection.push(
	    			{
 						'id': null,
 						'connectionName': $("input[name=connectionName]").val(),
 						'connectionType':  $("input[name=connectionType]").val(),
 						'hiveThriftServer': $("input[name=hiveThriftServer]").val(),
 						'hdfsConnectionString': $("input[name=hdfsConnectionString]").val(),
 						'hdfsPath': $("input[name=hdfsPath]").val(),
 						'hdfsAccessUser': $("input[name=hdfsAccessUser]").val(),
 						'hdfsFieldDelim': $("input[name=hdfsFieldDelim]").val(),
 						'redshiftDbUrl':  $("input[name=redshiftDbUrl]").val(),
 						'redshiftUser':  $("input[name=redshiftUser]").val(),
 						'redshiftPassword': $("input[name=redshiftPassword]").val(),
 						's3AccessKey': null,
 						's3SecreteKey':  null,
 						'hdfsTempDir':  null,
 						's3FileUrl': null,
 						'folderId': $("input[name=connectionfolderid]").val(),

	    			});
        		}
        		if(connectionformtype == "edit")
        		{
        		$scope.postdataconnection.push(
    	    			{
     						'id': $("input[name=createconnectionid]").val(),
     						'connectionName':  $("input[name=connectionName]").val(),
     						'connectionType':  $("input[name=connectionType]").val(),
     						'hiveThriftServer': $("input[name=hiveThriftServer]").val(),
     						'hdfsConnectionString': $("input[name=hdfsConnectionString]").val(),
     						'hdfsPath': $("input[name=hdfsPath]").val(),
     						'hdfsAccessUser': $("input[name=hdfsAccessUser]").val(),
     						'hdfsFieldDelim': $("input[name=hdfsFieldDelim]").val(),
     						'redshiftDbUrl':  $("input[name=redshiftDbUrl]").val(),
     						'redshiftUser':  $("input[name=redshiftUser]").val(),
     						'redshiftPassword': $("input[name=redshiftPassword]").val(),
     						's3AccessKey': null,
     						's3SecreteKey':  null,
     						'hdfsTempDir':  null,
     						's3FileUrl': null,
     						'folderId': $("input[name=connectionfolderid]").val(),
     					
                     });
        		
        	}
        	//alert(angular.toJson($scope.postdataconnection,true))
        	ConnectionService.saveConnections($scope.postdataconnection).then(function () {
        		$("#jstree").jstree("close_node", "#folder_connection_"+ $("input[name=connectionfolderid]").val());
        		$('#connection_form_div').hide(); 
        		swal(
	        		    'Save!',
	        		    'Your Connection has been Saved.',
	        		    'success'
	        		  );
        		
        		
        	},
			function (errorMessage) {
				alert("er"+errorMessage);
			});
        };
        
        $scope.reset = function () {
        	$('#connection_form_div').hide(); 
	
        };
    // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
   

});

 
}]);