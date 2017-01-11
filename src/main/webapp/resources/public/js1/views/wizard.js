// Javascript for Wizard
$(document).on('click', function(){

        $("#basic").validate({
             rules: {
                
                restaurant_name: {
                    required: true,                     
                    noSpace: true
                },
                restaurant_phone: {
                    required: true,
                    number: true,
                    maxlength: 12
                },
                restaurant_address: {
                    required: true
                },
                vat_value: {
                    required: true,
                    number: true
                },
                service_charge: {
                    required: true,
                    number: true
                },
                room_service_charge: {
                    required: true,
                    number: true
                }
                
             },
             messages: {
                restaurant_name: {
                        required: "Please enter restaurant name"
                    },    
                restaurant_phone: {
                        required: "Please enter restaurant phone",
                        number: "Please specify a number"
                    },
                restaurant_address: {
                        required: "Please enter restaurant address"
                    },
                vat_value: {
                        required: "Please enter vat",
                        number: "Please specify a number"
                    },
                service_charge: {
                        required: "Please enter service charge",
                        number: "Please specify a number"
                    },
                room_service_charge: {
                        required: "Please enter service charge for room service",
                        number: "Please specify a number"
                    }                                   
             },
            
        });


        // $("[name=table_number]").each(function () {
        //   $(this).rules("add", {
        //   required: true,
        //   });
        // });

        // $("#table_form").validate({
        //      rules: {
                
        //         'table_number[]': {
        //             required: true
        //         },
        //         'no_of_seats[]': {
        //             required: true,
        //             number: true
        //         }
                
        //      },
        //      messages: {
        //         "table_number[]": {
        //                 required: "Please enter table number"
        //             },    
        //         "no_of_seats[]": {
        //                 required: "Please enter no of seats",
        //                 number: "Please specify a number"
        //             }        
        //      },
            
        // });


        // $("#steward_form").validate({
        //  rules: {
            
        //     "steward_name[]": {
        //         required: true,                     
        //         noSpace: true
        //     },
        //     "steward_phone[]": {
        //         required: true,
        //         number: true
        //     }
            
        //  },
        //  messages: {
        //     "steward_name[]": {
        //             required: "Please enter steward name"
        //         },    
        //     "steward_phone[]": {
        //             required: "Please enter steward phone number",
        //             number: "Please specify a number"
        //         }        
        //     },
        
        // });

        $("#category_form").validate({
         rules: {
            
            category_name: {
                required: true,
                lettersonly: true,                     
                noSpace: true
            },
            category_description: {
                required: true
            },
            category_rank: {
                required: true,
                number: true
            }
            
         },
         messages: {
            category_name: {
                    required: "Please enter category name",
                    lettersonly: "only letters are allowed"
                },    
            category_description: {
                    required: "Please enter category description"
                },
            category_rank: {
                    required: "Please enter category rank",
                    number: "Please specify a number"
                }             
            },
        
        });

        $("#menu_form").validate({
         rules: {
            
            menu_name: {
                required: true,
                lettersonly: true,                     
                noSpace: true
            },
            category_id: {
                required: true
            },
            selling_price: {
                required: true,
                number: true
            },
            cost_price: {
                required: true,
                number: true
            },
            menu_rank: {
                required: true,
                number: true
            },
            add_vat: {
                required: true
            },
            alchoholic_item:
            {
                required: true
            },
            menu_description: {
                required: true
            }
            
         },
         messages: {
            menu_name: {
                    required: "Please enter menu name",
                    lettersonly: "only letters are allowed"
                },    
            category_id: {
                    required: "Please select a category"
                },
            selling_price: {
                    required: "Please enter selling price",
                    number: "Please specify a number"
                },
            cost_price: {
                    required: "Please enter cost price",
                    number: "Please specify a number"
                },
            menu_rank: {
                    required: "Please enter menu rank",
                    number: "Please specify a number"
                },
            add_vat: {
                    required: "Please select vat"
                },
            alchoholic_item:
            {
                required: "Please select Alchoholic item?"
            },
            menu_description: {
                    required: "Please enter menu description"
                }           
            },
        
        });


});



$(document).on('keypress', '.digit_only', function(e){    
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        $('.error_msg').html("Digits Only").show().fadeOut("slow");
        return false;
    }     
});


//================ Add rows ====================

