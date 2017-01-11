// Javascript for Tutorial Video

$(document).ready(function() {
  $(".youtube").each(function() {
    $(this).css('background-image', 'url(//i.ytimg.com/vi/' + this.id + '/hqdefault.jpg)');
    $(document).delegate('#' + this.id, 'click', function() {
      var iframe_url = "//www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1";
      if ($(this).data('params')) iframe_url += '&' + $(this).data('params');
      var iframe = $('<iframe/>', {'allowfullscreen':'allowfullscreen', 'frameborder': '0', 'src': iframe_url})
      $(this).append(iframe);
    });
  }); 

});

/*~~~ Created on 24.02.2016 ~~~*/



// The following 2 functions are only here to help compute 
// the coordinates for the new positions
function ord(string) {
  //  discuss at: http://phpjs.org/functions/ord/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: Onno Marsman
  // improved by: Brett Zamir (http://brett-zamir.me)
  //    input by: incidence
  //   example 1: ord('K');
  //   returns 1: 75
  //   example 2: ord('\uD800\uDC00'); // surrogate pair to create a single Unicode character
  //   returns 2: 65536

  var str = string + '',
    code = str.charCodeAt(0);
  if (0xD800 <= code && code <= 0xDBFF) { // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters)
    var hi = code;
    if (str.length === 1) {
      return code; // This is just a high surrogate with no following low surrogate, so we return its value;
      // we could also throw an error as it is not a complete character, but someone may want to know
    }
    var low = str.charCodeAt(1);
    return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
  }
  if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
    return code; // This is just a low surrogate with no preceding high surrogate, so we return its value;
    // we could also throw an error as it is not a complete character, but someone may want to know
  }
  return code;
}

function chr(codePt) {
  //  discuss at: http://phpjs.org/functions/chr/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: chr(75) === 'K';
  //   example 1: chr(65536) === '\uD800\uDC00';
  //   returns 1: true
  //   returns 1: true

  if (codePt > 0xFFFF) { // Create a four-byte string (length 2) since this code point is high
    //   enough for the UTF-16 encoding (JavaScript internal use), to
    //   require representation with two surrogates (reserved non-characters
    //   used for building other characters; the first is "high" and the next "low")
    codePt -= 0x10000;
    return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
  }
  return String.fromCharCode(codePt);
}



function clear_cells(current_data, cell_id){ // remove class attr on cells that aren't identifying
    for (var i = 0; i < current_data[cell_id].locator.length; i++){
            var cell = document.getElementById(current_data[cell_id].locator[i]);
            if (i == 0){
                continue; // this is the identifying cell, ignore it
            }
            console.log("before cleanup " + cell.innerHTML);
            cell.innerHTML = current_data[cell_id].locator[i];  // replace cell content by coordinate
            console.log("after cleanup "+ cell.innerHTML);
            cell.classList.remove("cell"); // It isn't a regular cell anymore...
            cell.classList.add("initcell"); // ... it's an initcell
            cell.classList.remove("redips-mark"); // we want to be able to write on the cell later
        }
}

// This is where the cells get their divs and the drag attribute
function color_cells(current_data, cell_id){  // set the cell content as well as corresponding locators for item
    var parent_div; // Will be used to access 'parent' cell, the one with the item ID
    console.log("coloring cells related to " + cell_id);
    for (var i = 0; i < current_data[cell_id].locator.length; i++) {
		//console.log(current_data[cell_id].locator);
        var cell = document.getElementById(current_data[cell_id].locator[i]); 
		//alert(cell); // Get the location of item
        cell.innerHTML = ""; // remove cell content (drop DIV element), make sure cell is clean
        cell.classList.remove("initcell"); // because we want the 'cell' style
        var div = document.createElement('div'); // create div element for cell content
        div.innerHTML = "&nbsp;"; // trick to have proper space for the rendering of the cells
        if (i == 0) {
            console.log("marking main cell as main");
            div.innerHTML = cell_id;  // cell id is item name
          	//div.classList.add("redips-drag");  // add the necessary attribute for drag. only the named cell can be dragged
			div.classList.add("info");
            div.id = cell_id; // name the cell by the item ID
            parent_div = div;  // store the parent, used for the 'joined' cells for dimensions
			//console.log(div);
       
		   //REDIPS.drag.enableDrag(true, div); // attache onmousedown, ontouchstart and ondblclick events to DIV element
			//REDIPS.drag.shift.mode = 'vertical2';
			//REDIPS.drag.multipleDrop = 'top';
			//div.setAttribute('data-target','#customer-info-modal');
            div.setAttribute('data-title', div.innerHTML); //r
        }
		
        //div.innerHTML = cell_id;
		//console.log(div.innerHTML);
		div.classList.add("cell"); // add cell class for style
		div.setAttribute('data-title',cell_id); 
        div.classList.add(color_map[current_data[cell_id].type]); // set color
        cell.classList.add("basecell"); // make it a base cell, for style and renaming in droppedBefore event
       // cell.classList.add("redips-mark"); // secure the cell: we do not want to be able to drop on this
        if (parent_div.offsetHeight){  // offsetHeight is the rendered size of the item

          //div.style.height = parent_div.offsetHeight+"px"; // reuse parent cell for size
          div.style.height = "50px"; // by r
          div.style.width = "30px"; // by r

          console.log(cell.offsetHeight+'====hello');
        }
        cell.appendChild(div); // now add div element to cell
    }
}

