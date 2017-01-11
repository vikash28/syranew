/* Setup bucket page controller */
angular.module('MetronicApp').controller('S3CredentialsController' , ['$state', '$stateParams', '$rootScope', '$scope','$filter', 'settings','ListCredential', function( $state, $stateParams ,$rootScope, $scope,$filter,settings,ListCredential ) {
	
	$scope.$on('$viewContentLoaded', function() {   
        // initialize core components
    App.initAjax();
    $scope.accountstatus=$state.params.Account;
    
    $scope.formData = {
    		CredentialsName: '',
    		accesskey: '',
    		secretKey: '',
        };
    
    $scope.buildjson_S3Credentials=$rootScope.buildjson_S3Credentials_data;
	$rootScope.buildjson_S3Credentials_data;
	if($scope.accountstatus =='Syra')
	{
		var filtered=$filter('filter')($rootScope.buildjson_S3Credentials_data, {id: "18"})
		 $scope.formData = {
    		CredentialsName: 'Account '+filtered[0].id,
    		accesskey: filtered[0].accessKey,
    		secretKey: filtered[0].secretKey
        }; 
	}
	$('#tableCredentials').bootstrapTable({
        data: $rootScope.buildjson_S3Credentials_data
    });
//	/var filtered=$filter('filter')($rootScope.buildjson_S3Credentials_data, {id: "18"})
	//alert(angular.toJson(filtered,true));
   /* S3Credential.searchS3Credentials($scope.userId).then(function (data) {
    	$scope.buildjson_S3Credentials=data.s3Credential;
    	alert(angular.toJson($scope.buildjson_S3Credentials,true));
    	if($scope.accountstatus =='Syra')
    	{
    	var filtered=$filter('filter')($scope.buildjson_S3Credentials, {"id":1 });
    	alert(angular.toJson(filtered,true));
    	}
	},function (errorMessage) { 
		alert(errorMessage);
	}); 
    */
     $scope.S3CredentialSubmit = function() {
         if(  $scope.formData.CredentialsName !="" &&  $scope.formData.accesskey !=""  && $scope.formData.secretKey !="" );
         {
             $scope.saveS3CredentialJson=[{
     			id:null,
     			secretKey:  $scope.formData.secretKey,
     			accessKey:  $scope.formData.accesskey,
     			parentId:1
     		}];
 
             ListCredential.saveS3Credential($scope.saveS3CredentialJson).then(function (data) {
            		 //alert('1');
            		 $scope.buildjson_S3Credentials = data[0][0]; 
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