function addMoreRows(frm) {
    var rowCount = document.getElementById("rowID").value;

    //alert(document.getElementsByName("table_number").value);
    /*if (document.getElementsByName("table_number").value == "") {

            alert("table number may not be blank");
        }*/
    rowCount ++;

     var recRow = '<div class="row" id="'+rowCount+'"><div class="col-md-12"><div class="col-md-4"><div class="form-group"><label for="">Table Number <span class="error">*</span></label><input type="text" id="table_number_'+rowCount+'" name="table_number[]" class="form-control table_number_class_check" class="form-control" required aria-required="true"  onkeyup="get_table_number(this.id);"><p id="table_number_error_'+rowCount+'" class="error_meaasge"></p></div></div><div class="col-md-4"><div class="form-group"><label for="">Number of Seats <span class="error">*</span></label><input type="text" id="no_of_seats_'+rowCount+'" name="no_of_seats[]" class="form-control" required aria-required="true" ><p id="no_of_seats_error_'+rowCount+'" class="error_meaasge"></p></div> </div><div class="col-md-4"><br><br><button type="button" onclick="addMoreRows(this.form);" class="btn btn-success btn-sm m-b-5">+</button><button type="button"  class="btn btn-danger btn-sm m-b-5"  onclick="removeRow('+rowCount+');" style="margin-left:1%;">-</button></div></div></div>';

    jQuery('#addedRows').append(recRow);

    $('#rowID').val(rowCount);

}

function removeRow(removeNum) {
    //alert(removeNum);
    jQuery("#"+removeNum).remove();

    var rowCount = document.getElementById("rowID").value;

    rowCount --;
    $('#rowID').val(rowCount);
}



//================ Add Steward rows ====================

function addMoreStewardRows(fm) {
    var rowCount = document.getElementById("rowStewardID").value;

    rowCount ++;

     var recRow = '<div class="row" id="'+rowCount+'"><div class="col-md-12"><div class="col-md-4"><div class="form-group"><label for="">Steward Name <span class="error">*</span></label><input type="text" id="steward_name_'+rowCount+'" name="steward_name[]" class="form-control" required aria-required="true"> <p id="steward_name_error_'+rowCount+'" class="error_meaasge"></p></div></div><div class="col-md-4"><div class="form-group"><label for="">Steward Phone Number <span class="error">*</span></label><input type="text" id="steward_phone_'+rowCount+'" name="steward_phone[]" class="form-control" required aria-required="true"><p id="steward_phone_error_'+rowCount+'" class="error_meaasge"></p></div> </div><div class="col-md-4"><br><br><button type="button" onclick="addMoreStewardRows(this.form);" class="btn btn-success btn-sm m-b-5">+</button><button type="button"  class="btn btn-danger" onclick="removeStewardRow('+rowCount+');" >-</button></div></div></div>';

    jQuery('#addedStewardRows').append(recRow);

    $('#rowStewardID').val(rowCount);

}


function removeStewardRow(removeNum) {
    //alert(removeNum);
    jQuery("#"+removeNum).remove();

    var rowCount = document.getElementById("rowStewardID").value;

    rowCount --;
    $('#rowStewardID').val(rowCount);
}




//====================================================


function editTable(idt)
{
    var base_url = $.cookie("base_url");
    var idt = idt;
    //alert(idt);
   
    $.ajax({
        url: base_url+"wizard/editTable/"+idt,
        type: 'POST',
        dataType: "json",
        data: {'idt': idt},  
        success:function(data)
        { 
            //alert(data) ; 
            $('#table-modal').modal('hide');
            $('#edit-table').modal('show');
            $('#edit-table').html('');
            $('#edit-table').html(data.item);
            
        }      
    });
}

//this need remve
// $('#edit_table').click(function(){
//     var base_url = $.cookie("base_url");
//    var tableID = $("#tableID").val();
   
//     $.ajax({
//         url: base_url+"wizard/updateTable",
//         type: 'POST',
//         dataType: "json",
//         data: {tableID : tableID},
//         success:function(data)
//         { 
//           alert(data); 
//         }      
//     });
// });


// function tableDelete(table_id) {
//     //alert(table_id); 
//      var base_url = $.cookie("base_url");
//     swal({
//         title: "Are you sure?",
//         text: "This POS table will be deleted and cannot be recovered!",
//         type: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#DD6B55",
//         confirmButtonText: "Yes, delete it!",
//         closeOnConfirm: false
//          }, function (isConfirm) {
//             //alert(isConfirm); 
//         if (!isConfirm) return;

//         $.ajax({
//             url: base_url+"wizard/tableDelete",
//             type: 'POST',
//             dataType: "json",
//             data: {'table_id': table_id},  
            
//         success: function(msg) {
//             swal("Done!", "It was succesfully deleted!", "success");
//                 setTimeout(function(){
//                 window.location.reload(1);
//                 }, 1000);
                
