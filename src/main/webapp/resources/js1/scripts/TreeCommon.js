/**
Demo script to handle the theme demo
**/
var TreeCommon = function () {
	

    var handleFolderCreate = function(userid,node,FolderService) { 
		 
		//$('#jstree').jstree(true).get_node("#connection_1").core.data = [];
		//$('#jstree').jstree(true).refresh();
		//alert( JSON.stringify($('#jstree').jstree(true).get_node("#connection_1")) )
		//$("#jstree").jstree("create_node",  "#connection_1",folderupdatetreejson,"last",
        //     false, true);
		//$('#jstree').jstree(true).settings.core.data = folderupdatetreejson;
		//$('#jstree').jstree(true).refresh();
    	
			//$("#jstree").jstree("remove","#");
			//$('#jstree').jstree('refresh', $('#node_" + id));
			//alert( JSON.stringify(folderconnectiontreejson) );
			//$('#jstree').jstree(true).refresh();
			// $("#jstree").delete_node('#connection_1') ;
			//$("#jstree").jstree("remove","#connection_1");
			//alert( JSON.stringify($('#jstree').jstree(true).get_node("#connection_1")) )
 
	    swal({
							  title: 'Create Folder',
							  text: 'Folder will create under User.',
							  input: 'text',
							  showCancelButton: true,
							   confirmButtonText: 'Create!',
							  showLoaderOnConfirm: true,
							  preConfirm: function(foldername) {
								
								  return new Promise(function(resolve, reject) {
								  if (foldername === '') {
								    reject("Folder Name Feild Can't be Empty .")
								  } 
								  else
								  {
  		     						$("#jstree").jstree("close_node", "#connection_"+ node.id.split('_')[1]);
  		     						var folderJson = [{
											id:null,
											folderName: foldername,
											parentId:userid,
										}];
									    //alert(JSON.stringify(folderJson));
							        	FolderService.saveFolders(folderJson).then(function (data) {
							        		//alert(JSON.stringify(data));							    
							        		resolve() 
							        	},function (errorMessage) {
							        		resolve() 
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
	    	

	        // Handle Theme Settings
	        var handleFolderDelete = function (node,FolderService) {
	        	swal({
	        		  title: 'Are you sure?',
	        		  text: "You won't be able to revert this!",
	        		  type: 'warning',
	        		  showCancelButton: true,
	        		  confirmButtonColor: '#3085d6',
	        		  cancelButtonColor: '#d33',
	        		  confirmButtonText: 'Yes, delete it!'
	        		}).then(function () {
	        			 var folderid=node.id.split('_')[2];
	    	        	 var deletedFolderIds = [folderid];
	    					$("#jstree").jstree("close_node", "#"+node.parent );
	    					FolderService.deleteFolders(deletedFolderIds).then(function (data) {
	    						swal(
	    			        		    'Deleted!',
	    			        		    'Your Folder has been deleted.',
	    			        		    'success'
	    			        		  )					    
	    	          	},function (errorMessage) {
	    	          		alert(errorMessage);
	    	    			});	
	        		  
	        		})
	        		
	        	
	        };
	        
	        var handleFolderEdit = function(userid,node,FolderService) { 
	        	alert(JSON.stringify(node));
	        	var folderid=node.id.split('_')[2];
	        	swal({
	    							  title: 'Update Folder',
	    							  text: 'Folder will be Update.',
	    							  input: 'text',
	    							  inputValue:node.text,
	    							  showCancelButton: true,
	    							   confirmButtonText: 'Update!',
	    							  showLoaderOnConfirm: true,
	    							  preConfirm: function(foldername) {
	    								
	    								  return new Promise(function(resolve, reject) {
	    								  if (foldername === '') {
	    								    reject("Folder Name Feild Can't be Empty .")
	    								  } 
	    								  else
	    								  {
	      		     						//$("#jstree").jstree("close_node", "#"+node.parent );
	    									 $("#jstree").jstree("close_all" );
	    									 var folderJson = [{
	    											id:folderid,
	    											folderName: foldername,
	    											parentId:userid,
	    										}];
	    									    //alert(JSON.stringify(folderJson));
	    							        	FolderService.saveFolders(folderJson).then(function (data) {
	    							        		alert(JSON.stringify(data));							    
	    							        		resolve() 
	    							        	},function (errorMessage) {
	    							        		alert(errorMessage);
	    							        		resolve() 
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
	       var handleConnectionCreate = function( node ) { 
	    	   var folderId=node.id.split('_')[2];
	    	   $("#jstree").jstree("open_node", "#"+node.id );
	    	   $("#connection_form_div").find('.portlet-title').after().find('.caption').html('<i class="fa icon-share"></i>Create New Connection');
	    	   $('#connectionfolderid').val(folderId);
	    	   $('#connectionformtype').val("create");
	    	   $('#connection_form_div').hide(); 
	    	   $('#connection_form_div').show('toogle');  
	       };
	       
	       var handleConnectionEdit = function( node,ConnectionService ) { 
	    	   //$("#jstree").jstree("open_node", "#"+node.id );
	    	   $("#connection_form_div").find('.portlet-title').after().find('.caption').html('<i class="fa icon-share"></i>Edit Connection');
	    	   var folderId=node.parent.split('_')[2];
	    	   $('#connectionfolderid').val(folderId);
	    	   $('#connectionformtype').val("edit");
			   ConnectionService.searchConnections(folderId).then(function(success) {
	    			var connection = alasql('SELECT * \ FROM ? \ where (id ='+node.id.split("_")[1]+')',[success.connections]);
 
	    			$("input[name=connectionName]").val(connection[0].connectionName);
	    			$("input[name=connectionType]").val(connection[0].connectionType);
	    			$("input[name=hiveThriftServer]").val(connection[0].hiveThriftServer);
	    			$("input[name=hdfsConnectionString]").val(connection[0].hdfsConnectionString);
	    			$("input[name=hdfsPath]").val(connection[0].hdfsPath);
	    			$("input[name=hdfsAccessUser]").val(connection[0].hdfsAccessUser);
	    			$("input[name=hdfsFieldDelim]").val(connection[0].hdfsFieldDelim);
	    			$("input[name=redshiftDbUrl]").val(connection[0].redshiftDbUrl);
	    			$("input[name=redshiftUser]").val(connection[0].redshiftUser);
	    			$("input[name=redshiftPassword]").val(connection[0].redshiftPassword);
/*	    			$("input[name=s3AccessKey]").val(connection.s3AccessKey);
	    			$("input[name=s3SecreteKey]").val(connection.s3SecreteKey);
	    			$("input[name=hdfsTempDir]").val(connection.hdfsTempDir);*/
	    			$('input[name=connectionfolderid]').val(connection[0].folderId);
	    			$('input[name=createconnectionid]').val(connection[0].id);
	    			
			
			  },function (errorMessage) {
	          		alert(errorMessage);
	    			});	
    		   
	    	   $('#connection_form_div').hide(); 
	    	   $('#connection_form_div').show('toogle'); 
	       };
	       
	       var handleConnectionDelete = function( node , ConnectionService) { 
	    	   swal({
	        		  title: 'Are you sure?',
	        		  text: "You won't be able to revert this!",
	        		  type: 'warning',
	        		  showCancelButton: true,
	        		  confirmButtonColor: '#3085d6',
	        		  cancelButtonColor: '#d33',
	        		  confirmButtonText: 'Yes, delete it!'
	        		}).then(function () {
	        			  
	        			 var Connection_id=node.id.split('_')[1];
	    	        	 var deletedConnectionIds = [Connection_id];
	    					$("#jstree").jstree("close_node", "#"+node.parent );
	    					ConnectionService.deleteConnections(deletedConnectionIds).then(function (data) {
	    						swal(
	    			        		    'Deleted!',
	    			        		    'Your Connection has been deleted.',
	    			        		    'success'
	    			        		  )					    
	    	          	},function (errorMessage) {
	    	          		alert(errorMessage);
	    	    			});	
	        		  
	        		})
	       };
    	   
    return {

        //main function to initiate the theme
        init: function($state,FolderService,ConnectionService,user_Folder_data) {
        	

    		var User = alasql('SELECT * \ FROM ? \ GROUP BY parentId',[user_Folder_data.folders]);
        	//alert(JSON.stringify(User));
    		var treejsondata=[{ "id":"dashboard","text": "Dashboard", "icon": "fa icon-home icon-state-success icon-lg"  }];
    		$.each(User, function (index, valueobj) {
    			var folderconnectiontreejson=[];
    			var Folders = alasql('SELECT * \ FROM ? \ where (parentId ='+valueobj.parentId+')',[user_Folder_data.folders]);
    			$.each(Folders, function (indexfolder, valueobjfolder) {
    				folderconnectiontreejson.push({ 
    					"id":"folder_connection_"+valueobjfolder.id ,
    					"text":valueobjfolder.folderName, 
                        "icon": "fa icon-folder icon-state-success icon-lg",
                        "children": [
                                     {
    					         		"text": "No Connection",
    					         		"icon": "fa icon-share icon-state-success icon-lg",
    					         		 
    					         	}]
                        }
    				    );
    			});
    			treejsondata.push({ 
    				"id":"user_"+valueobj.parentId ,
    				"text":"User - "+valueobj.parentName, 
    				/*"a_attr" : { "href" : "#/dashboard.html" },*/
    				"icon": "fa icon-user icon-state-success icon-lg",
     				/*"state": {
    			        "selected": true,
    			        "opened": true
    			    },*/
    				"children":[
    				            {
    		             "id":"connection_"+valueobj.parentId,
    		             "text": "Connection",
    		             "icon": "fa icon-puzzle icon-state-success icon-lg",
    		             "children": [{
    		            	 	"text": "FolderName",
				         		"icon": "fa icon-folder icon-state-success icon-lg",
				         		 
				         	}] 
    							},
    							{
    		          	 "id":"mapping_"+valueobj.parentId,
    		             "text":"Mapping",
    		             "icon": "fa icon-wrench icon-state-success icon-lg",
    		         	 "children": [{
				         		"text": "Mapping 1",
				         		"icon": "fa icon-share icon-state-success icon-lg",
				         		 
				         	}]
    							},
    							{
    					 "text":"Transformer",
    					 "icon": "fa icon-magic-wand icon-state-success icon-lg",
    					 "children":[{
    					         		"text": "Transformer 1",
    					         		"icon": "fa icon-share icon-state-success icon-lg",
    					         		 
    					         	}]
    					        },
    					        {
    					"text":"Workflow",
    		            "icon": "fa icon-grid icon-state-success icon-lg",
    		            "children":[{
    					         		"text": "Workflows 1",
    					         		"icon": "fa icon-share icon-state-success icon-lg",
    					         		 
    					         	}]
    					        },
    					        {
    		         	"text":"Schedules",
    		            "icon": "fa icon-clock icon-state-success icon-lg",
    		         	"children":[{
    					         		"text": "Schedules 1",
    					         		"icon": "fa icon-share icon-state-success icon-lg",
    					         		 
    					         	}]
    					        },
    					        {
    		         	"text":"Monitoring",
    		            "icon": "fa icon-directions icon-state-success icon-lg",
    		         	"children":[{
    					         		"text": "Monitoring 1",
    					         		"icon": "fa icon-share icon-state-success icon-lg",
    					         		 
    					         	}]
    					        },
    					        {
    		         	"text":"Load From Local",
    		            "icon": "fa icon-shuffle icon-state-success icon-lg",
    		         	"children":[{
    					         		"text": "Monitoring 1",
    					         		"icon": "fa icon-share icon-state-success icon-lg",
    					         		 
    					         	}]
    					        }
    							]
    				});
    	    }); 
    		
    		//alert(JSON.stringify(treejsondata[0]));
    		//alert(FolderService);
    		$('#jstree').jstree({
    			'plugins': ["wholerow","contextmenu", "dnd","state", "types"],
    			"contextmenu" : {
    		         "items" : function(node) {
    		        	 
    		        	$('#connection_form_div').hide(); 
    		        	if( node.id.split('_')[0]  == "user") //If node is a user
    		     	    {
    		     	    		var userid=node.id.split('_')[1];
    		     	    		var items = 
    		     	    		{
    		     				"Create" : {
    		     					"label" : "Create folder",
    		     					"action" : function(){   
    		     						handleFolderCreate(userid,node,FolderService); 
    		     										}    										
    		     							}
    		     				};
    		     	    }
    		     	    
    		     	   if ( node.id.split('_')[1]  == 'connection' ) //If node is a folder
    		     	   { 
    		     		   		var userid=node.parent.split('_')[1];
    		     		  		var items = 
    		     				{
    		     				"Create" : {
    		     					"label" : "Create Connection",
    		     					"action" : function () { 
    		     						handleConnectionCreate(node); 
    		     							}
    		     							},
    		     			    "Edit" : {
    		     					"label" : "Edit Folder",
    		     					"action" : function () {  
		     							handleFolderEdit(userid,node,FolderService); 		     						
    		     						   }
    		     						   },
    		     				"delete" : {
    		     				"label" : "Delete folder",
    		     				"action" : function () { 
 		     							handleFolderDelete(node,FolderService); 

    		     										}
    		     						   }
    		     								
    		     				 };
    		     					

    		     	   } 
    		     		if( node.id.split('_')[0] == "connectionid")
    		     		{
	    		     			var items = 
			     				{
			     				"Edit" : {
			     					"label" : "Edit Connection",
			     					"action" : function () { 
			     						handleConnectionEdit(node, ConnectionService);
			     							}
			     							},
			     				"delete" : {
			     				"label" : "Delete Connection",
			     				"action" : function () { 
			     					    handleConnectionDelete(node,ConnectionService);
			     										}
			     						   }
			     								
			     				 };
    		     		}

    		     	    	return items;
    		     	    	
    		         }
    		     },
    	        'core': {
    	            'data':  treejsondata,
    	            'themes': {
    	                'name': 'proton',
    	                'responsive': true
    	            },
    	      "check_callback" : function(operation, node, node_parent, node_position, more) {
    	             	// operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
    	                 // in case of 'rename_node' node_position is filled with the new node name
    	             	//alert(operation);
    	             	return true;
    	       }
    	        }
    	     });
    		
    		$("#jstree").bind("open_node.jstree", function (event, data) { 
    			 
    			
    			 if( data.node.id.split("_")[0] =='user')
    			 {
    				 $state.go('dashboard');
    			 }
    			 if (data.node.id.split("_")[0]  == "connection") 
    				 {

 						FolderService.searchFolders().then(function(folderinfo) {
 	    				 	var firstParent = $('#jstree').jstree(true).get_node("#"+data.node.id);
 	 						$('#jstree').jstree(true).delete_node(firstParent.children);
 			    			var Folders = alasql('SELECT * \ FROM ? \ where (parentId ='+data.node.id.split("_")[1]+')',[folderinfo.folders]);
  			    			$.each(Folders, function (indexfolder, valueobjfolder) {
 			    				 
 							$("#jstree").jstree("create_node",  "#"+data.node.id,{ 
 			    					"id":"folder_connection_"+valueobjfolder.id ,
 			    					"text":valueobjfolder.folderName, 
 			                        "icon": "fa fa-folder icon-state-success icon-lg",
 			                        "children": [
 			                                     {
 			    					         		"text": "No Connection",
 			    					         		"icon": "fa fa-file icon-state-success icon-lg",
 			    					         		 
 			    					         	}]
 			                        },"last",
		        	                       false, true); 
  			    			});
    		    	        },
    		   	   			function(errorMessage) {
    		    	        	alert(errorMessage);
    		    	        	$("#jstree").jstree("close_node", "#"+data.node.id );
    		    	        	
    		   	   		});
    				 }
    			 if (data.node.id.split("_")[0]  == "mapping") 
				 {

						FolderService.searchFolders().then(function(folderinfo) {
	    				 	var firstParent = $('#jstree').jstree(true).get_node("#"+data.node.id);
	 						$('#jstree').jstree(true).delete_node(firstParent.children);
			    			var Folders = alasql('SELECT * \ FROM ? \ where (parentId ='+data.node.id.split("_")[1]+')',[folderinfo.folders]);
			    			$.each(Folders, function (indexfolder, valueobjfolder) {
			    				 
							$("#jstree").jstree("create_node",  "#"+data.node.id,{ 
			    					"id":"folder_mapping_"+valueobjfolder.id ,
			    					"text":valueobjfolder.folderName, 
			                        "icon": "fa fa-folder icon-state-success icon-lg",
			                        "children": [
			                                     {
			    					         		"text": "No Mapping",
			    					         		"icon": "fa fa-file icon-state-success icon-lg",
			    					         		 
			    					         	}]
			                        },"last",
	        	                       false, true); 
			    			});
		    	        },
		   	   			function(errorMessage) {
		    	        	alert(errorMessage);
		    	        	$("#jstree").jstree("close_node", "#"+data.node.id );
		    	        	
		   	   		});
				 }
    			 if (data.node.id.split("_")[0]  == "folder") 
				 {
				 	if (data.node.id.split("_")[1]  == "connection") 
				 		{
	    				 var folderId=data.node.id.split("_")[2];
	    				 ConnectionService.searchConnections(folderId).then(function(success) {
	 	    				 
	 	    				 	var firstParent1 = $('#jstree').jstree(true).get_node(data.node.id);
	 	    				 	$('#jstree').jstree(true).delete_node(firstParent1.children);
	 	    				 	if(success.connections !="")
	 	    				 		{
		 	 						$.each(success.connections, function (index, valueobj) {
			    						// alert(JSON.stringify(valueobj));
			    						 $("#jstree").jstree("create_node",  data.node.id,{ 
			 			    					"id":"connectionid_"+valueobj.id ,
			 			    					"text":valueobj.connectionName, 
			 			                        "icon": "fa icon-paper-clip icon-state-success icon-lg",
			 			                        },"last",
					        	                       false, true); 
			    						 
			  			    			});
	 	    				 		}
	 	    				 	else
	 	    				 		{
	 	    				 		$("#jstree").jstree("create_node",  data.node.id,{ 
	 	    				 			"text": "No Connection",
	 			                        "icon": "fa icon-paper-clip icon-state-success icon-lg",
	 			                        },"last",
			        	                       false, true); 
	 	    				 		}

	    				  },
	 	 					   	function(errorMessage) {
	    					    $("#jstree").jstree("close_node", data.node.id  );
	 	 				  });
				 		}
				 }
    			}); 
    		$('#jstree').bind("ready.jstree", function (event, data) {
    			 if($state.$current   =='blank') 
    				{
         			$.each(User, function (index, valueobj) {
        				$("#jstree").jstree("close_node", "#user_"+valueobj.parentId );		
        			});
    				}

            })
    	    $('#jstree').on('select_node.jstree', function(e,data) { 
               
    	    	  var link = $('#' + data.selected).find('a');
    	    	  if( data.node.id == "dashboard")
                	{
    	    			$.each(User, function (index, valueobj) {
    	    				$("#jstree").jstree("close_node", "#user_"+valueobj.parentId );		
    	    			});
    	    			 $state.go('blank');
    	    		 /* if (link.attr("href") != "#" && link.attr("href") != "javascript:;" && link.attr("href") != "") {
    	                    document.location.href = link.attr("href");
    	    		  	}*/
                	}
    	    	  if( data.node.id.split("_")[0]== "user")
              		{
    	    		  $.each(User, function (index, valueobj) {
  	    				$("#jstree").jstree("open_node", "#user_"+valueobj.parentId );		
  	    			  });
    	    		  $state.go('dashboard');
    	    		  /*if (link.attr("href") != "#" && link.attr("href") != "javascript:;" && link.attr("href") != "") {
  	                    document.location.href = link.attr("href");
  	    		  		}*/
              		}
              
                
               
                    return false;
            });
            // handles style customer tool
        	//handleFolder(FolderService); 

            // handle layout style change
          
        }
    };

}();

/*if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function() {    
    	TreeCommon.init(FolderService,ConnectionService,user_Folder_data); // init metronic core componets
    });
}*/