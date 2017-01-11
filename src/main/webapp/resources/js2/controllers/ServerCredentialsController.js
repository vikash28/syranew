/* Setup bucket page controller */
angular.module('MetronicApp').controller('ServerCredentialsController' , ['$state', '$stateParams', '$rootScope', '$scope','$filter', 'settings','ListCredential', function( $state, $stateParams ,$rootScope, $scope,$filter,settings,ListCredential ) {
	
	$scope.$on('$viewContentLoaded', function() {   
        // initialize core components
    App.initAjax();
    $scope.formData = {
    		serverName: '',
    		port: '',
    		ipaddress: '',
    		username:'',
    		password:'',
    };
    
 
    $scope.ServerCredentialSubmit = function() {
        if(  $scope.formData.serverName !="" &&  $scope.formData.port !=""  && $scope.formData.ipaddress !="" && $scope.formData.username !="" && $scope.formData.password !=""  );
        {
            $scope.saveServerCredentialJson=[{
    			id:null,
    			serverName:$scope.formData.serverName,
    			port:  8080,
    			password:$scope.formData.password,
    			username:$scope.formData.username,
    			ipaddress:$scope.formData.ipaddress,
    			parentId:1,
    		}];
            
            ListCredential.saveServerCredential($scope.saveServerCredentialJson).then(function (data) {
            	 alert(angular.toJson(data,true));
            	//$scope.buildjson_S3Credentials = data[0][0]; 
           	 },function (errorMessage) { 
        		//alert('2');
           	 }); 
            
        }
       };
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});
}]);