'use strict';

/* Setup blank page controller */
angular.module('MetronicApp').controller('BlankController', ['$scope', '$rootScope', '$filter', 'settings' ,'ConnectionService' , 'FolderService' ,'UserService', function($scope, $rootScope,$filter ,settings ,ConnectionService,FolderService , UserService) {

	 	 
	 
	$scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
        
        
    	 
  /*      var html = $('#jstree-proton-2').html();
        alert(html);
        var t=$('#jstree-proton-2').html('');
        alert(t);
        $('#jstree-proton-2').html(html);
        
        $('#jstree-proton-2').jstree({
    		"state" : { "key" : "demo2" },
    		'plugins': ["wholerow","contextmenu", "state", "types"],
            'core': {
                'themes': {
                    'name': 'proton',
                    'responsive': true
                },
                "check_callback" : function(operation, node, node_parent, node_position, more) {
                 	// operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
                     // in case of 'rename_node' node_position is filled with the new node name
                 	alert(operation);
                 	return true;
                 }
            }
        });*/
        
        
        
       
 
        $scope.no_of_user=0;
        $scope.no_of_folder=0;
        $scope.no_of_connection=0;
        $scope.userlogdata;
        var UserId=0;
        UserId = settings.userId;
        //$rootScope.myservice=[];
        //alert($rootScope.myservice);
         
        $scope.toDate = function(str){
        	return  $filter('date')(new Date(str), 'dd , MMMM - yyyy');
          }
        
        $scope.toTime = function(str){
        	return  $filter('date')(new Date(str), 'hh:mm a');
          }
        
    	ConnectionService.searchConnections().then(function(success) {
    		
    		var User = alasql('SELECT user \ FROM ? \ GROUP BY user',[success.connections]);
			var folder = alasql('SELECT  folder \ FROM ? \  GROUP BY folder',[success.connections]);
			$scope.no_of_user=User.length;
			$scope.no_of_folder=folder.length;
		    $scope.no_of_connection=success.connections.length;
		    
    	});
    	
    	
    
 
    	UserService.getUserLog(UserId).then(function (data) {
    		$scope.userlogdata=data.userLog;
    		// alert(angular.toJson($scope.userlogdata,true));
    	},function (errorMessage) {
    	   // alert(angular.toJson(errorMessage,true));
		});	
    	
    
    		
    	$("#jstree-proton-2").bind("open_node.jstree", function (event, data) { 
    		//$scope.userlogdata=[ "test" , "test"];
    		//$('#jstree-proton-2').jstree(true).refresh();
    		});
    	// set default layout mode 
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
}]);

