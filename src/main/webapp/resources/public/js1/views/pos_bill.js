$(document).ready(function(){ 
    var url = window.location;
    var base_url = url.protocol + "//" + url.host + "/" + url.pathname.split('/')[1];

$('.bill_payment_details').click(function()
{
    var id=$(this).attr('id');
    var pos_bill_id=id.split('_');
    $('#hid_pos_bill').val(0);
    $('#hid_pos_bill').val(pos_bill_id[1]);
    var allpos_master_order= allpos_master_order_new;
    var item_value_array_filter=getObjects(allpos_master_order, 'pos_bill_no',pos_bill_id[1]);
    var allmenu_by_category_array=JSON.stringify(item_value_array_filter);
    $.each(item_value_array_filter, function (index, valueobj) {
    $("#bill_payment_title").html('Bill No '+valueobj['pos_bill_no']+' - Enter Payment Details');
    $('#bill_guest_details').html('<b>Guest name:</b> '+valueobj['pos_guest_name']);
    $('#total_payable').html('<b>Total Amount:</b> Rs. '+Math.round(valueobj['pos_total_after_discount']));
    $('#pending_amount').html('<b>Pending Amount:</b> Rs. '+Math.round(valueobj['pos_total_after_discount']));
    $('#pending_amount_id').val(Math.round(valueobj['pos_total_after_discount']));

   });  
   if(pos_bill_id[0]==2 || pos_bill_id[0]==3) { $('#spot_settle_show').show();   $('.row.all_amount').show();
    $('#settle_bill_button').show();  $('#spot_settle').prop('checked', true); 
    $('#room_number_show').hide();
    $('#guest_details_show').hide();
    $('#post_to_room_button').hide(); 
    $('#room_number_id option:selected').removeAttr('selected');
    }else{
    $('#spot_settle_show').hide(); 
    $('#room_number_show').hide();
    $('#guest_details_show').hide();
    $('#post_to_room_button').hide();
     $('.row.all_amount').show();
    $('#settle_bill_button').show();   
    }
    $('#amount_0').val('');
    $('#add_payment_div').html('');
    $('#amount_error_0').html('');
    $('#num_div').val('1');
    $('#payment_details_modal').modal('show');
});

$(document).on('click', '#add_payment', function(){
var num_div=$('#num_div').val();
$('#add_payment_div').append('<div class="row" id="main_'+parseInt(num_div)+'"><div class="col-md-12"><div class="col-md-4"><div class="form-group"><label for="exampleInputEmail1">Amount</label><input type="text" class="form-control advance_amount" id="amount_'+parseInt(num_div)+'" placeholder=""><p id="amount_error_'+parseInt(num_div)+'" style="color:red;"></p></div></div><div class="col-md-4"><div class="form-group"><label for="exampleInputEmail1">Payment Type</label><select class="form-control" id="payment_type_'+parseInt(num_div)+'"><option>Cash</option><option>Debit Card</option><option>Credit Card</option><option>Netbanking</option></select></div></div><div class="col-md-4"><br><button type="button" class="btn btn-success" id="add_payment">+</button><button type="button" class="btn btn-danger" id="minus_payment" style="margin-left:5px;">-</button></div></div></div>');
num_div++;
$('#num_div').val(parseInt(num_div));
});


$(document).on('keyup', '.advance_amount', function(){
add_amount_on_pending_amount();
});

$(document).on('click', '#minus_payment', function(){ 
var num_div=$('#num_div').val();
$('#main_'+(parseInt(num_div)-1)).remove();
num_div--;
$('#num_div').val(parseInt(num_div));
add_amount_on_pending_amount();
});

$(document).on('change', '#room_number_id', function(){
    var roomno=$(this).val();

    if(roomno !="")
    {
    var allmenu_by_category_array= today_occupancy;
    var item_value_array_filter=getObjects(allmenu_by_category_array, 'rooms',roomno); 
    var allmenu_by_category_array=JSON.stringify(item_value_array_filter);

    $.each(item_value_array_filter, function (index, valueobj) {
    $("#guest_name_id").html(valueobj['guest_name']);
    $("#room_number").html(roomno);
    $("#bookingdate").html(valueobj['booking_date']);
    $("#bookingid").html(valueobj['booking_reference']);
    
    });  
    }
    else
    {
    $("#guest_name_id").html('');
    $("#room_number").html('');
    $("#bookingdate").html('');
    $("#bookingid").html('');   
    } 
});
$(".spot_settle_post_to_room").click(function(){

    var id=$(this).attr('id');
    //alert(id);
    if(id=='spot_settle')
    {
    $('#room_number_id option:selected').removeAttr('selected');
    $("#guest_name_id").html('');
    $("#room_number").html('');
    $("#bookingdate").html('');
    $("#bookingid").html(''); 
    $('.row.all_amount').show();
    $('#settle_bill_button').show();
    $('#room_number_show').hide();
    $('#guest_details_show').hide();
    $('#post_to_room_button').hide();
    }
    else
    {
    $('.row.all_amount').hide();
    $('#settle_bill_button').hide();
    $('#room_number_show').show();
    $('#guest_details_show').show();
    $('#post_to_room_button').show(); 
    }

});
$(document).on('click', '.btn.btn-success.submit_payment', function(){
    var url = window.location;
    var base_url = url.protocol + "//" + url.host + "/" + url.pathname.split('/')[1];

    var payment_mode=$(this).attr('id');
    var payment_array = [];
    var total_advance=0;
    var pending_amount=$('#pending_amount_id').val();
    var hid_pos_bill=$('#hid_pos_bill').val();
    var status=true;
    if(payment_mode=='settle_bill_button')
    {
     var num_div=$('#num_div').val();
     for(var i=0; i < parseInt(num_div); i++)
        {
        var amount=$('#amount_'+i).val();
        if(amount ==""  || amount == 0 ) { $('#amount_'+i).focus(); $('#amount_error_'+i).html('Please enter payable amount'); status=false;} else{$('#amount_error_'+i).html(''); status=true;}
        var payment_type=$('#payment_type_'+i).val(); 
        payment_array.push({'amount' :amount,'payment_type':payment_type});
        total_advance=total_advance+parseFloat(amount);
        }
     
    if(status == true){ 

         $.ajax({
             url:  base_url+"/pos_bill/addtransaction",
             type: "POST",
             data: { payment_array:payment_array,total_advance:total_advance,hid_pos_bill:hid_pos_bill,payment_mode:payment_mode },
             //dataType: 'json',
             success: function (data) { window.location.reload();  
             },error: function (xhr, ajaxOptions, thrownError) { swal("ERROR", "System Error", "error"); } //alert("ERROR:" + xhr.responseText+" - "+thrownError); }
          });
        } 
    }
    
    else
    {
     var roomno=$('#room_number_id').val();
     var guest_name_id=$('#guest_name_id').html(); 
     var booking_id=$("#bookingid").html(); 
     if(roomno !="" && booking_id !="" && hid_pos_bill != "") {

    swal({
        title: "Are you sure?",
        text: "This Bill will be posted to Room No "+roomno+"("+guest_name_id+") and you will not be able to 'Spot Settle' !",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Post To Room!",
        closeOnConfirm: false
         }, function (isConfirm) {
        if (!isConfirm) return; 
        $.ajax({
             url:  base_url+"/pos_bill/addtransaction",
             type: "POST",
             data: { booking_id:booking_id,hid_pos_bill:hid_pos_bill,pending_amount:pending_amount,roomno:roomno,payment_mode:payment_mode },
             success: function (data) {  window.location.reload();  
             },error: function (xhr, ajaxOptions, thrownError) {    swal("ERROR", "System Error", "error"); } //alert("ERROR:" + xhr.responseText+" - "+thrownError); }
          });
        
        
        });

        
        }
        else
        {
         swal("ERROR", "Please select room number !", "error"); 
 
        }

    }

});
$(".form-control.discount").keyup(function(){
    var id=$(this).attr('id');
    var idsplit=id.split('_');
    var total_payable_amount=$('#'+idsplit[0]+'_'+idsplit[1]+'_total_payable_amount').val();

    var total_payable_amount_html=$('#'+idsplit[0]+'_'+idsplit[1]+'_total_payable').html();
    var discount_type=idsplit[2]+'_'+idsplit[3];
    var total_payable_amount_after_discount=0;
    if(total_payable_amount_html !="") 
    {
    
    if(discount_type =="discount_amount") {             
    var discount_amount=$(this).val();  
    if(discount_amount == ""){ discount_amount=0;}
    if( parseFloat(discount_amount) > parseFloat(total_payable_amount)){ discount_amount=0; $(this).val(0); }
    total_payable_amount_after_discount=parseFloat(total_payable_amount)-parseFloat(discount_amount);
    var discount_amount_value=parseFloat((discount_amount*100)/total_payable_amount);
    $('#'+idsplit[0]+'_'+idsplit[1]+'_discount_percentage').val(parseFloat(discount_amount_value).toFixed(2));
    $('#'+idsplit[0]+'_'+idsplit[1]+'_total_payable').html(parseFloat(total_payable_amount_after_discount).toFixed(2));
    }
    if(discount_type =="discount_percentage") {  
    var discount_percentage=$(this).val();
    if(discount_percentage == ""){ discount_percentage=0;}  
    var discount_percentage_amount=(total_payable_amount*discount_percentage)/100;
    if(discount_percentage_amount  > total_payable_amount){ discount_percentage_amount=0; $(this).val(0); }
    total_payable_amount_after_discount=parseFloat(total_payable_amount)-parseFloat(discount_percentage_amount);
    $('#'+idsplit[0]+'_'+idsplit[1]+'_discount_amount').val(parseFloat(discount_percentage_amount).toFixed(2));
    $('#'+idsplit[0]+'_'+idsplit[1]+'_total_payable').html(parseFloat(total_payable_amount_after_discount).toFixed(2));
    }
    
    }
    //dine_in_discount_percentage
    //dine_in_total_payable_amount
});

$(document).on('change', '#table_no_id', function(){
    
        var allpos_order;
        var alltax_new;

         $.ajax({
             url:  base_url+"/pos_bill/get_latest_information",
             type: "POST",
             dataType: 'json',
             success: function (data) { allpos_order=data.allpos_order;  alltax_new=data.alltax;  
             }, async: false
          }); 


    var pos_table_id=$(this).val();
    var pos_table_text=$("#table_no_id option:selected").text();
    var grand_total=0;
    var vat_total_amount=0;
    var sub_total=0;
    var table_kot_no_string="";
    var kot_status=1;
    // var allpos_order= allpos_order_new;
    // var alltax=alltax_new;

    var allpos_order_filter=getObjects(allpos_order, 'pos_table_id',pos_table_id);
    //var allpos_order_filter1=getObjects(allpos_order_filter,'pos_payment_status','pending');
    var allpos_order_filter2=getObjects(allpos_order_filter,'pos_raised_bill_status','0');
    var allpos_order_filter3=getObjects(allpos_order_filter2,'pos_kot_delivered_status','1');
    var allpos_order_filter_array=JSON.stringify(allpos_order_filter3);

    if( pos_table_id !=""  && allpos_order_filter3 !="")
    {
    $("#table_dine_in tbody").html('');  
    $('#dine_in_total_payable_amount').val(0);
    $('#dine_in_discount_percentage').val(0);
    $('#dine_in_discount_amount').val(0);

    
    $.each(allpos_order_filter3, function (index, valueobj) {

    table_kot_no_string=table_kot_no_string+valueobj['pos_id']+",";
    $("#dine_in_guest_name").val('');
    $("#dine_in_guest_name").val(valueobj['pos_guest_name']);
    $("#dine_in_mobile_no").val('');
    $("#dine_in_mobile_no").val(valueobj['pos_mobile']);
    $("#dine_in_bill_no").html('');
    //$("#dine_in_bill_no").html(valueobj['pos_bill']);
    $("#dine_in_service_tax").html('');
    $("#dine_in_service_tax").html(alltax_new[0]['pos_bill_service_tax_value']);
    $("#dine_in_service_charge").html('');
    $("#dine_in_service_charge").html(alltax_new[0]['pos_bill_service_charge_value']);

    

    var vat_percentage=0;

    var vat_amount=0;
    if(valueobj['add_vat']=='Yes')
        {
        if( valueobj['alcholoc_beverage']=='1')
        {
        vat_amount=(valueobj['pos_order_total_price']*alltax_new[0]['pos_bill_alcholic_beverages_vat'])/100;
        vat_percentage=alltax_new[0]['pos_bill_alcholic_beverages_vat'];
        }
        else
        {
        vat_amount=(valueobj['pos_order_total_price']*alltax_new[0]['pos_bill_vat_value'])/100; 
        vat_percentage=alltax_new[0]['pos_bill_vat_value'];
        }
    }
    vat_total_amount=parseFloat(vat_total_amount)+parseFloat(vat_amount);  
    sub_total=parseFloat(sub_total)+parseFloat(valueobj['pos_order_total_price']);
    var rowvalue=1;
    var newRowContent='<tr ><td>'+(rowvalue)+'</td><td>'+valueobj['pos_id']+'</td><td>'+valueobj['menu_name']+'</td><td>'+valueobj['pos_order_rate']+'</td><td>'+valueobj['pos_order_quantity']+'</td><td>'+vat_percentage+'</td><td>'+parseFloat(vat_amount).toFixed(2)+'</td><td>'+parseFloat(valueobj['pos_order_total_price']).toFixed(2)+'</td></tr>';
    $("#table_dine_in tbody").append(newRowContent); rowvalue++
    });
    var total_sevice_tax=(sub_total*alltax_new[0]['pos_bill_service_tax_value'])/100;
    var total_sevice_charge=(sub_total*alltax_new[0]['pos_bill_service_charge_value'])/100;
    var total_tax=(parseFloat(vat_total_amount)+parseFloat(total_sevice_tax)+parseFloat(total_sevice_charge));
    var grand_total=parseInt(sub_total)+parseFloat(total_tax);
    // table_kot_no_string_temp =  $.unique(table_kot_no_string.split(','));
    // table_kot_no_string = table_kot_no_string_temp.join(",");
    // table_kot_no_string=table_kot_no_string.substring(0, table_kot_no_string.length - 1); 
    $('#dine_in_kot_no').val(table_kot_no_string);
    $('#dine_in_print_button').show();
    $('#dine_in_total_payable').html(grand_total);
    $('#dine_in_total_payable_amount').val(grand_total);
    }
    else
    {
    $("#table_dine_in tbody").html(''); 
    $("#dine_in_guest_name").val('');
    $("#dine_in_mobile_no").val('');
    $("#dine_in_bill_no").html('');
    $("#dine_in_service_tax").html('');
    $("#dine_in_service_charge").html('');
    $('#dine_in_total_payable').html('');
    $('#dine_in_print_button').hide();
    $('#dine_in_total_payable_amount').val(0);
    $('#dine_in_discount_percentage').val(0);
    $('#dine_in_discount_amount').val(0);
    if(pos_table_text !="select table") { swal("For Table "+pos_table_text+", KOT has not been marked as delivered", "Please go to Dashboard & mark it as delivered.", "error"); }
    }
  
}); 
$(document).on('click', '.print_bill', function(){
        var id=$(this).attr('id');  
        if( id =="dine_in_print_bill") 
        { 
            var kot_no_string=$('#dine_in_kot_no').val();
            var total_payable=$('#dine_in_total_payable_amount').val();
            var discount_percentage=$('#dine_in_discount_percentage').val();
            var discount_amount=$('#dine_in_discount_amount').val();
            var total_payable_discount=$('#dine_in_total_payable').html();
        }
        if( id =="room_service_print_bill") 
        { 
            var kot_no_string=$('#room_service_kot_no').val();
            var total_payable=$('#room_service_total_payable_amount').val();
            var discount_percentage=$('#room_service_discount_percentage').val();
            var discount_amount=$('#room_service_discount_amount').val();
            var total_payable_discount=$('#room_service_total_payable').html();
        }
        if( id =="take_away_print_bill") 
        { 
            var kot_no_string=$('#take_away_kot_no').val();
            var total_payable=$('#take_away_total_payable_amount').val();
            var discount_percentage=$('#take_away_discount_percentage').val();
            var discount_amount=$('#take_away_discount_amount').val();
            var total_payable_discount=$('#take_away_total_payable').html();
        }
        if(total_payable =="") { total_payable=0;}
        if(total_payable_discount =="") { total_payable_discount=0;}
        kot_no_string=kot_no_string.substring(0, kot_no_string.length - 1); 
        $.ajax({
        url:  base_url+"/pos_bill/pos_raised_bill",
        type: "POST",
        //dataType: 'json',
        data:{ order_type:id,kot_no:kot_no_string,total_payable:total_payable,discount_percentage:discount_percentage,discount_amount:discount_amount,total_payable_discount:total_payable_discount},
        success: function (data) { window.location.reload();  window.open(base_url+'/pos_bill/pos_print_bill/'+data, '_blank'); //window.location.href=base_url+'/pos_bill/pos_print_bill/'+data; 
        }, async: false
        }); 
});

$(document).on('keyup', '#get_bill_by_token_number', function(){
    var token_number=$(this).val();
    get_bill_information_by_token(token_number);
    
});
$(document).on('click', '#get_bill_by_token_number_span', function(){
    var token_number=$(this).html();
    get_bill_information_by_token(token_number);
    
});

$(document).on('change', '#room_service_room_number_id', function(){

    var allpos_order;
    var alltax_new;

         $.ajax({
             url:  base_url+"/pos_bill/get_latest_information",
             type: "POST",
             dataType: 'json',
             success: function (data) { allpos_order=data.allpos_order;  alltax_new=data.alltax;  
             }, async: false
          }); 


    var pos_room_number=$(this).val();
    var pos_room_number_text=$("#room_service_room_number_id option:selected").text();
    var grand_total=0;
    var vat_total_amount=0;
    var sub_total=0;
    var room_kot_no_string="";
    // var allpos_order= allpos_order_new;
    // var alltax=alltax_new;
    var allpos_order_filter=getObjects(allpos_order, 'pos_room_no',pos_room_number);
    var allpos_order_filter2=getObjects(allpos_order_filter,'pos_raised_bill_status','0');
    var allpos_order_filter3=getObjects(allpos_order_filter2,'pos_kot_delivered_status','1');
    var allpos_order_filter_array=JSON.stringify(allpos_order_filter2);
    if( pos_room_number !=""  && allpos_order_filter3 !="")
    {
    $("#table_room_service tbody").html('');
    $('#room_service_total_payable_amount').val(0);
    $('#room_service_discount_percentage').val(0);
    $('#room_service_discount_amount').val(0)  
    $.each(allpos_order_filter3, function (index, valueobj) {
    room_kot_no_string=room_kot_no_string+valueobj['pos_id']+",";
    $("#room_service_guest_name").val('');
    $("#room_service_guest_name").val(valueobj['pos_guest_name']);
    $("#room_service_mobile_no").val('');
    $("#room_service_mobile_no").val(valueobj['pos_mobile']);
    $("#room_service_bill_no").html('');
    //$("#room_service_bill_no").html(valueobj['pos_bill']);
    $("#dine_in_service_tax").html('');
    $("#room_service_service_tax").html(alltax_new[0]['pos_bill_service_tax_value']);
    $("#room_service_service_charge").html('');
    $("#room_service_service_charge").html(alltax_new[0]['pos_bill_service_charge_value']);
   
    var vat_percentage=0;

    var vat_amount=0;
    if(valueobj['add_vat']=='Yes')
    {
       if( valueobj['alcholoc_beverage']=='1')
      {
        vat_amount=(valueobj['pos_order_total_price']*alltax_new[0]['pos_bill_alcholic_beverages_vat'])/100;
        vat_percentage=alltax_new[0]['pos_bill_alcholic_beverages_vat'];
      }
      else
      {
       vat_amount=(valueobj['pos_order_total_price']*alltax_new[0]['pos_bill_vat_value'])/100; 
       vat_percentage=alltax_new[0]['pos_bill_vat_value'];
      }
    }
    vat_total_amount=parseFloat(vat_total_amount)+parseFloat(vat_amount);  
    sub_total=parseFloat(sub_total)+parseFloat(valueobj['pos_order_total_price']);
    var rowvalue=1;
    var newRowContent='<tr ><td>'+(rowvalue)+'</td><td>'+valueobj['pos_id']+'</td><td>'+valueobj['menu_name']+'</td><td>'+valueobj['pos_order_rate']+'</td><td>'+valueobj['pos_order_quantity']+'</td><td>'+vat_percentage+'</td><td>'+parseFloat(vat_amount).toFixed(2)+'</td><td>'+parseFloat(valueobj['pos_order_total_price']).toFixed(2)+'</td></tr>';
    $("#table_room_service tbody").append(newRowContent); rowvalue++
    });
    var total_sevice_tax=(sub_total*alltax_new[0]['pos_bill_service_tax_value'])/100;
    var total_sevice_charge=(sub_total*alltax_new[0]['pos_bill_service_charge_value'])/100;
    var total_tax=(parseFloat(vat_total_amount)+parseFloat(total_sevice_tax)+parseFloat(total_sevice_charge));
    var grand_total=parseInt(sub_total)+parseFloat(total_tax);
    $('#room_service_kot_no').val(room_kot_no_string);
    $('#room_service_print_button').show();
    $('#room_service_total_payable').html(grand_total);
    $('#room_service_total_payable_amount').val(grand_total);
    }
    else
    {
    $("#table_room_service tbody").html(''); 
    $("#room_service_guest_name").val('');
    $("#room_service_mobile_no").val('');
    $("#room_service_bill_no").html('');
    $("#room_service_service_tax").html('');
    $("#room_service_service_charge").html('');
    $('#room_service_total_payable').html('');
    $('#room_service_print_button').hide();
    $('#room_service_total_payable_amount').val(0);
    $('#room_service_discount_percentage').val(0);
    $('#room_service_discount_amount').val(0) 
    if(pos_room_number_text !="Select Room Number") { swal("For Room No "+pos_room_number_text+", KOT has not been marked as delivered", "Please go to Dashboard & mark it as delivered.", "error"); }
    }
  
});

$(document).on('keypress', '.form_key_up_check', function(event){
    var $this = $(this);
    if ((event.which != 46 || $this.val().indexOf('.') != -1) &&
       ((event.which < 48 || event.which > 57) &&
       (event.which != 0 && event.which != 8))) {
           event.preventDefault();
    }

    var text = $(this).val();
    if ((event.which == 46) && (text.indexOf('.') == -1)) {
        setTimeout(function() {
            if ($this.val().substring($this.val().indexOf('.')).length > 3) {
                $this.val($this.val().substring(0, $this.val().indexOf('.') + 3));
            }
        }, 1);
    }

    if ((text.indexOf('.') != -1) &&
        (text.substring(text.indexOf('.')).length > 2) &&
        (event.which != 0 && event.which != 8) &&
        ($(this)[0].selectionStart >= text.length - 2)) {
            event.preventDefault();
    }      
});

});
function  get_bill_information_by_token(token_number){
    var url = window.location;
    var base_url = url.protocol + "//" + url.host + "/" + url.pathname.split('/')[1];
    // var alltoken_number=alltoken_number_new;
    // var allpos_order= allpos_order_new;
    // var alltax=alltax_new;
    var alltoken_number;
    var allpos_order;
    var alltax_new;


         $.ajax({
             url:  base_url+"/pos_bill/get_latest_information",
             type: "POST",
             dataType: 'json',
             success: function (data) { //alert(data.alltax);
                allpos_order=data.allpos_order;alltoken_number=data.alltoken_number;  alltax_new=data.alltax;  
             }, async: false
          }); 
  

     var allpos_token_filter=getObjects(alltoken_number, 'token_number',token_number);
    if(allpos_token_filter !="")
    {
    var allpos_token_no_filter=getObjects(allpos_order, 'token_number',token_number);
    //var allpos_token_no_filter1=getObjects(allpos_token_no_filter,'pos_payment_status','pending');
    var allpos_token_no_filter1=getObjects(allpos_token_no_filter,'token_number_reset_status','0');
    var allpos_token_no_filter2=getObjects(allpos_token_no_filter1,'pos_raised_bill_status','0');
    var allpos_token_no_filter3=getObjects(allpos_token_no_filter2,'pos_kot_delivered_status','1');
    var allpos_order_filter_array=JSON.stringify(alltax_new);

    if( allpos_token_no_filter3 !="") {
        var grand_total=0;
        var vat_total_amount=0;
        var sub_total=0;
        var token_kot_no_string="";
        $("#table_take_away tbody").html(''); 
        $('#take_away_total_payable_amount').val(0);
        $('#take_away_discount_percentage').val(0);
        $('#take_away_discount_amount').val(0) 
        $.each(allpos_token_no_filter3, function (index, valueobj) {
        token_kot_no_string=token_kot_no_string+valueobj['pos_id']+",";
        //$("#take_away_bill_no").html('');
        //$("#take_away_bill_no").html(valueobj['pos_bill_no']);
        $("#take_away_service_tax").html('');
        $("#take_away_service_tax").html(alltax_new[0]['pos_bill_service_tax_value']);
        $("#take_away_service_charge").html('');
        $("#take_away_service_charge").html(alltax_new[0]['pos_bill_service_charge_value']);
        var vat_percentage=0;
        var vat_amount=0;
        if(valueobj['add_vat']=='Yes')
        {
        if( valueobj['alcholoc_beverage']=='1')
        {
        vat_amount=(valueobj['pos_order_total_price']*alltax_new[0]['pos_bill_alcholic_beverages_vat'])/100;
        vat_percentage=alltax_new[0]['pos_bill_alcholic_beverages_vat'];
        }
        else
        {
        vat_amount=(valueobj['pos_order_total_price']*alltax_new[0]['pos_bill_vat_value'])/100; 
        vat_percentage=alltax_new[0]['pos_bill_vat_value'];
        }
        }
        vat_total_amount=parseFloat(vat_total_amount)+parseFloat(vat_amount);  
        sub_total=parseFloat(sub_total)+parseFloat(valueobj['pos_order_total_price']);
        var rowvalue=1;
        var newRowContent='<tr ><td>'+(rowvalue)+'</td><td>'+valueobj['pos_id']+'</td><td>'+valueobj['menu_name']+'</td><td>'+valueobj['pos_order_rate']+'</td><td>'+valueobj['pos_order_quantity']+'</td><td>'+vat_percentage+'</td><td>'+parseFloat(vat_amount).toFixed(2)+'</td><td>'+parseFloat(valueobj['pos_order_total_price']).toFixed(2)+'</td></tr>';
        $("#table_take_away tbody").append(newRowContent); rowvalue++
        });
        var total_sevice_tax=(sub_total*alltax_new[0]['pos_bill_service_tax_value'])/100;
        var total_sevice_charge=(sub_total*alltax_new[0]['pos_bill_service_charge_value'])/100;
        var total_tax=(parseFloat(vat_total_amount)+parseFloat(total_sevice_tax)+parseFloat(total_sevice_charge));
        var grand_total=parseInt(sub_total)+parseFloat(total_tax);
        $('#take_away_kot_no').val(token_kot_no_string);
        $('#take_away_print_button').show();
        $('#take_away_total_payable').html(grand_total);
        $('#take_away_total_payable_amount').val(grand_total);
        }
        else 
        {
        $("#table_take_away tbody").html(''); 
        $("#take_away_bill_no").html('');
        $("#take_away_service_tax").html('');
        $("#take_away_service_charge").html('');
        $('#take_away_total_payable').html('');
        $('#take_away_print_button').hide();
        $('#take_away_total_payable_amount').val(0);
        $('#take_away_discount_percentage').val(0);
        $('#take_away_discount_amount').val(0) 
        }
    
    }
    else
    {
    $("#table_take_away tbody").html(''); 
    $("#take_away_bill_no").html('');
    $("#take_away_service_tax").html('');
    $("#take_away_service_charge").html('');
    $('#take_away_total_payable').html('');
    $('#take_away_print_button').hide();
    $('#take_away_total_payable_amount').val(0);
    $('#take_away_discount_percentage').val(0);
    $('#take_away_discount_amount').val(0) 
    }
}
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}
function add_amount_on_pending_amount()
{
    var intRegex = /^\d+$/;
    var num_div=$('#num_div').val();
    var grand_total=0;
    var due_total=0;
    var pending_amount=$('#pending_amount_id').val();
    for (var i=0;i < parseInt(num_div); i++)
    {
    var amount=$('#amount_'+i).val();
    if(amount==""){amount=0;}
    grand_total=grand_total+parseFloat(amount);
    if(grand_total > pending_amount){ $('#amount_'+i).val('0'); grand_total=grand_total-amount;}

    }

    due_total=pending_amount-grand_total;
    $('#pending_amount').html('<b>Pending Amount:</b> Rs. '+(parseFloat(due_total).toFixed(2)));
}