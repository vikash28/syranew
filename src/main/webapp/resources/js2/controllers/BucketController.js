/* Setup bucket page controller */
angular.module('MetronicApp').controller('BucketController' , ['$state', '$stateParams','$rootScope', '$scope', 'settings','Bucket','BucketContain', function($state , $stateParams, $rootScope, $scope,settings,Bucket,BucketContain ) {

		$scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
        console.log($state.params);
        //$(".slimScrollDiv").css("background-color", "yellow");
        $("#list").show();
        $("#grid").hide();
        
        $scope.bucketname=$state.params.BucketName;
        $scope.getBucketContianJson={"accesskey":"AKIAJZJDCKYE224FBKUA","secretKey":"U+RBTBz3M6UBt1muMxfN2hlX\/bkIUs9DAZQiypiq","bucketName":$scope.bucketname};
        $scope.bucketcontentUrl = 'grid.html';

        Bucket.getBucketContian($scope.getBucketContianJson).then(function (data) {
 
				     $scope.buildjson_bucketFolderObject=data;
				     $scope.buildjson_bucketFolder=[];
				     $scope.buildjson_bucketObject=[];
				     //alert(angular.toJson(data,true));
				     angular.forEach(data, function(value, key){
				    	  if((value.key).slice(-1) =="/")
				    		  {
				    		  $scope.buildjson_bucketFolder.push(value);
				    		  }
				    	  else {
				    		  $scope.buildjson_bucketObject.push(value);
				    	  }
				    	  //alert(angular.toJson($scope.buildjson_bucketObject,true));  				    	   
				      });
					 
		     	},function (errorMessage) {
		     		//alert(angular.toJson(errorMessage,true));
		     		swal(
						    'Error!',
						    'Bucket not cretaed successfully.',
						    'error'
						  )
				    
		 		});	
			  
	          
 
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
        $('#list').click(function(event){event.preventDefault(); 
        $scope.bucketcontentUrl='list.html';
        $("#list").hide();
        $("#grid").show();
        $scope.$apply();
        });
        $('#grid').click(function(event){event.preventDefault(); 
        $scope.bucketcontentUrl='grid.html';
        $("#list").show();
        $("#grid").hide();
        $scope.$apply();
        });
        
        //$scope.buildjson_bucket=[{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471522562000},{"name":"amazon-mockupdata","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471606750000},{"name":"anjansoftans-06899-s3disk-3","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1479048404000},{"name":"attunity-bucket","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1478521976000},{"name":"aws-testing-bucket","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471600124000},{"name":"awssoftnas-storage","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1472129182000},{"name":"basebucket-55862-s3disk-0","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1479139804000},{"name":"cf-templates-2q3n4syooaxx-us-west-2","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1472588867000},{"name":"syratesting","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1481097063000},{"name":"test-bucket-aws-immersion","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1473769075000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000}]
        //$scope.buildjson_bucket=[{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471522562000},{"name":"amazon-mockupdata","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471606750000},{"name":"anjansoftans-06899-s3disk-3","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1479048404000},{"name":"attunity-bucket","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1478521976000},{"name":"aws-testing-bucket","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471600124000},{"name":"awssoftnas-storage","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1472129182000},{"name":"basebucket-55862-s3disk-0","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1479139804000},{"name":"cf-templates-2q3n4syooaxx-us-west-2","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1472588867000},{"name":"syratesting","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1481097063000},{"name":"test-bucket-aws-immersion","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1473769075000}]
        var startUpload = function(e) {
       	 var files = e.dataTransfer.files;
       	 for (var i = 0, f; f = files[i]; i++) { // iterate in the files dropped
             if (!f.type && f.size % 4096 == 0) {  console.dir("no");}
             else {  console.dir(files[i]); }
         }
       	
        }
         
        //console.dir(files);
         $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    		var classname =  document.querySelectorAll('.drop-zone-bucket');
           
            for (var i = 0; i < classname.length; i++) {
            var dropZone = classname[i];
     
            dropZone.ondrop = function(e) {
                e.preventDefault();
            	e.preventDefault();
            	$( "#overlaydiv" ).removeClass( "showdiv" ).addClass( "hidediv" );
                $scope.$apply();
                console.log(this.id);
                startUpload(e)
            }

            dropZone.ondragover = function(e) {
            	console.log('innerover'+this.id);
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
            	if(this.id !='drop-zone')  $( "#"+this.id ).removeClass( "drop" );
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
  
    	    $scope.createfolder=function()
        	{
            	swal({
        			  title: 'Create Folder',
        			  text: 'Folder will create under Amazon S3 <br/>Bucket:'+$scope.bucketname,
        			  input: 'text',
        			  showCancelButton: true,
        			  confirmButtonText: 'Create!',
        			  confirmButtonColor: '#c14067',
        			  confirmButtonColor:'#c14067',
        			  showLoaderOnConfirm: true,
        			  preConfirm: function(foldername) {
        				
        				  return new Promise(function(resolve, reject) {
        				  if (foldername === '') {
        				    reject("Folder Name Feild Can't be Empty .")
        				  } 
        				  else
        				  {
        	    				 $scope.CreateBucketFolderJson={"accesskey":"AKIAJZJDCKYE224FBKUA","secretKey":"U+RBTBz3M6UBt1muMxfN2hlX\/bkIUs9DAZQiypiq","bucketName":$scope.bucketname,"folderName":foldername}
        	    				 $scope.$apply(function(){
        	    					 BucketContain.CreateBucketFolder($scope.CreateBucketFolderJson).then(function (data) {
        	    						 
        	    						 if(data.foldername !="" && data.foldername==foldername && data.status==1)
        	   						  	 {  toastr["success"]("Folder create successfully under Bucket:"+$scope.bucketname, "Created Folder");
        	   						  	 	$scope.buildjson_bucketFolder=[];
        	   						  	 	$scope.buildjson_bucketObject=[];
        	   						  	    $.each(data.allObjects, function (index, valueobj) {
    	   						  	 		if((valueobj.key).slice(-1) =="/")
    	   					    		  {
    	   					    		  $scope.buildjson_bucketFolder.push(valueobj);
    	   					    		  }
    	   					    	  else {
    	   					    		  $scope.buildjson_bucketObject.push(valueobj);
    	   					    	        }

    	   						  	 });
        	   						  	    resolve();
        	   						  	 }
        	   						  	 else
        	   						  	 {
        	   						  		 toastr["error"]("Folder not cretaed successfully under Bucket:"+$scope.bucketname, "Please try again");
        	    	    		     		 swal(
        	    	    						    'Error!',
        	    	    						    'Folder not cretaed successfully.',
        	    	    						    'error'
        	    	    						  )
        	   						  	 }
 
        	    	    		     	},function (errorMessage) {
        	    	    		     		 toastr["error"]("Folder not cretaed successfully under Bucket:"+$scope.bucketname, "Please try again");
        	    	    		     		//alert(angular.toJson(errorMessage,true));
        	    	    		     		swal(
        	    	    						    'Error!',
        	    	    						    'Folder not cretaed successfully.',
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
     	    			    html: 'Submitted Folder Name: ' + foldername
     	    			  })
        			})
    		};    
    		
    		 
    		$scope.deletefolder=function(folderName)
    		{
    			swal({
    				  title: 'Are you sure?',
    				  text: "Deleting <b>"+folderName+"</b> Folder cannot be undone! <br/> Type the name of the folder to confirm deletion:",
    				  type: 'warning',
    				  input: 'text',
    				  showCancelButton: true,
    				  confirmButtonColor: '#c14067',
     				  cancelButtonColor: '#d33',
    				  confirmButtonText: 'Yes, delete it!',
    				  preConfirm: function(foldername) {
    	    				
        				  return new Promise(function(resolve, reject) {
        				  if (foldername === '' || foldername!=folderName) {
        				    reject("Type the exact name of the folder for delete..")
        				  } 
        				  else
        				  {
        					  $scope.DeleteBucketFolderJson={"accesskey":"AKIAJZJDCKYE224FBKUA","secretKey":"U+RBTBz3M6UBt1muMxfN2hlX\/bkIUs9DAZQiypiq","bucketName":$scope.bucketname,"folderName":foldername}
         					  $scope.$apply(function(){
         					  BucketContain.DeleteBucketFolder($scope.DeleteBucketFolderJson).then(function (data) {
           						  	//alert(angular.toJson(data,true));
           						  	if(data.foldername !="" && data.foldername==foldername && data.status== 1)
           						  	 {   toastr["success"]("Folder Delete successfully", "Deleted Bucket");
           						  	 	 $scope.buildjson_bucketFolder=[];
           						  	 	 $scope.buildjson_bucketObject=[];
           						  	 	 $.each(data.allObjects, function (index, valueobj) {
           						  	 	//alert(angular.toJson(valueobj,true));
           						  	 		if((valueobj.key).slice(-1) =="/")
 					    		  {
 					    		  $scope.buildjson_bucketFolder.push(valueobj);
 					    		  }
 					    	  else {
 					    		  $scope.buildjson_bucketObject.push(valueobj);
 					    	        }

 						  	 });
           						  		 resolve();
           						  	 }
           						  	 else
           						  	 {
           						  		 toastr["error"]("Folder not Delete successfully", "Please try again");
            	    		     		 swal(
            	    						    'Error!',
            	    						    'Folder not deleted successfully.',
            	    						    'error'
            	    						  )
           						  	 }
           	    		     	},function (errorMessage) {
           	    		     		 toastr["error"]("Folder not Delete successfully", "Please try again");
           	    		     		//alert(angular.toJson(errorMessage,true));
           	    		     		swal(
           	    						    'Error!',
           	    						    'Folder not deleted successfully.',
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
        						    'Your Folder Name-'+folderName+' has been deleted.',
        						    'success'
        						    )
    				 });
    		}
    		$scope.ObjectPreview=function(ObjectKey)
    	        {
    				 	 
    				 	$scope.getBucketObjectPreviewJson={"accesskey":"AKIAJZJDCKYE224FBKUA","secretKey":"U+RBTBz3M6UBt1muMxfN2hlX\/bkIUs9DAZQiypiq","bucketName": $scope.bucketname,"key":ObjectKey }
    				 	BucketContain.BucketObjectPreview($scope.getBucketObjectPreviewJson).then(function (data) {
    	        			
    				 		//alert(angular.toJson(data,true));
    				 		 
    				 		var thead="<thead><tr>"
    				 		var i=1;
    				 		var headgo=true;
    				 		var tablebody="<tbody>";
     	          			angular.forEach(data, function(valueobj, key){
     	          				
     	          				if(headgo){ 
     	          					thead=thead+'<th   data-align="left">Col '+i+'</th>';
     	          				}
     	          				
     	          				tablebody=tablebody+"<tr><td>"+key+"</td>";
     	          						angular.forEach(valueobj, function(value, key1){
     	          							//alert(angular.toJson(value,true));
     	          							i++;
     	          							if(headgo){ 
     	          							thead=thead+'<th   data-align="left">Col '+i+'</th>';
     	          							
     	          							}     	          							
     	          						tablebody=tablebody+"<td>"+value+"</td>";
							});
     	          						tablebody=tablebody+"</tr>";
     	          						headgo=false;
     	          						
     	          			});
     	          			thead=thead+'</tr></thead>';
     	          		 	$('#detailsvalue').html('<table id="table-transform"   data-height="300"   data-show-toggle="true"   data-search="true"> '+thead+tablebody+'</tbody></table>');
                            $('#table-transform').bootstrapTable();
     	          			/*$('#tableCredentials').bootstrapTable({
     	          		        data: $rootScope.buildjson_S3Credentials_data
     	          		    });*/
                           
    			     	},function (errorMessage) {
    			     		
    			 		});	
    				 	 
    	    }
    		
    		$scope.ObjectDetails=function(ObjectKey)
	        {
				 	 
				 	$scope.BucketObjectDetailsJson={"accesskey":"AKIAJZJDCKYE224FBKUA","secretKey":"U+RBTBz3M6UBt1muMxfN2hlX\/bkIUs9DAZQiypiq","bucketName": $scope.bucketname,"key":ObjectKey }
				 	BucketContain.BucketObjectDetails($scope.BucketObjectDetailsJson).then(function (data) {
	        			$('#detailsvalue').html('<div class="general-item-list"><div class="item"><div class="item-details"><a href="#" class="item-name primary-link">Bucket:</a> <span class="item-label">'+data.bucketname+'</span></div> </div> <div class="item"><div class="item-details"><a href="#" class="item-name primary-link">Link:</a> <span class="item-label">'+data.link+'</span></div> </div> <div class="item"><div class="item-details"><a href="" class="item-name primary-link">Content Length </a> <span class="item-label">'+data.contentLength+'</span></div> </div>	<div class="item"><div class="item-details"><a href="#" class="item-name primary-link">E Tag:</a> <span class="item-label">'+data.etag+'</span></div> </div> 	<div class="item"><div class="item-details"><a href="#" class="item-name primary-link">LastModified:</a> <span class="item-label">'+data.lastModified+'</span></div> </div></div>');
				 		//alert(angular.toJson(data,true)); 
			     	},function (errorMessage) {
			     		
			 		});	
				 	 
	    }
    		$scope.menuOptions = [
                                  ['Get Properties', function ($itemScope) {
                                     //alert($itemScope.buildjson.key); //$scope.player.gold -= $itemScope.item.cost;
                                  }],

                                  ['Delete Folder', function ($itemScope) {
                                	  $scope.deletefolder($itemScope.buildjson.key); 
                                  }]
                              ]; 
    		
    		$scope.menuOptions2 = [
                                  ['Get Object Detail', function ($itemScope) {
                                	  $scope.ObjectDetails($itemScope.buildjson.key);
                                	  var id="object"+$itemScope.$index;
                                  	  $( ".thumbnail"  ).removeClass( "drop" ); 
                                  	  $( "#"+id).addClass( "drop" );  
                                	  $( "#drop-zone" ).removeClass( "col-md-12" ).addClass( "col-md-7" ); 
                                	  $('#details').after().find('.caption-subject.bold.uppercase').html("Object: "+$itemScope.buildjson.key); 
                                	  $('#details').show(100);
                                	  $('#detailsvalue').html('<h1>Loading....</h1>');
                                	  	
                                	 
                                   }],

                                  ['Object Preview', function ($itemScope) {
                                	var id="object"+$itemScope.$index;
                                	$scope.ObjectPreview($itemScope.buildjson.key);
                                	$( ".thumbnail"  ).removeClass( "drop" ); 
                                	$( "#"+id).addClass( "drop" );  
                              	  	$( "#drop-zone" ).removeClass( "col-md-12" ).addClass( "col-md-7" ); 
                              	  	$('#details').after().find('.caption-subject.bold.uppercase').html("Object: "+$itemScope.buildjson.key); 
                              	  	$('#details').show(100);
                              	  	$('#detailsvalue').html('<h1>Loading....</h1>');
                              	  	
                                  }],
                                  ['Delete Object', function ($itemScope) {
                                      alert(); // $scope.player.gold += $itemScope.item.cost;
                                    }]
                              ];     	
    		
    		$scope.custommenu=function(value)
            {
            	var id=$(event.target).attr("id");
            	var id =id.split(',');
            	switch(value) {
    	        case "getProperties":  alert("second"); break; 
    	        case "deleteFolder": $scope.deletefolder(id[1]);   break;
            	}
            	$(".custom-menu").hide(100);
            }
    		
    		$scope.custommenu2=function(value)
            {
            	var id=$(event.target).attr("id");
            	//$( "#1.jpgsyratesting" ).addClass( "drop" );
            	//var idsplit =id.split(',');
            	switch(value) {
    	        case "getObjectDetails":  $scope.getObjectDetails(id); break;
    	        case "ObjectPreview": /* $scope.ObjectPreview(id[1]);*/ 
	    	        //$( ".thumbnail"  ).removeClass( "thumbnail drop drop-zone-bucket" ).addClass( "thumbnail  drop-zone-bucket" );  
	    	        $( "#"+id ).addClass( "drop" );      
	    	        alert(id);
	    	       
	    	        //$('#details').after().find('.caption-subject.bold.uppercase').html(id); 
	    	        //$('#details').show(100);$('#detailsvalue').html('<h1>Loading....</h1>'); 4
	    	        break;
    	        case "deleteObject":    break;
            	}
            	$(".custom-menu2").hide(100);
            }
    		$scope.getObjectDetails=function(objectId)
    		{
    			alert(objectId);
    		}
    		
    		$('.btn.buttoncolor.start').click(function(){
 
    			 $scope.serverfilestatus='hide';
    			 $scope.jobinputstatus='hide';
    			 $scope.$apply();
    			 $('.bs-select').selectpicker({
    		        iconBase: 'fa',
    		        tickIcon: 'fa-check'
    		    });
    			 $('#jobcheckbox').on('ifClicked', function(event){
		    		   
    				 if($(this).is(":checked")) 
		    			{
    		   			 
    		   			 $scope.jobinputstatus='hide';
    	    			 $scope.$apply();
		    			}
    				 else
    					{
    	    			 
    	    			 $scope.jobinputstatus='show';
    	    			 $scope.$apply();
    					}
		    		  
   				});
   			
    		    $('select[name="source"]').html('');
    		    $('select[name="source"]').html('<option data-icon="icon-info" value="">Select Source</option>');
    		    $.each($rootScope.buildjson_ServerCredentials_data, function (index, valueobj) {
        		    $('select[name="source"]').append('<option data-icon="icon-info" value="'+valueobj.id+'">'+valueobj.serverName+'</option>').selectpicker('refresh');
    		    });
    		    $(document).on('change', 'select[name="source"]', function(){
    		    	  if($(this).val() == ""){
    		    		  $scope.serverfilestatus='hide';
    		    		  $scope.$apply();
    		    	  }
    		    	  else
    		    		  {
    		    		  	
    		    		 
    		    		   
    		    		  //{"ftpconnect":1,"allContents":{"folderList":["download","upload"],"fileList":["You can upload file into [upload]"]},"status":"Successfully connected and show list of all files"}


    		    		  
    		    		  $('select[name="serverfile"]').html('');
    		    		  $('select[name="serverfile"]').html('<option data-icon="icon-info" value="">Select File</option><optgroup data-icon="fa fa-folder" label="Folder 1"><option data-icon="fa fa-file">File 1</option><option data-icon="fa fa-file">File 2</option></optgroup>').selectpicker('refresh');
    		    		  $scope.serverfilestatus='';
    		    		  $scope.$apply();
    		    		  //alert ( $('.form-group.serverfile').show() );
    		    		
    		    		  }
    		    	});
    		    $('#static').modal('toggle');
    		});
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
}]);

/*@RequestMapping(value = "/s3operation/fileupload", method = RequestMethod.POST, produces = "application/json")
public @ResponseBody Map<Object,Object> s3MultipartFileUpload(@RequestParam("accesskey") String accesskey,
                                                        @RequestParam("secretkey") String secretkey,
                                                        @RequestParam("bucketName") String bucketName,
                                                        @RequestParam("key") String key,
                                                        @RequestParam("file") MultipartFile file){*/