$(document).ready(function()
{
jQuery.fn.ForceAlphaNumericOnly =
    function()
    {     
       return this.each(function()
        {
            $(this).keydown(function(e)
            {
                var key = e.charCode || e.keyCode || 0;
                // allow backspace, tab, delete, arrows, letters, numbers and keypad numbers ONLY
                return (
                    key == 8 || 
                    key == 9 ||
                    key == 46 ||
                    key == 32 ||
                    (key >= 37 && key <= 40) ||
                    //(key >= 48 && key <= 57) ||
                    (key >= 65 && key <= 90) ||
                    (key >= 96 && key <= 105));
            })
        })
};
$('#restaurant_name').ForceAlphaNumericOnly();

$(document).on('keydown', '#restaurant_name', function(e){ 
            if (e.which === 32 &&  e.target.selectionStart === 0){
             $('#guest_error').html("First character cannot be blank!").show().fadeOut("slow");         
                return false;             
            } 
})


jQuery.validator.addMethod("multiephone", function (value, element) {
    if (this.optional(element)) {
    return true;
    }

    var phones = value.split(','),
    valid = true;

    for (var i = 0, limit = phones.length; i < limit; i++) {
    value = phones[i];
    valid = valid && jQuery.validator.methods.number.call(this, value, element) && value.length == 10;
    }

    return valid;
    }, "Invalid Phone format: please use a comma to separate multiple Phone No of 10 digits.");

	$('#table_message').hide();
	$('#steward_message').hide();
	$('#category_message').hide();
	$('#menu_message').hide();


 $('#basic').validate({
  rules: {
    	vat_value: {
				        required: true,
				        number: true,
				        min: 0,
				        max: 100,
            }, 
        alcholic_beverages_vat: {
				        required: true,
				        number: true,
				        min: 0,
				        max: 100,
		},    
		service_charge: {
				        required: true,
				        number: true,
				        min: 0,
				        max: 100,
		},
		room_service_charge: {
				        required: true,
				        number: true,
				        min: 0,
				        max: 100,
		}, 
		service_tax: {
				        required: true,
				        number: true,
				        min: 0,
				        max: 100,

		},
		restaurant_phone: {
	                    required: true,
	                    multiephone:true,
		}  
  },
  
  highlight: function(element) {
    $(element).closest('.control-group').removeClass('success').addClass('error');
  },
  success: function(element) {
    element
    .text('').addClass('valid')
    .closest('.control-group').removeClass('error').addClass('success');
  }       
        });


	$(document).on('click', '#add_table_button', function(){

		var status=true;
		var total_row=$('#rowID').val();
 		var no_of_table_show_string="";
 		var check_table_no=[];
		for (var i=1;i <= total_row ;i++)
		{
			var table_number=$('#table_number_'+i).val();
			var no_of_seats=$('#no_of_seats_'+i).val();
			if(table_number =="") { $('#table_number_error_'+i).html('Please enter table number'); status=false;}else{ $('#table_number_error_'+i).html('');status=true;}
			if(no_of_seats =="") { $('#no_of_seats_error_'+i).html('Please enter no of seats'); status=false;}else{ $('#no_of_seats_error_'+i).html(''); status=true;}
			no_of_table_show_string=no_of_table_show_string+table_number+",";
			check_table_no.push({"id" : i ,"table_number":table_number });
	    }

		no_of_table_show_string = no_of_table_show_string.substring(0, no_of_table_show_string.length - 1);

		//var status=$('#table_form').valid();
        if(status==true){
		var formdata=$('#table_form').serialize();
		
		var url=$.cookie("base_url");

		$.ajax({
		type: "POST",
		dataType: "json",
		url: url+"wizard/addTable",
		data: formdata, // serializes the form's elements.
		success: function(data)
		{
		var modal_table_body_head='<thead><tr><th>Table Number</th><th>Number of Seats</th><th>Manage</th></tr></thead><tbody id="modal_table_body_tbody"><tbody>';
		var table_message_contain='<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>Table number '+no_of_table_show_string+' was added Successfully';
		$('#table_message').html('')
		$('#table_message').html(table_message_contain)
		$('#table_message').show();
		$('#modal_table_body').html('');
		$('#modal_table_body').append(modal_table_body_head);
		$('#modal_table_body_tbody').html('');
		$.each(data, function (index, valueobj) {
		var add_row_table='<tr><td>'+data[index]["pos_table_number"]+'</td><td>'+data[index]["no_of_seats"]+'</td><td><div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Manage <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#"  data-toggle="modal" onclick="editTable('+data[index]["pos_table_id"]+')" data-target="#edit-table">Edit</a></li><li><a onclick="tableDelete('+data[index]["pos_table_id"]+')" href="javascript:void(0)">Delete</a></li></ul></div></td></tr>';
		$('#modal_table_body_tbody').append(add_row_table);
		});
		$('#table_form')[0].reset(); // show response from the php script.
		}
		});

	    }
	});


   $(document).on('click', '#edit_table', function(){

		var formdata=$('#table_form_edit').serialize();
		
		var url=$.cookie("base_url");

		$.ajax({
		type: "POST",
		dataType: "json",
		url: url+"wizard/updateTable",
		data: formdata, // serializes the form's elements.
		success: function(data)
		{
		$('#edit-table').modal('hide');
		var modal_table_body_head='<thead><tr><th>Table Number</th><th>Number of Seats</th><th>Manage</th></tr></thead><tbody id="modal_table_body_tbody"><tbody>';
		var table_message_contain='<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>Table was updated Successfully';
		$('#table_message').html('')
		$('#table_message').html(table_message_contain)
		$('#table_message').show()
		$('#modal_table_body').html('');
		$('#modal_table_body').append(modal_table_body_head);
		$('#modal_table_body_tbody').html('');
		$.each(data, function (index, valueobj) {
		var add_row_table='<tr><td>'+data[index]["pos_table_number"]+'</td><td>'+data[index]["no_of_seats"]+'</td><td><div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Manage <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#"  data-toggle="modal" onclick="editTable('+data[index]["pos_table_id"]+')" data-target="#edit-table">Edit</a></li><li><a onclick="tableDelete('+data[index]["pos_table_id"]+')" href="javascript:void(0)">Delete</a></li></ul></div></td></tr>';
		$('#modal_table_body_tbody').append(add_row_table);
			});
		$('#table_form')[0].reset();  // show response from the php script.
		}
		});

	});
$(document).on('click', '#add_steward_button', function(){

		//var status=$('#steward_form').valid();
        var status=true;
		var total_row=$('#rowStewardID').val();
 		var no_of_Steward_show_string="";
		for (var i=1;i <= total_row ;i++)
		{
			var steward_name=$('#steward_name_'+i).val();
			var steward_phone=$('#steward_phone_'+i).val();
			if(steward_name =="") { $('#steward_name_error_'+i).html('Please enter steward name'); status=false;}else{ $('#steward_name_error_'+i).html('');status=true;}
			if(steward_phone =="") { $('#steward_phone_error_'+i).html('Please enter steward phone number'); status=false;}else{ $('#steward_phone_error_'+i).html(''); status=true;}
			no_of_Steward_show_string=no_of_Steward_show_string+steward_name+",";
	    }
		no_of_Steward_show_string = no_of_Steward_show_string.substring(0, no_of_Steward_show_string.length - 1);
		if(status==true){
		var formdata=$('#steward_form').serialize();
		
		var url=$.cookie("base_url");

		$.ajax({
		type: "POST",
		dataType: "json",
		url: url+"wizard/addSteward",
		data: formdata, // serializes the form's elements.
		success: function(data)
		{
		var modal_table_body_head='<thead><tr><th>Steward Name</th><th>Steward Phone Number</th><th>Manage</th></tr></thead><tbody id="modal_steward_body_tbody"><tbody>';
        var table_message_contain='<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>Steward  '+no_of_Steward_show_string+'  was added successfully';
        $('#steward_message').html('')
		$('#steward_message').html(table_message_contain)
		$('#steward_message').show();
		$('#modal_steward_body').html('');
		$('#modal_steward_body').append(modal_table_body_head);
		$('#modal_steward_body_tbody').html('');
		$.each(data, function (index, valueobj) {
	    var add_row_table='<tr><td>'+data[index]["steward_name"]+'</td><td>'+data[index]["steward_phone_no"]+'</td><td><div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Manage <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#"  data-toggle="modal" onclick="editSteward('+data[index]["steward_id"]+')">Edit</a></li><li><a onclick="stewardDelete('+data[index]["steward_id"]+')" href="javascript:void(0)">Delete</a></li></ul></div></td></tr>';
		$('#modal_steward_body_tbody').append(add_row_table);
			});
		$('#steward_form')[0].reset(); // show response from the php script.
		}
		});

	    }
});

$(document).on('click', '#edit_steward', function(){

		var formdata=$('#steward_form_edit').serialize();
		
		var url=$.cookie("base_url");

		$.ajax({
		type: "POST",
		dataType: "json",
		url: url+"wizard/updateSteward",
		data: formdata, // serializes the form's elements.
		success: function(data)
		{
		$('#edit-steward').modal('hide');
		var modal_table_body_head='<thead><tr><th>Steward Name</th><th>Steward Phone Number</th><th>Manage</th></tr></thead><tbody id="modal_steward_body_tbody"><tbody>';
        var table_message_contain='<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>Steward  was Updated successfully';
        $('#steward_message').html('')
		$('#steward_message').html(table_message_contain)
		$('#steward_message').show();
		$('#modal_steward_body').html('');
		$('#modal_steward_body').append(modal_table_body_head);
		$('#modal_steward_body_tbody').html('');
		$.each(data, function (index, valueobj) {
	    var add_row_table='<tr><td>'+data[index]["steward_name"]+'</td><td>'+data[index]["steward_phone_no"]+'</td><td><div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Manage <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#"  data-toggle="modal" onclick="editSteward('+data[index]["steward_id"]+')" >Edit</a></li><li><a onclick="stewardDelete('+data[index]["steward_id"]+')" href="javascript:void(0)">Delete</a></li></ul></div></td></tr>';
		$('#modal_steward_body_tbody').append(add_row_table);
			});
		$('#steward_form')[0].reset(); // show response from the php script.
		}
		});

	});

$(document).on('click', '#add_category_button', function(){

		var status=$('#category_form').valid();
		var category_name=$('#category_name').val();
        if(status==true){
		var formdata=$('#category_form').serialize();
		
		var url=$.cookie("base_url");

		$.ajax({
		type: "POST",
		dataType: "json",
		url: url+"wizard/addCategory",
		data: formdata, // serializes the form's elements.
		success: function(data)
		{
		var modal_table_body_head='<thead><tr><th>Category Name/th><th>Category Rank</th><th>Category Description</th><th>Manage</th></tr></thead><tbody id="modal_category_body_tbody"><tbody>';
        var table_message_contain='<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>Category '+category_name+' was added successfully';
        $('#category_message').html('')
		$('#category_message').html(table_message_contain)
		$('#category_message').show();
		var category_select_box='<select aria-invalid="false" aria-required="true" class="form-control valid" id="category_id" name="category_id" required=""><option value="">Select</option>';
		
		$('#modal_category_body').html('');
		$('#modal_category_body').append(modal_table_body_head);
		$('#modal_category_body_tbody').html('');
		$.each(data, function (index, valueobj) {
	    var add_row_table='<tr><td>'+data[index]["category_name"]+'</td><td>'+data[index]["category_rank"]+'</td><td>'+data[index]["category_description"]+'</td><td><div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Manage <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#"  data-toggle="modal" onclick="editCategory('+data[index]["category_id"]+')" >Edit</a></li><li><a onclick="categoryDelete('+data[index]["category_id"]+')" href="javascript:void(0)">Delete</a></li></ul></div></td></tr>';
		$('#modal_category_body_tbody').append(add_row_table);
		var category_option_box='<option value="'+data[index]["category_id"]+'">'+data[index]["category_name"]+'</option>';
		category_select_box=category_select_box+category_option_box;
	    });
		$('#all_list_category').html(category_select_box);
		$('#category_form')[0].reset(); // show response from the php script.
		}
		});

	    }
});

$(document).on('click', '#edit_category', function(){

		var formdata=$('#category_form_edit').serialize();
		
		var url=$.cookie("base_url");

		$.ajax({
		type: "POST",
		dataType: "json",
		url: url+"wizard/updateCategory",
		data: formdata, // serializes the form's elements.
		success: function(data)
		{
		var modal_table_body_head='<thead><tr><th>Category Name/th><th>Category Rank</th><th>Category Description</th><th>Manage</th></tr></thead><tbody id="modal_category_body_tbody"><tbody>';
        var table_message_contain='<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>Category  Was Updated successfully';
        $('#category_message').html('')
		$('#category_message').html(table_message_contain)
		$('#category_message').show();
		$('#edit-category').modal('hide');
		var category_select_box='<select aria-invalid="false" aria-required="true" class="form-control valid" id="category_id" name="category_id" required=""><option value="">Select</option>';
		$('#modal_category_body').html('');
		$('#modal_category_body').append(modal_table_body_head);
		$('#modal_category_body_tbody').html('');
		$.each(data, function (index, valueobj) {
	    var add_row_table='<tr><td>'+data[index]["category_name"]+'</td><td>'+data[index]["category_rank"]+'</td><td>'+data[index]["category_description"]+'</td><td><div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Manage <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#"  data-toggle="modal" onclick="editCategory('+data[index]["category_id"]+')" >Edit</a></li><li><a onclick="categoryDelete('+data[index]["category_id"]+')" href="javascript:void(0)">Delete</a></li></ul></div></td></tr>';
		$('#modal_category_body_tbody').append(add_row_table);			
		var category_option_box='<option value="'+data[index]["category_id"]+'">'+data[index]["category_name"]+'</option>';
		category_select_box=category_select_box+category_option_box;
		});
		$('#all_list_category').html(category_select_box);
		$('#category_form')[0].reset();  // show response from the php script.
		}
		});

	});

$(document).on('click', '#add_menu_button', function(){

		var status=$('#menu_form').valid();
		var menu_name=$('#menu_name').val();
        if(status==true){
		var formdata=$('#menu_form').serialize();
		
		var url=$.cookie("base_url");

		$.ajax({
		type: "POST",
		dataType: "json",
		url: url+"wizard/addMenu",
		data: formdata, // serializes the form's elements.
		success: function(data)
		{
         var modal_table_body_head='<thead><tr><th>Category Name</th><th>Menu Name</th><th>Menu Description</th><th>Manage</th></tr></thead><tbody id="modal_menu_body_tbody"><tbody>';
         var table_message_contain='<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>Menu '+menu_name+' Was added successfully';
        $('#menu_message').html('')
		$('#menu_message').html(table_message_contain)
		$('#menu_message').show();
			$('#modal_menu_body').html('');
		    $('#modal_menu_body').append(modal_table_body_head);
		    $('#modal_menu_body_tbody').html('');
		    $.each(data, function (index, valueobj) {
	    	var add_row_table='<tr><td>'+data[index]["category_name"]+'</td><td>'+data[index]["menu_name"]+'</td><td>'+data[index]["menu_description"]+'</td><td><div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Manage <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#"  data-toggle="modal" onclick="editMenu('+data[index]["menu_item_id"]+')" >Edit</a></li><li><a onclick="MenuDelete('+data[index]["menu_item_id"]+')" href="javascript:void(0)">Delete</a></li></ul></div></td></tr>';
			$('#modal_menu_body_tbody').append(add_row_table);			
			});
		$('#menu_form')[0].reset();  // show response from the php script.
		}
		});

	    }
});

$(document).on('click', '#edit_menu', function(){

		var formdata=$('#menu_form_edit').serialize();
		
		var url=$.cookie("base_url");

		$.ajax({
		type: "POST",
		dataType: "json",
		url: url+"wizard/updateMenu",
		data: formdata, // serializes the form's elements.
		success: function(data)
		{
		var modal_table_body_head='<thead><tr><th>Category Name</th><th>Menu Name</th><th>Menu Description</th><th>Manage</th></tr></thead><tbody id="modal_menu_body_tbody"><tbody>';
        var table_message_contain='<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>Menu  Was Updated successfully';
        $('#menu_message').html('')
		$('#menu_message').html(table_message_contain)
		$('#menu_message').show();
		$('#edit-category').modal('hide');
		    $('#modal_menu_body').html('');
		    $('#modal_menu_body').append(modal_table_body_head);
		    $('#modal_menu_body_tbody').html('');
		    $.each(data, function (index, valueobj) {
	    	var add_row_table='<tr><td>'+data[index]["category_name"]+'</td><td>'+data[index]["menu_name"]+'</td><td>'+data[index]["menu_description"]+'</td><td><div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Manage <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#"  data-toggle="modal" onclick="editMenu('+data[index]["menu_item_id"]+')" >Edit</a></li><li><a onclick="MenuDelete('+data[index]["menu_item_id"]+')" href="javascript:void(0)">Delete</a></li></ul></div></td></tr>';
			$('#modal_menu_body_tbody').append(add_row_table);			
			});
		$('#menu_form')[0].reset();  // show response from the php script.
		}
		});

	});

});

