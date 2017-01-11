/* Setup bucket page controller */
angular.module('MetronicApp').controller('JobController' , ['$state', '$stateParams', '$rootScope', '$scope','$filter', 'settings','ListBucket','ListCredential', function( $state, $stateParams ,$rootScope, $scope,$filter,settings,ListBucket,ListCredential ) {
	
	$scope.$on('$viewContentLoaded', function() {   
        // initialize core components
    App.initAjax();
    
     
    $('.bs-select').selectpicker({
        iconBase: 'fa',
        tickIcon: 'fa-check'
    });
    
    $scope.sourceresult='hide';
	$scope.destinationresult='hide';
	$('select[name="source"]').html('');
	$('select[name="source"]').html('<option data-icon="icon-info" value="Select">Select Source</option>');
	$('select[name="destination"]').html('');
	$('select[name="destination"]').html('<option data-icon="icon-info" value="Select">Select Destination</option>');
	
    $.each($rootScope.buildjson_S3Credentials_data, function (index, valueobj) {
    	 $('select[name="source"]').append('<option data-icon="icon-info" value="'+valueobj.id+'">'+valueobj.s3credentialsName+'</option>').selectpicker('refresh');
    });
    
    $.each($rootScope.buildjson_ServerCredentials_data, function (index, valueobj) {
   	 $('select[name="destination"]').append('<option data-icon="icon-info" value="'+valueobj.id+'">'+valueobj.serverName+'</option>').selectpicker('refresh');
    });
  
    $scope.selectedItem2;
    var data1 = [];

    for (var i = 0; i < 2; i++) {
        var obj = {
            id: 'a'+i,
            name: ' Folder' + i,
            icon:'fa fa-folder',
            children: []
        };

        for (var j = 0; j < 3; j++) {
            var obj2 = {
                id: i+'b'+j,
                name: ' file.xml',
                icon:'fa fa-file',
                children: [],
                selected: false
            };
            obj.children.push(obj2);
        }

        data1.push(obj);
    }

    data1[1].children[0].children.push({
        id: 'c'+j,
        name: ' file.csv',
        icon:'fa fa-file',
        children: [],
        selected: false
    });
    
    var data = [];

    for (var i = 0; i < 2; i++) {
        var obj = {
            id: 'a_'+i,
            name: ' Bucket' + i,
            icon:'fa fa-bitbucket',
            children: []
        };

       for (var j = 0; j < 3; j++) {
            var obj2 = {
                id: i+'b_'+j,
                name: ' Folder',
                icon:'fa fa-folder',
                children: [],
                selected: false
            };
            obj.children.push(obj2);
        }

        data.push(obj);
    }

   /* data[1].children[0].children.push({
        id: 'c_'+j,
        name: ' Folder',
        icon:'fa fa-folder',
        children: [],
        selected: false
    });*/
    
    
    //alert(angular.toJson(data1,true));
    $scope.data = angular.copy(data1); 
    $scope.data1 = angular.copy(data); 
    //$scope.datas = angular.copy(data1);       
 
    $scope.formData = {
    		jobname:'',
    		source: '',
    		destination: '',
    		comments: '',
    };
    
    $(document).on('change', 'select[name="source"]', function(){
  	  		if(   $(this).val() !="Select" && $('select[name="destination"]').val() !="Select") 
  	  			{     
  	  				$scope.GetAllServeFileJson='{"ftphostName":"demo.wftpserver.com","ftpPort":21,"ftpUsername":"demo-user","ftppassword":"demo-user"}'; 
  	  				$scope.GetAllServeFileJson=JSON.parse( $scope.GetAllServeFileJson); 
         	 		ListBucket.GetAllServeFile($scope.GetAllServeFileJson).then(function (data) {
         	 			alert(angular.toJson(data,true));
        	 		},function (errorMessage) {
        	 			alert(errorMessage);
        	 		});
  	  				$scope.sourceresult='show';
  	  				$scope.destinationresult='show';
  	  				$scope.$apply();
  	  			}
  	});
    
    $(document).on('change', 'select[name="destination"]', function(){
	  		if(   $(this).val() !="Select" && $('select[name="destination"]').val() !="Select") 
	  			{
	  				$scope.sourceresult='show';
	  				$scope.destinationresult='show';
	  				$scope.$apply();
	  			}
	});
 
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});
}]);