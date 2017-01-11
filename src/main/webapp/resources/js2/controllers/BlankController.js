'use strict';
/* Setup blank page controller */
angular.module('MetronicApp').controller('BlankController', ['$state', '$stateParams','$uibModal', '$log','$rootScope', '$scope', 'settings','UserService', function($state , $stateParams, $uibModal, $log,$rootScope, $scope,settings,UserService ) {

		$scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
        Layout.init();
        $('[data-toggle="popover"]').popover(); 
        var x = screen.width;
        var y = screen.height;
        
       // console.log( x +","+y) ;
        //alert(JSON.stringify(  $stateParams));
        //alert( JSON.stringify($state));
        AWS.config.update({
            accessKeyId : 'AKIAJ6E34VVCK6A7RTAQ',
            secretAccessKey : '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'
        });
        AWS.config.apiVersions = {
        		  s3: '2006-03-01',
        		};
        //var accessKeyId = 'AKIAJ6E34VVCK6A7RTAQ';

        //var secretAccessKey = '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';
        AWS.config.region = 'us-west-2';
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        	
         
       	var classname =  document.querySelectorAll('.drop-zone-bucket');
       	
            //console.log('test'+classname.length); 
            for (var i = 0; i < classname.length; i++) {
            var dropZone = classname[i];
 
            
            //var dropZone = document.getElementById('drop-zone');
            
            dropZone.ondrop = function(e) {
                e.preventDefault();
            	e.preventDefault();
            	$( "#overlaydiv" ).removeClass( "showdiv" ).addClass( "hidediv" );
                $scope.dropzoneclass='upload-drop-zone';
                $scope.$apply();
                console.log(this.id);
                //startUpload(e)
            }

            dropZone.ondragover = function(e) {
            	console.log('innerover'+this.id);
            	if(this.id !='drop-zone')	document.getElementById(this.id).className = "thumbnail drop drop-zone-bucket";
            	$scope.$apply();
            	e.stopPropagation();
            	e.preventDefault();
                return false;
            }

            dropZone.ondragleave = function(e) {
            	e.stopPropagation();
            	e.preventDefault();
            	console.log('ineerleave'+this.className);
            	if(this.id !='drop-zone')	document.getElementById(this.id).className = "thumbnail drop-zone-bucket";
            	$scope.$apply();
            	
            	
            	return false;
            }
            }
        });
        
       var dropZone = document.getElementById('drop-zone');
  

        dropZone.ondragover = function(e) {
        	console.log('outerover'+this.id);
        	$( "#overlaydiv" ).removeClass( "hidediv" ).addClass( "showdiv" );
        	$scope.dropzoneclass='upload-drop-zone drop';
        	$scope.$apply();
        	e.stopPropagation();
        	e.preventDefault();
        	return false;
        }

       
        var dropZone = document.getElementById('overlaydiv');
        
        
        dropZone.ondrop = function(e) {

        	$( "#overlaydiv" ).removeClass( "showdiv" ).addClass( "hidediv" );
        	$scope.dropzoneclass='upload-drop-zone';
            $scope.$apply();
            console.log(this.id);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        
         
        dropZone.ondragleave = function(e) {
        	console.log('outerleave'+this.id);
        	$( "#overlaydiv" ).removeClass( "showdiv" ).addClass( "hidediv" ); 
        	$scope.dropzoneclass='upload-drop-zone';
        	$scope.$apply();
        	e.stopPropagation();
        	e.preventDefault();
        	return false;
        } 
         
        
        
        
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
    				  
    				  if (foldername.length  > 65 || foldername.length  < 3) {
      				    reject("Bucket Name Feild Can't be Empty .")
      				  } 
    				  else
    				  {
    					  resolve();	
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
		/* showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Yes, delete it!',
		  cancelButtonText: 'No, cancel!',
		  confirmButtonClass: 'btn btn-success',
		  cancelButtonClass: 'btn btn-danger',*/
       // var classname =  document.getElementsByClassName("drop-zone-bucket1");
        
        $scope.buildjson_bucket=[{"name":"amazon-aws-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471529135000},{"name":"amazon-immersion-project","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471522562000},{"name":"amazon-mockupdata","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471606750000},{"name":"anjansoftans-06899-s3disk-3","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1479048404000},{"name":"attunity-bucket","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1478521976000},{"name":"aws-testing-bucket","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1471600124000},{"name":"awssoftnas-storage","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1472129182000},{"name":"basebucket-55862-s3disk-0","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1479139804000},{"name":"cf-templates-2q3n4syooaxx-us-west-2","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1472588867000},{"name":"syratesting","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1481097063000},{"name":"test-bucket-aws-immersion","owner":{"displayName":"results","id":"c1ec7d2c5c956704d7cd836b30b9bebbedec045b7b46ced7e19c075161bfaa05"},"creationDate":1473769075000}]
        $scope.getbucketobject = function(bucketname) {
         
        	$state.go('bucket' , { 'BucketName': bucketname });
        	//$state.go('bucket',bucketname);
        	/*var s3 = new AWS.S3();
            var params = { 
             Bucket: 'syratesting'
            }

            s3.listObjects(params, function (err, data) {
             if(err)throw  alert(angular.toJson(err,true));;
             alert(angular.toJson(data,true));;
            });*/
        };
    
      /*  AWS.config.update({
            accessKeyId : 'AKIAJ6E34VVCK6A7RTAQ',
            secretAccessKey : '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'
        });
        AWS.config.apiVersions = {
        		  s3: '2006-03-01',
        		};
        //var accessKeyId = 'AKIAJ6E34VVCK6A7RTAQ';

        //var secretAccessKey = '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';

        var bucketName = 'syratesting';

        AWS.config.region = 'us-west-2';

        
        var s3 = new AWS.S3();
        alert(angular.toJson(s3,true));
        s3.listBuckets(function(err, data) {
        	  if (err)  alert(angular.toJson(err,true)); // an error occurred
        	  else      alert(angular.toJson(data,true));           // successful response
        	});
*/
        //var AWS = require('aws-sdk');
        AWS.config.update({accessKeyId: 'AKIAJ6E34VVCK6A7RTAQ', secretAccessKey: '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', region: 'us-west-2'});
       /* var s3 = new AWS.S3();

        var params = { 
         Bucket: 'syratesting'
        }

        s3.listObjects(params, function (err, data) {
         if(err)throw  alert(angular.toJson(err,true));;
         alert(angular.toJson(data,true));;
        });*/
        
        $scope.dropzoneclass='upload-drop-zone';
        $scope.bucketdropzoneclass='thumbnail';
        var startUpload = function(e) {
        	 var files = e.dataTransfer.files,
             folders = 0,
             other = 0;
        	 console.dir(files);
        	/* var file = files[0];
        	 var bucket = new AWS.S3({params: {Bucket: 'syratesting', Key:  file.name}});
        	 var opts = {queueSize: 2, partSize: 1024 * 1024 * 10};*/

     /*   	 var params = {Key: file.name, ContentType: file.type, Body: file};
        	 bucket.upload(params, function (err, data) {
        		 if(err)throw  alert(angular.toJson(err,true));;
                 alert(angular.toJson(data,true));;
        		});*/
        	 
        	 
        	/* bucket.upload({Body: file},opts ).
        	  on('httpUploadProgress', function(evt) {
        	    console.log('Progress:', evt.loaded, '/', evt.total); 
        	  }).
        	  send(function(err, data) { console.log(err, data) });*/
        	 
        	 //var fd = new FormData();
        	/* UserService.fileupload(files[0]).then(function (data) {
         	 alert(angular.toJson($scope.userlogdata,true));
         	},function (errorMessage) {
         	   alert(angular.toJson(errorMessage,true));
     		});	*/
         	
        /*		
         for (var i = 0, f; f = files[i]; i++) { // iterate in the files dropped
             if (!f.type && f.size % 4096 == 0) {  fd.append('file', f);        
             console.log(f.name); 
             folders++; }
             else { console.log(f.name); other++; }
         }
         
         */
 
         
          
         //console.dir(files);
         
         
        /* if (folders && !other) {
             if (folders > 1)	console.log('You dropped ' + folders +' folders!');
             else	console.log('You dropped 1 folder!');;
         } else if (!folders && other) {
             if (other > 1)	console.log('You dropped ' + other +' files!'); 
             else	console.log( 'You dropped 1 file!');
         } else {
             if (folders > 1)	console.log('You dropped ' + folders +' folders ');
             else	console.log('You dropped 1 folder ');
             if (other > 1) console.log('and ' + other +' files!'); 
             else  console.log('and 1 file!');  
         }*/
        
        }

        
        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
}]);

 