//             },
//             error: function (xhr, ajaxOptions, thrownError) {
//                 swal("Error deleting!", "Please try again", "error"); 
                
//             }
//         });
//     });
// }

//====================================================================


function editSteward(ids)
{
    var base_url = $.cookie("base_url");
    var ids = ids;
    //alert(ids);
   
    $.ajax({
        url: base_url+"wizard/editSteward/"+ids,
        type: 'POST',
        dataType: "json",
        data: {'ids': ids},  
        success:function(data)
        { 
             
             $('#steward-modal').modal('hide');
             $('#edit-steward').modal('show');
             $('#edit-steward').html('');
             $('#edit-steward').html(data.item);
        }      
    });
}

//this need remove
// $('#edit_steward').click(function(){
//     var base_url = $.cookie("base_url");
//    var stewardID = $("#stewardID").val();
   
//     $.ajax({
//         url: base_url+"wizard/updateSteward",
//         type: 'POST',
//         dataType: "json",
//         data: {stewardID : stewardID},
//         success:function(data)
//         { 
//           alert(data); 
//         }      
//     });
// });

// function stewardDelete(steward_id) {
//     var base_url = $.cookie("base_url");
//     //alert(steward_id); 
//     swal({
//         title: "Are you sure?",
//         text: "This steward will be deleted and cannot be recovered!",
//         type: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#DD6B55",
//         confirmButtonText: "Yes, delete it!",
//         closeOnConfirm: false
//          }, function (isConfirm) {
//             //alert(isConfirm); 
//         if (!isConfirm) return;

//         $.ajax({
//             url: base_url+"wizard/stewardDelete",
//             type: 'POST',
//             dataType: "json",
//             data: {'steward_id': steward_id},  
            
//         success: function(msg) {
//             swal("Done!", "It was succesfully deleted!", "success");
//                 setTimeout(function(){
//                 window.location.reload(1);
//                 }, 1000);
                
//             },
//             error: function (xhr, ajaxOptions, thrownError) {
//                 swal("Error deleting!", "Please try again", "error"); 
                
//             }
//         });
//     });
// }

//====================================================================

function editCategory(idc)
{
    var base_url = $.cookie("base_url");
    var idc = idc;
    //alert(idc);
   
    $.ajax({
        url: base_url+"wizard/editCategory/"+idc,
        type: 'POST',
        dataType: "json",
        data: {'idc': idc},  
        success:function(data)
        { 
            $('#category-modal').modal('hide');
            $('#edit-category').modal('show');
            $('#edit-category').html('');
            $('#edit-category').html(data.item);
            $('#edit-category').html(data.item);
            //$('#edit-category').hide();
        }      
    });
}





//this need remove
// $('#edit_category').click(function(){
//     var base_url = $.cookie("base_url");
//    var categoryID = $("#categoryID").val();
   
//     $.ajax({
//         url: base_url+"wizard/updateCategory",
//         type: 'POST',
//         dataType: "json",
//         data: {categoryID : categoryID},
//         success:function(data)
//         { 
//           alert(data); 
//         }      
//     });
// });


// function categoryDelete(category_id) {
//     //alert(category_id);
//     var base_url = $.cookie("base_url"); 
//     swal({
//         title: "Are you sure?",
//         text: "This category will be deleted and cannot be recovered!",
//         type: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#DD6B55",
//         confirmButtonText: "Yes, delete it!",
//         closeOnConfirm: false
//          }, function (isConfirm) {
//             //alert(isConfirm); 
//         if (!isConfirm) return;

//         $.ajax({
//             url: base_url+"wizard/categoryDelete",
//             type: 'POST',
//             dataType: "json",
//             data: {'category_id': category_id},  
            
//         success: function(msg) {
//             swal("Done!", "It was succesfully deleted!", "success");
//                 setTimeout(function(){
//                 window.location.reload(1);
//                 }, 1000);
                
//             },
//             error: function (xhr, ajaxOptions, thrownError) {
//                 swal("Error deleting!", "Please try again", "error"); 
                
//             }
//         });
//     });
// }


function editMenu(menuid)
{
    var base_url = $.cookie("base_url");
    var idc = menuid;
   
    $.ajax({
        url: base_url+"wizard/editMenu/"+idc,
        type: 'POST',
        dataType: "json",
        data: {'idc': idc},  
        success:function(data)
        { 
            $('#menu-modal').modal('hide');
            $('#edit-menu').modal('show');
            $('#edit-menu').html('');
            $('#edit-menu').html(data.item);
            $('#edit-menu').html(data.item);
            //$('#edit-category').hide();
        }      
    });
}

//====================================================================