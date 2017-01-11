// Javascript for POS Bill Design page

$(document).ready(function() { 
	var base_url = $.cookie("base_url");
	
   $('#material').change(function()
    {
        $("#left_stock").html('');
        var material_id=$(this).val();
        var material_text=$('option:selected',$(this)).text();

        if(material_id !="")
    {
        $.ajax({
            url: base_url+"pos_material_issue/get_total_in_stock_material",
            type: 'POST',
            data: {'material_id': material_id},  
            
            success: function(msg) {
            var msd_array=msg.split('====');
            if(msd_array[1] <= 0) 
            { swal("ERROR!", "No Available of stock for "+material_text+"!.", "error"); $('#hidden_left_stock').val(0);
            $('.submit_issue_material').prop('disabled', true);
            $("#quantity").prop('disabled', true);
            }
            if( msd_array[1] > 0 ) { $("#left_stock").html('Available Stock of '+material_text+' '+msd_array[1]+' '+msd_array[0]);  $('#hidden_left_stock').val(msd_array[1]);
            $('.submit_issue_material').prop('disabled', false); $("#quantity").prop('disabled', false);}
                
            },
            error: function (xhr, ajaxOptions, thrownError) {
            alert("ERROR:" + xhr.responseText+" - "+thrownError);
                
            }
        });
    }
    else
    {       
            $('.submit_issue_material').prop('disabled', true);
    }


    });
    
    $("#quantity").keyup(function()
    {
            var quantity_value=$(this).val();
            var hidden_left_stock=$('#hidden_left_stock').val();
            if( quantity_value =="") { quantity_value=0;}

            if( parseInt(quantity_value) > parseInt(hidden_left_stock )) {  $(this).val(0); $('.submit_issue_material').prop('disabled', true);}
            else{ $('.submit_issue_material').prop('disabled', false);}
    });
        $("#material_issue_form").validate({ 
         rules: {
            
            store: {
                required: true
            },
            material: {
                required: true
            },
            quantity: {
                required: true,                     
                maxlength: 6,
                minlength: 1,
                number: true
            },
            unit: {
                required: true
            }
            
         },
         messages: {
            store: {
                    required: "Please select a store"
                },
            material: {
                    required: "Please select a material"
                },    
            quantity: {
                    required: "Please enter quantity",
                    number: "Please specify a number"
                },
            unit: {
                    required: "Please select an unit"
                }              
         },
      /*   submitHandler: function(form) {
            var store = $('#store').val();
            var material = $('#material').val();
            var quantity = $('#quantity').val();
            var unit = $('#unit').val();

        var dataString = 'store='+ store
                        + '&material=' +material
                        + '&quantity=' + quantity
                        + '&unit=' + unit

        //alert(dataString);
       
            $.ajax({
                    type: 'POST',
                    url: base_url+"pos_material_issue/issue_material",
                    data: dataString,
                    dataType: "json",
                    success:function(data)
                    { 
                        //alert(data.item);
                        //$('#bill_preview').html(data.item);
                    }      
                });
        }*/
        
    });

});



function materialDelete(issue_material_id) {
    var base_url = $.cookie("base_url");
    //alert(issue_material_id); 
    swal({
        title: "Are you sure?",
        text: "This material will be deleted and cannot be recovered!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
         }, function (isConfirm) {
            //alert(isConfirm); 
        if (!isConfirm) return;

        $.ajax({
            url: base_url+"pos_material_issue/material_delete",
            type: 'POST',
            dataType: "json",
            data: {'issue_material_id': issue_material_id},  
            
        success: function(msg) {
            swal("Done!", "It was succesfully deleted!", "success");
                setTimeout(function(){
                window.location.reload(1);
                }, 1000);
                
            },
            error: function (xhr, ajaxOptions, thrownError) {
                swal("Error deleting!", "Please try again", "error"); 
                
            }
        });
    });
}