// Check that the new location does not overlap with any existing item
function check_overlap(current_data, id){
    var id_locators = current_data[id].locator;
    for (var i=0; i< id_locators.length; i++){
		for (var all_id in current_data){
            if (all_id == id){
                continue;
            }
            for (var j = 0; j < current_data[all_id].locator.length; j++){
                if(id_locators[i] == current_data[all_id].locator[j]){
                    return true
                }
            }

        }
    }
    return false
}

// Compute the new coordinates for the 'other' blocks
function change_data(data, item, new_corner){
	var locator = data[item].locator;
	if(locator[0] == new_corner){
        return data;
    }
    var delta_x = ord(new_corner[0]) - ord(data[item].locator[0][0]);
    var patt1 = /\d+/g;
    var number_new = patt1.exec(new_corner);
    var patt2 = /\d+/g;
    var number_prev = patt2.exec(data[item].locator[0]);
    var delta_y = number_new - number_prev;
    for (var i=0; i < locator.length; i++){
        var locitem = locator[i];
        var patt3 = /\d+/g;
        var num = patt3.exec(locitem);
        var new_y = parseInt(num) + parseInt(delta_y);
        //locator[i] = chr(ord(locitem[0]) + parseInt(delta_x)) + new_y;
		locator[i] =  new_y;
		//console.log(locator[i]);
    }
	//alert(locator);
    return data;
}

// The actual definition of everything
var redipsInit = function () {

    // set reference to the REDIPS.drag and REDIPS.table library
    var rd = REDIPS.drag,
            //rt = REDIPS.table,
            tbl = document.getElementById('view'), // reference to table2
            tasks = [];

    // activate onmousedown event listener on cells within table with id="mainTable"
    //rt.onmousedown('gelpakview', true);
    // define background color for marked cell
    //rt.color.cell = '#9BB3DA';
    current_data = test_data;
    render_data(current_data);
    var moved_item = "";
    // REDIPS.drag initialization
    rd.init();
    rd.dropMode = "overwrite";
    rd.event.clicked = function() {
        rd.td.source.classList.remove("redips-mark");  // mark clicked cell a droppable one
        var cell_id =  rd.td.source.getElementsByClassName("cell")[0].id;
        moved_item = cell_id;
        clear_cells(current_data, cell_id);  // Remove any attribute on the companion cell
    };
    rd.event.droppedBefore = function(targetcell) {
        moved_item = rd.td.source.getElementsByClassName("cell")[0].id;
        if (rd.td.source.id != targetcell.id) {
            var backup = JSON.parse(JSON.stringify(current_data));  // hack to make deep copy
            //need to alter the current_data now as we moved
            current_data = change_data(current_data, rd.td.source.getElementsByClassName("cell")[0].id,
                targetcell.id);
            //check the result does not overlap with existing element
            if(check_overlap(current_data, rd.td.source.getElementsByClassName("cell")[0].id)){
                current_data = JSON.parse(JSON.stringify(backup));
                console.log("Cancelled due to overlap");
                return false; // this cancels the drop
            }

        }

    };
    rd.event.dropped = function(){
        console.log("Dropped " + rd.td.target.getElementsByClassName("cell")[0].id);
        appendRow(rd.td.target.getElementsByClassName("cell")[0].id + ": from " + rd.td.source.id + "  to " + rd.td.target.id);
        tasks.push({"from": rd.td.source.id, "to": rd.td.target.id});
        //now reset previous cell to the default content
        if (rd.td.source.classList.contains("initcell") || rd.td.source.classList.contains("basecell")) {
            console.log("Cleaning previously used cells");
			//alert(rd.td.source.id);
            rd.td.source.innerHTML = rd.td.source.id; // the cell contains by default its ID, ex. A1
            rd.td.source.classList.add("initcell"); // need to reset the cell class to have the proper style
        }
        console.log(tasks);
    };
    rd.event.finish = function(){
        console.log("finish");
		color_cells(current_data, moved_item);
        console.log("finish, changed " + moved_item);
        //moved_item = "";
        // here we should also send the data to the DB
    };

};

// for the table below
function appendRow(text) {
   /* var tbl = document.getElementById('tasks');
	alert(tbl); // table reference
        row = tbl.insertRow(tbl.rows.length);
		      // append table row
    createCell(row.insertCell(0), text, 'row');*/
    
}
// create DIV element and append to the table cell
function createCell(cell, text, style) {
    var div = document.createElement('div'), // create DIV element
        txt = document.createTextNode(text); // create text node
    div.appendChild(txt);                    // append text node to the DIV
    div.setAttribute('class', style);        // set DIV class attribute
    div.setAttribute('className', style);    // set DIV class attribute for IE (?!)
    cell.appendChild(div);                   // append DIV to the table cell
}
// add onload event listener
if (window.addEventListener) {
    window.addEventListener('load', redipsInit, false);
}
else if (window.attachEvent) {
    window.attachEvent('onload', redipsInit);
}
window.onload = redipsInit();


