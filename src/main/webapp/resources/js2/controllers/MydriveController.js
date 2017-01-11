/* Setup bucket page controller */
angular.module('MetronicApp').controller('MydriveController' , [ '$state', '$stateParams','$state','$rootScope', '$scope','$timeout','$filter','settings','ListBucket','Bucket','UserService', function( $state, $stateParams ,$state, $rootScope, $scope,$timeout,$filter,settings,ListBucket,Bucket,UserService ) {

		$scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
		$scope.bucketcontentUrl = 'grid.html';
		$scope.S3CredentialsId=$state.params.S3CredentialId;
		console.log($state.params);
		$rootScope.buildjson_S3Credentials_data;
		
		var filtered=$filter('filter')($rootScope.buildjson_S3Credentials_data, {id:$scope.S3CredentialsId});
 		$scope.accessKey=filtered[0].accessKey;
		$scope.secretKey=filtered[0].secretKey;
		//alert(angular.toJson(filtered,true));
/*		console.log($scope.accessKey);
		console.log($scope.secretKey);*/
        $scope.reload = function () {
            $scope.GetAllBucketJson='{"accesskey": "'+$scope.accessKey+'", "secretKey": "'+$scope.secretKey+'" }';
            $scope.GetAllBucketJson=JSON.parse( $scope.GetAllBucketJson)
           
            ListBucket.GetAllBucket($scope.GetAllBucketJson).then(function (data) {
            	 //alert(angular.toJson(data,true));
            	 $scope.buildjson_bucket=data;
            		},function (errorMessage) { 
    		 		});
           
      /*  $timeout(function(){
            $scope.reload();
          },5000);*/
        }
        if( $scope.accessKey !="" && $scope.secretKey !="")
        	{
        	$scope.reload();
        	}
        /* $scope.GetAllBucketJson={"accesskey":"AKIAJZJDCKYE224FBKUA","secretKey":"U+RBTBz3M6UBt1muMxfN2hlX\/bkIUs9DAZQiypiq"}
        ListBucket.GetAllBucket($scope.GetAllBucketJson).then(function (data) {
        		//alert(angular.toJson(data.owner.displayName,true));
        		$scope.buildjson_bucket=data;
		     	},function (errorMessage) { 
		 		});*/
 
        toastr.options = {
        		  "closeButton": true,
        		  "debug": false,
        		  "positionClass": "toast-bottom-right",
        		  "onclick": null,
        		  "showDuration": "1000",
        		  "hideDuration": "1000",
        		  "timeOut": "5000",
        		  "extendedTimeOut": "1000",
        		  "showEasing": "swing",
        		  "hideEasing": "linear",
        		  "showMethod": "fadeIn",
        		  "hideMethod": "fadeOut"
        		}
        $scope.menuOptions = [
                              ['Get Properties', function ($itemScope) {
                            	  	$scope.getBucketProperties($itemScope.buildjson.name);
                            	  	$( ".drop-zone-bucket"  ).removeClass( "drop" );  $( "#"+$itemScope.buildjson.name ).addClass( "drop" );  
                            	  	$( "#drop-zone" ).removeClass( "col-md-12" ).addClass( "col-md-8" ); 
                            	  	$('#details').after().find('.caption-subject.bold.uppercase').html($itemScope.buildjson.name); 
                            	  	$('#details').show(100);
                            	  	$('#detailsvalue').html('<h1>Loading....</h1>');
                            		//alert($itemScope.buildjson.key); //$scope.player.gold -= $itemScope.item.cost;
                              }],

                              ['Delete Bucket', function ($itemScope) {
                            	  $scope.deletebucket($itemScope.buildjson.name); 
                              }]
                          ]; 
        
        $scope.custommenu=function(value)
        {
        	var id=$(event.target).attr("id");
        	 
        	switch(value) {
	        case "getProperties":  $scope.getBucketProperties(id); 
	        $( ".drop-zone-bucket"  ).removeClass( "drop" );  $( "#"+id ).addClass( "drop" );      
	        $( "#drop-zone" ).removeClass( "col-md-12" ).addClass( "col-md-8" ); $('#details').after().find('.caption-subject.bold.uppercase').html(id); $('#details').show(100);$('#detailsvalue').html('<h1>Loading....</h1>');break;
	        case "getLink": alert("second"); break;
	        case "deleteBucket": $scope.deletebucket(id);  break;
        	}
        	$(".custom-menu").hide(100);
        }
        
        $scope.getBucketProperties=function(bucketName)
        {
             	
            	$scope.getBucketPropertiesJson='{"accesskey": "'+$scope.accessKey+'", "secretKey": "'+$scope.secretKey+'","bucketName": "'+bucketName+'" }'; 
            	$scope.getBucketPropertiesJson=JSON.parse( $scope.getBucketPropertiesJson); 
            	//{"accesskey":"AKIAJZJDCKYE224FBKUA","secretKey":"U+RBTBz3M6UBt1muMxfN2hlX\/bkIUs9DAZQiypiq","bucketName":bucketName}
        		Bucket.getBucketProperties($scope.getBucketPropertiesJson).then(function (data) {
        			//console.log(angular.toJson(data,true)); 
        			//$scope.bucketcontentUrl = 'bucketproperties.html';$scope.$apply();
        			$('#detailsvalue').html('<div class="general-item-list"><div class="item"><div class="item-details"><a href="#" class="item-name primary-link">Bucket:</a> <span class="item-label">'+data.bucketname+'</span></div> </div> <div class="item"><div class="item-details"><a href="#" class="item-name primary-link">Region:</a> <span class="item-label">'+data.bucketLocation+'</span></div> </div> <div class="item"><div class="item-details"><a href="" class="item-name primary-link">Owner</a> <span class="item-label">'+data.owner+'</span></div> </div>	        					<div class="item"><div class="item-details"><a href="#" class="item-name primary-link">Creation Date:</a> <span class="item-label">'+data.creationtime+'</span></div> </div></div>');
        			//$('#detailsvalue').html('<div class="general-item-list"><div class="item"><div class="item-details"><a href="#" class="item-name primary-link">Bucket:</a> <span class="item-label">'+data.bucketDetails.name+'</span></div> </div> <div class="item"><div class="item-details"><a href="#" class="item-name primary-link">Region:</a> <span class="item-label">'+data.bucketLocation+'</span></div> </div> <div class="item"><div class="item-details"><a href="" class="item-name primary-link">Owner</a> <span class="item-label">'+data.bucketDetails.owner.displayName+'</span></div> </div>	        					<div class="item"><div class="item-details"><a href="#" class="item-name primary-link">Creation Date:</a> <span class="item-label">'+data.bucketDetails.creationDate+'</span></div> </div></div>');
        			//alert(angular.toJson(data,true)); 
        			// 'Bucket:	syratesting  \nRegion:	Oregon \nCreation Date:	Wed Dec 07 13:21:03 GMT+530 2016 \nOwner:	results'
		     	},function (errorMessage) {
		     		
		 		});	
			 	 
        }
        
        
        $('#refresh').click(function(event){event.preventDefault(); 
        		$scope.reload();
        });
        
        $('#list').click(function(event){event.preventDefault(); 
        $scope.bucketcontentUrl='list.html';$scope.$apply();
        //$('.full-height-content-body').append('<div class="bootstrap-table"><div class="fixed-table-container" style="padding-bottom: 0px; z-index:2;"><table data-toggle="table" class="table"><thead><tr> <th style="text-align: center;font-weight: bold;"  ><div class="th-inner"> Bucket Name</div><div class="fht-cell"></div></th><th style="text-align: center;font-weight: bold;"  ><div class="th-inner ">Owner</div><div class="fht-cell"></div></th></tr> </thead><tbody><tr  class="thumbnailtable drop-zone-bucket"   ng-repeat="buildjson in buildjson_bucket"   on-finish-render="ngRepeatFinished" oncontextmenu="myFunction(event,this.id)" id="{{buildjson.name}}" style="cursor: pointer;" ng-click="getbucketobject(buildjson.name);"><td  style="text-align: center; word-wrap: break-word;font-size: 9px;font-weight: bold;"><i class="fa fa-bitbucket" id="thumbnailicon" ></i> {{buildjson.name}} </td><td style="text-align: center; word-wrap: break-word;font-size: 9px;font-weight: bold">  {{buildjson.owner.displayName}} </td> </tr>          </tbody>  </table></div></div>');
        //$('#products .item').removeClass('col-xs-3 col-lg-3').addClass('col-xs-12 col-lg-12');
        });
        $('#grid').click(function(event){event.preventDefault(); 
        //$('#products .item').removeClass('col-xs-12 col-lg-12').addClass('col-xs-3 col-lg-3');
        $scope.bucketcontentUrl='grid.html';$scope.$apply();
        });
        
        
        // set default layout mode
 		  
	    //$scope.buildjson_bucket=[{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471522562000},{"name":"amazon-mockupdata","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471606750000},{"name":"anjansoftans-06899-s3disk-3","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1479048404000},{"name":"attunity-bucket","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1478521976000},{"name":"aws-testing-bucket","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471600124000},{"name":"awssoftnas-storage","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1472129182000},{"name":"basebucket-55862-s3disk-0","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1479139804000},{"name":"cf-templates-2q3n4syooaxx-us-west-2","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1472588867000},{"name":"syratesting","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1481097063000},{"name":"test-bucket-aws-immersion","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1473769075000}]
        //$scope.buildjson_bucket=[{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471522562000},{"name":"amazon-mockupdata","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471606750000},{"name":"anjansoftans-06899-s3disk-3","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1479048404000},{"name":"attunity-bucket","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1478521976000},{"name":"aws-testing-bucket","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471600124000},{"name":"awssoftnas-storage","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1472129182000},{"name":"basebucket-55862-s3disk-0","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1479139804000},{"name":"cf-templates-2q3n4syooaxx-us-west-2","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1472588867000},{"name":"syratesting","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1481097063000},{"name":"test-bucket-aws-immersion","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1473769075000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000}]

        $scope.createbucket=function()
    	{
        	swal({
    			  title: 'Create Bucket',
    			  text: 'Bucket will create under Amazon S3 Server.',
    			  input: 'text',
    			  showCancelButton: true,
    			  confirmButtonText: 'Create!',
    			  confirmButtonColor: '#c14067',
     			  showLoaderOnConfirm: true,
    			  preConfirm: function(foldername) {
    				
    				  return new Promise(function(resolve, reject) {
    				  if (foldername === '') {
    				    reject("Bucket Name Feild Can't be Empty .")
    				  } 
    				  //alert( foldername.slice(-1) );
    				  else if (foldername.length  > 63 || foldername.length  < 3) {
        				    reject("Bucket Name Can't be less than 3 or greater than 63 characters long.")
        			  } 
    				  else if ( foldername.slice(-1) =="-") {
        				    reject("Bucket Name Can't be End with Dash .")
        				  } 
    				  else if (foldername.match(/\..*\./)  ) {
    					  reject("Bucket Name Can't be adjacent Dots.")
    					}   
    				  else
    				  {
    		            	 $scope.CreateBucketJson='{"accesskey": "'+$scope.accessKey+'", "secretKey": "'+$scope.secretKey+'","bucketName": "'+foldername+'" }'; 
    		            	 $scope.CreateBucketJson=JSON.parse( $scope.CreateBucketJson); 
    		            	 //$scope.CreateBucketJson={"accesskey":"AKIAJZJDCKYE224FBKUA","secretKey":"U+RBTBz3M6UBt1muMxfN2hlX\/bkIUs9DAZQiypiq","bucketName":foldername}
    	    				 $scope.$apply(function(){
    	    					  Bucket.CreateBucket($scope.CreateBucketJson).then(function (data) {
    	    						 	 
    	    						  if(data.status !="" && data.status==1)
    	    						  	 {   
    	    							 toastr["success"]("Bucket Create successfully", "Created Bucket");
    	    	    					 $scope.buildjson_bucket=data.allBuckets;
    	    	    					 resolve();
    	    						  	 }
    	    						  	 else
    	    						  	 {
    	    						  	 toastr["error"]("Bucket not Cretaed successfully", "Please try again");
    	     	    		     		 swal(
    	     	    						    'Error!',
    	     	    						    'Bucket not Cretaed successfully.',
    	     	    						    'error'
    	     	    						  )
    	    						  	 }
    	    						  //alert(angular.toJson(data.allBuckets,true));
    	    	    		     	},function (errorMessage) {
    	    	    		     		 toastr["error"]("Bucket not cretaed successfully", "Please try again");
    	    	    		     		//alert(angular.toJson(errorMessage,true));
    	    	    		     		swal(
    	    	    						    'Error!',
    	    	    						    'Bucket not cretaed successfully.',
    	    	    						    'error'
    	    	    						  )
    	    	    				    
    	    	    		 		});	
    	    					  
    	    			            });
    	    			            
    	    			    
    				  }
    			    })
    			     
    			  },
    			  allowOutsideClick: false,
    			}).then(function(foldername) {
    				 swal({
 	    			    type: 'success',
 	    			    title: 'Request finished!',
 	    			    html: 'Submitted Bucket Name: ' + foldername
 	    			  })
    			})
		};
		
		$scope.deletebucket=function(bucketName)
		{
			swal({
				  title: 'Are you sure?',
				  text: "Deleting <b>"+bucketName+"</b> bucket and its objects cannot be undone! <br/> Type the name of the bucket to confirm deletion:",
				  type: 'warning',
				  input: 'text',
				  showCancelButton: true,
				  confirmButtonColor: '#c14067',
 				  cancelButtonColor: '#d33',
				  confirmButtonText: 'Yes, delete it!',
				  preConfirm: function(foldername) {
	    				
    				  return new Promise(function(resolve, reject) {
    				  if (foldername === '' || foldername!=bucketName) {
    				    reject("Type the exact name of the bucket for delete..")
    				  } 
    				  else
    				  {
    					  //$scope.DeleteBucketJson={"accesskey":"AKIAJZJDCKYE224FBKUA","secretKey":"U+RBTBz3M6UBt1muMxfN2hlX\/bkIUs9DAZQiypiq","bucketName":bucketName}
 		            	  $scope.DeleteBucketJson='{"accesskey": "'+$scope.accessKey+'", "secretKey": "'+$scope.secretKey+'","bucketName": "'+bucketName+'" , "trashBucket":"testing4123"}'; 
 		            	  $scope.DeleteBucketJson=JSON.parse( $scope.DeleteBucketJson); 
 		            	  $scope.$apply(function(){
       					  Bucket.deleteBucket($scope.DeleteBucketJson).then(function (data) {
       						  	//alert(angular.toJson(data,true));
       						  	if(data.bucketname !="" && data.bucketname==bucketName && data.status== 1)
       						  	 {   toastr["success"]("Bucket Delete successfully", "Deleted Bucket");
    	   	    					 $scope.buildjson_bucket=data.allBuckets;
    	   	    					 resolve();
       						  	 }
       						  	 else
       						  	 {
       						  		 toastr["error"]("Bucket not Delete successfully", "Please try again");
        	    		     		 swal(
        	    						    'Error!',
        	    						    'Bucket not deleted successfully.',
        	    						    'error'
        	    						  )
       						  	 }
       	    		     	},function (errorMessage) {
       	    		     		 toastr["error"]("Bucket not Delete successfully", "Please try again");
       	    		     		//alert(angular.toJson(errorMessage,true));
       	    		     		swal(
       	    						    'Error!',
       	    						    'Bucket not deleted successfully.',
       	    						    'error'
       	    						  )
       	    				    
       	    		 		});	
      
     					  }) 
    				  }
  			    })
     			     
			  },
			  allowOutsideClick: false,
				}).then(function () {
  					 swal(
    						    'Deleted!',
    						    'Your Bucket Name-'+bucketName+' has been deleted.',
    						    'success'
    						    )
				 });
		}
		
		$scope.getbucketobject = function(bucketname) {
			$state.go('bucket' , { 'BucketName': bucketname });
	    };
	    AWS.config.update({
            accessKeyId : 'AKIAJ6E34VVCK6A7RTAQ',
            secretAccessKey : '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'
        });
        AWS.config.apiVersions = {
        		  s3: '2006-03-01',
        		};
	    var startUpload = function(e,bucketName) {
	    	//console.log('1'+bucketName);
	    	var files = e.dataTransfer.files;
	    	/*  toastr.options = {
	        		  "closeButton": true,
	        		  "debug": false,
	        		  "positionClass": "toast-bottom-right",
	        		  "onclick": null,
	        		  "showDuration": "0",
	        		  "hideDuration": "0",
	        		  "timeOut": "0",
	        		  "extendedTimeOut": "0",
	        		  "showEasing": "swing",
	        		  "hideEasing": "linear",
	        		  "showMethod": "fadeIn",
	        		  "hideMethod": "fadeOut"
	        		}
	    	toastr["success"]("Uploading....", "Upload");
	       	 var files = e.dataTransfer.files;
	       	 for (var i = 0, f; f = files[i]; i++) { // iterate in the files dropped
	             if (!f.type && f.size % 4096 == 0) {  console.dir("no");}
	             else {   
	            	 var bucket = new AWS.S3({params: {Bucket: 'syratesting'}});
	            	 var options = {partSize: 10 * 1024 * 1024, queueSize: 1};
	            	 var params = {Key: files[i].name, ContentType: files[i].type, Body: files[i]}; 
	            	 bucket.upload( params,options ).
	           	    on('httpUploadProgress', function(evt) {
	         	    console.log('Progress:', evt.loaded, '/', evt.total);
	         	    $('.toast-message').html("Uploaded :: " + parseInt((evt.loaded * 100) / evt.total)+'%' ) 
	           	    }).
	         	  send(function(err, data) { 
	         		 if(err)throw	$('.toast-message').html('Error'); 
	         		 else $('.toast-message').html('Done'); 
	         	  console.log(err, data) }); 
	              console.dir(files[i]); 
	              }
	         }*/
	    	
	   /* 	var form = document.getElementById('orderform');
	        //var form = $('#orderform').val();
	        var formData = new FormData(form);
	       
	   

	    $.ajax({
	    url: base_url+"shopping/place_order",
	    type: "POST",
	    data: formData,
	    dataType: 'json',
	    enctype: 'multipart/form-data',
	    processData: false,  // tell jQuery not to process the data
	    contentType: false,
	    success: function(data){
	     
	    },error: function (xhr, ajaxOptions, thrownError) {alert("ERROR:" + xhr.responseText+" - "+thrownError);}
	    */
	    
	      var formData=new FormData(files[0]);
	      var fd = new FormData();
	      fd.append('file', files[0]);
	        //formData.append("file",file.files[0]);
	    	
       	  $scope.uploadfileBucketJson='{"accesskey": "'+$scope.accessKey+'", "secretkey": "'+$scope.secretKey+'","bucketName": "'+bucketName+'" ,"key": "'+files[i].name+'","file" : "'+fd+'"}'; 
     	  $scope.uploadfileBucketJson=JSON.parse( $scope.uploadfileBucketJson); 
     	  //alert(angular.toJson($scope.uploadfileBucketJson,true));
     	  $scope.BucketObjectDetailsJson={"accesskey":"AKIAJ6E34VVCK6A7RTAQ","secretkey":"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","bucketName": bucketName,"key":files[i].name ,"file" :""}

		  Bucket.uploadfileBucket($scope.BucketObjectDetailsJson).then(function (data) {
				  	alert(angular.toJson(data,true));
     	  			},function (errorMessage) {
     	  			alert(angular.toJson(errorMessage,true));	
     	  			}); 
				  
     	console.dir(fd); 
     	console.dir(formData); 
	        }
	    
	    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
	    	//$('[data-toggle="table"]').bootstrapTable();
	    var classname =  document.querySelectorAll('.drop-zone-bucket');
        //console.log('test'+classname.length); 
        for (var i = 0; i < classname.length; i++) {
        var dropZone = classname[i];
 
        dropZone.ondrop = function(e) {
            e.preventDefault();
        	e.preventDefault();
        	$( "#overlaydiv" ).removeClass( "showdiv" ).addClass( "hidediv" );
            $scope.$apply();
            console.log(this.id);
            startUpload(e,this.id)
        }

        dropZone.ondragover = function(e) {
        	console.log('innerover'+this.id);
        	$( "#overlaydiv" ).removeClass( "hidediv" ).addClass( "showdiv" );
        	if(this.id !='drop-zone')	$( "#"+this.id ).removeClass( "drop" ); $( "#"+this.id ).addClass( "drop" );
        	$scope.$apply();
        	e.stopPropagation();
        	e.preventDefault();
            return false;
        }

        dropZone.ondragleave = function(e) {
        	e.stopPropagation();
        	e.preventDefault();
        	console.log('ineerleave'+this.className);
        	if(this.id !='drop-zone')	$( "#"+this.id ).removeClass( "drop" );
        	$scope.$apply();
        	
        	
        	return false;
        }
        }
		});
    
		var dropZone = document.getElementById('drop-zone');


	    dropZone.ondragover = function(e) {
	    	console.log('outerover'+this.id);
	    	$( "#overlaydiv" ).removeClass( "hidediv" ).addClass( "showdiv" );
	    	$scope.$apply();
	    	e.stopPropagation();
	    	e.preventDefault();
	    	return false;
	    }

   
	    var dropZone = document.getElementById('overlaydiv');
    
    
	    dropZone.ondrop = function(e) {
	
	    	$( "#overlaydiv" ).removeClass( "showdiv" ).addClass( "hidediv" );
	        $scope.$apply();
	        console.log(this.id);
	        e.preventDefault();
	        e.stopPropagation();
	        return false;
	    }
    
     
	    dropZone.ondragleave = function(e) {
	    	console.log('outerleave'+this.id);
	    	$( "#overlaydiv" ).removeClass( "showdiv" ).addClass( "hidediv" ); 
	    	$scope.$apply();
	    	e.stopPropagation();
	    	e.preventDefault();
	    	return false;
	    } 
     
	    
    
        $scope.bucketname=$state.params.BucketName;
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
}]);