function tableDelete(table_id) {
    //alert(table_id); 
     var base_url = $.cookie("base_url");
    swal({
        title: "Are you sure?",
        text: "This Table will be deleted and cannot be recovered.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
         }, function (isConfirm) {
            //alert(isConfirm); 
        if (!isConfirm) return;

        $.ajax({
            url: base_url+"wizard/tableDelete",
            type: 'POST',
            dataType: "json",
            data: {'table_id': table_id},  
            
        success: function(data) {
            swal("Done!", "Table was succesfully deleted!", "success");
		
			var modal_table_body_head='<thead><tr><th>Table Number</th><th>Number of Seats</th><th>Manage</th></tr></thead><tbody id="modal_table_body_tbody"><tbody>';
			var table_message_contain='<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>Table was deleted successfully';
			//$('#table_message').html('')
			//$('#table_message').html(table_message_contain)
			//$('#table_message').show()
			$('#modal_table_body').html('');
			$('#modal_table_body').append(modal_table_body_head);
			$('#modal_table_body_tbody').html('');
			$.each(data, function (index, valueobj) {
			var add_row_table='<tr><td>'+data[index]["pos_table_number"]+'</td><td>'+data[index]["no_of_seats"]+'</td><td><div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Manage <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#"  data-toggle="modal" onclick="editTable('+data[index]["pos_table_id"]+')" >Edit</a></li><li><a onclick="tableDelete('+data[index]["pos_table_id"]+')" href="javascript:void(0)">Delete</a></li></ul></div></td></tr>';
			$('#modal_table_body_tbody').append(add_row_table);
			});             
            },
            error: function (xhr, ajaxOptions, thrownError) {
                swal("Error deleting!", "Please try again", "error"); 
                
            }
        });
    });
}
function stewardDelete(steward_id) {
    var base_url = $.cookie("base_url");
    //alert(steward_id); 
    swal({
        title: "Are you sure?",
        text: "This steward will be deleted and cannot be recovered!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
         }, function (isConfirm) {
            //alert(isConfirm); 
        if (!isConfirm) return;

        $.ajax({
            url: base_url+"wizard/stewardDelete",
            type: 'POST',
            dataType: "json",
            data: {'steward_id': steward_id},  
            
        success: function(data) {
            swal("Done!", "Steward was succesfully deleted!", "success");

            var modal_table_body_head='<thead><tr><th>Steward Name</th><th>Steward Phone Number</th><th>Manage</th></tr></thead><tbody id="modal_steward_body_tbody"><tbody>';
        	var table_message_contain='<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>Steward was deleted successfully';
        	//$('#steward_message').html('')
			//$('#steward_message').html(table_message_contain)
			//$('#steward_message').show();
			$('#modal_steward_body').html('');
			$('#modal_steward_body').append(modal_table_body_head);
			$('#modal_steward_body_tbody').html('');
			$.each(data, function (index, valueobj) {
	    	var add_row_table='<tr><td>'+data[index]["steward_name"]+'</td><td>'+data[index]["steward_phone_no"]+'</td><td><div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Manage <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#"  data-toggle="modal" onclick="editSteward('+data[index]["steward_id"]+')" >Edit</a></li><li><a onclick="stewardDelete('+data[index]["steward_id"]+')" href="javascript:void(0)">Delete</a></li></ul></div></td></tr>';
			$('#modal_steward_body_tbody').append(add_row_table);
			//modal_table
			});
            },
            error: function (xhr, ajaxOptions, thrownError) {
                swal("Error deleting!", "Please try again", "error"); 
                
            }
        });
    });
}
function categoryDelete(category_id) {
    //alert(category_id);
    var base_url = $.cookie("base_url"); 
    swal({
        title: "Are you sure?",
        text: "This category will be deleted and cannot be recovered!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
         }, function (isConfirm) {
            //alert(isConfirm); 
        if (!isConfirm) return;

        $.ajax({
            url: base_url+"wizard/categoryDelete",
            type: 'POST',
            dataType: "json",
            data: {'category_id': category_id},  
            
        success: function(data) {
            swal("Done!", "Category was succesfully deleted!", "success");

            var modal_table_body_head='<thead><tr><th>Category Name<th>Category Rank</th><th>Category Description</th><th>Manage</th></tr></thead><tbody id="modal_category_body_tbody"><tbody>';
        	var table_message_contain='<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>Category  Was Deleted successfully';
        	//$('#category_message').html('')
			//$('#category_message').html(table_message_contain)
			//$('#category_message').show();
			$('#modal_category_body').html('');
			$('#modal_category_body').append(modal_table_body_head);
		    $('#modal_category_body_tbody').html('');
			var category_select_box='<select aria-invalid="false" aria-required="true" class="form-control valid" id="category_id" name="category_id" required=""><option value="">Select</option>';

			$.each(data, function (index, valueobj) {
	    	var add_row_table='<tr><td>'+data[index]["category_name"]+'</td><td>'+data[index]["category_rank"]+'</td><td>'+data[index]["category_description"]+'</td><td><div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Manage <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#"  data-toggle="modal" onclick="editCategory('+data[index]["category_id"]+')" >Edit</a></li><li><a onclick="categoryDelete('+data[index]["category_id"]+')" href="javascript:void(0)">Delete</a></li></ul></div></td></tr>';
			$('#modal_category_body_tbody').append(add_row_table);
			var category_option_box='<option value="'+data[index]["category_id"]+'">'+data[index]["category_name"]+'</option>';
			category_select_box=category_select_box+category_option_box;
			});
			$('#all_list_category').html(category_select_box);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                swal("Error deleting!", "Please try again", "error"); 
                
            }
        });
    });
}
function MenuDelete(menu_id) {
    var base_url = $.cookie("base_url");
    //alert(steward_id); 
    swal({
        title: "Are you sure?",
        text: "This steward will be deleted and cannot be recovered!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
         }, function (isConfirm) {
            //alert(isConfirm); 
        if (!isConfirm) return;

        $.ajax({
            url: base_url+"wizard/MenuDelete",
            type: 'POST',
            dataType: "json",
            data: {'menu_id': menu_id},  
            
        success: function(data) {
            swal("Done!", "Steward was succesfully deleted!", "success");

    		var modal_table_body_head='<thead><tr><th>Category Name</th><th>Menu Name</th><th>Menu Description</th><th>Manage</th></tr></thead><tbody id="modal_menu_body_tbody"><tbody>';
		    $('#modal_menu_body').html('');
		    $('#modal_menu_body').append(modal_table_body_head);
		    $('#modal_menu_body_tbody').html('');
		    $.each(data, function (index, valueobj) {
	    	var add_row_table='<tr><td>'+data[index]["category_name"]+'</td><td>'+data[index]["menu_name"]+'</td><td>'+data[index]["menu_description"]+'</td><td><div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Manage <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#"  data-toggle="modal" onclick="editMenu('+data[index]["menu_item_id"]+')" >Edit</a></li><li><a onclick="MenuDelete('+data[index]["menu_item_id"]+')" href="javascript:void(0)">Delete</a></li></ul></div></td></tr>';
			$('#modal_menu_body_tbody').append(add_row_table);			
			});
            },
            error: function (xhr, ajaxOptions, thrownError) {
                swal("Error deleting!", "Please try again", "error"); 
                
            }
        });
    });
}
function get_table_number(id)
{
    var table_no=$('#'+id).val();
    var base_url = $.cookie("base_url"); 
   	var position=1; 

   	 $.ajax({
            url: base_url+"wizard/check_value_insert_table",
            type: 'POST',
            dataType: "json",
            data: {'formid': 'table_form','position':position,'data_check': table_no},
            success: function(data) {
            if(data !=0){ 		
            var table_message_contain='<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>Table Number '+table_no+' already exists.';
		    $('#table_message_danger').html('')
		    $('#table_message_danger').html(table_message_contain)
		    $('#table_message_danger').show() 
		    $('#add_table_button').hide();
		     }
		     else { $('#table_message_danger').html('');  $('#table_message_danger').hide(); $('#add_table_button').show(); }
            }
        });
}
function get_steward_name(id)
{
     
    var steward_name=$('#'+id).val();
    var base_url = $.cookie("base_url"); 
   	var position=1; 

   	 $.ajax({
            url: base_url+"wizard/check_value_insert_table",
            type: 'POST',
            dataType: "json",
            data: {'formid': 'steward_form','position':position,'data_check': steward_name},
            success: function(data) {
             
            if(data !=0){ 		
            var steward_message_contain='<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>Steward Name '+steward_name+' already exists.';
		    $('#steward_message_danger').html('')
		    $('#steward_message_danger').html(steward_message_contain)
		    $('#steward_message_danger').show() 
		    $('#add_steward_button').hide();
		     }
		     else { $('#steward_message_danger').html('');  $('#steward_message_danger').hide(); $('#add_steward_button').show(); }
            }
        });
}
