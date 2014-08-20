"use strict";

function fillTables() 
{
    window.artistStriped = false;
    window.genreStriped = false;

    fillAlbumTable();
    fillArtistTable();
    fillGenreTable();
}

function fillAlbumTable() 
{
    for (var i = 0; i < window.tagdata.length; i++) {
        $('#albumTable tr:last').after("<tr>" + 
                                      "<td>" + window.tagdata[i].artist + "</td>" +
                                      "<td>" + window.tagdata[i].album + "</td>" +
                                      "<td>" + window.tagdata[i].rating.toFixed(2) + "</td>" +
                                      "<td>" + window.tagdata[i].stddev.toFixed(2) + "</td>" +
                                      "<td>" + window.tagdata[i].genres + "</td>" +
                                      "<td>" + window.tagdata[i].codec + "</td>" +
                                      "<td>" + window.tagdata[i].nrated + "/" +
                                               window.tagdata[i].nsongs + "</td>" + 
                                      "</tr>");
    }
    
    $("#albumTable").tablesorter({showProcessing: true,
                                 theme: 'blue',
                                 ignoreCase: true,
                                 widgets: ["zebra", "filter"],
                                 sortList: [[2,1]]});    
}

function fillArtistTable()
{
    var result = _.groupBy(window.tagdata, 'artist');
    var rlen = Object.keys(result).length;

    for (var key in result)
    {
       if (!result.hasOwnProperty(key))
           continue;

       var albums = result[key];

       var avgRating = 0, avgStdev = 0;
       for (var j = 0; j < albums.length; j++ )
       {
           avgRating += Number(albums[j].rating);
           avgStdev += Number(albums[j].stddev);
       }
       avgRating /= albums.length;
       avgStdev /= albums.length;
        
        $('#artistTable tr:last').after('<tr>' + 
                                      '<td>' + key + '</td>' +
                                      '<td colspan="2">' + avgRating.toFixed(2) + '</td>' +
                                      '<td colspan="2">' + avgStdev.toFixed(2) + '</td>' +
                                      '<td colspan="2">' + albums.length + '</td>' + 
                                      '</tr>');

        var childstr = "";

        for (var j = 0; j < albums.length; j++ )
        {
            childstr += "<tr class='tablesorter-childRow'><td></td><td>";
            childstr += albums[j].album + "</td><td>" +
                        albums[j].rating.toFixed(2) + "</td><td>" +
                        albums[j].stddev.toFixed(2) + "</td><td>" +
                        albums[j].genres + "</td><td>" +
                        albums[j].nrated + "/" +
                        albums[j].nsongs;        
            childstr += "</td></tr>";
        }
        
        $('#artistTable tr:last').after(childstr);
    }
    //$("#datatable").trigger("update");   
    $('#artistTable .tablesorter-childRow td').hide();
    
      // Toggle child row content (td), not hiding the row since we are using rowspan
      // Using delegate because the pager plugin rebuilds the table after each page change
      // "delegate" works in jQuery 1.4.2+; use "live" back to v1.3; for older jQuery - SOL
      $("#artistTable").delegate('.tablesorter-hasChildRow', 'click' ,function(){

        // use "nextUntil" to toggle multiple child rows
        // toggle table cells instead of the row
        $(this).closest('tr').nextUntil('#artistTable tr.tablesorter-hasChildRow').find('td').toggle();

        return false;
      });
    
    $("#artistTable").tablesorter({showProcessing: true,
                                 cssChildRow: "tablesorter-childRow",
                                 theme: 'blue',
                                 ignoreCase: true,
                                 widgets: ["zebra", "filter"],
                                 sortList: [[1,1]]});
}

function fillGenreTable()
{
    for (var i = 0; i < window.tagdata.length; i++) {
        for (var j = 0; j < window.tagdata[i].genres.length; j++ ) {
            $('#genreTable tr:last').after("<tr>" + 
                                          "<td>" + window.tagdata[i].artist + "</td>" +
                                          "<td>" + window.tagdata[i].album + "</td>" +
                                          "<td>" + window.tagdata[i].rating.toFixed(2) + "</td>" +
                                          "<td>" + window.tagdata[i].stddev.toFixed(2) + "</td>" +
                                          "<td>" + window.tagdata[i].genres[j] + "</td>" +
                                          "<td>" + window.tagdata[i].codec + "</td>" +
                                          "<td>" + window.tagdata[i].nrated + "/" +
                                                   window.tagdata[i].nsongs + "</td>" + 
                                          "</tr>");
        }
    }

    $("#genreTable").tablesorter({showProcessing: true,
                                 theme: 'blue',
                                 ignoreCase: true,
                                 widgets: ["zebra", "filter"],
                                 sortList: [[4,0],[2,1]]});
}

function showAlbumTable() {
    
    if (window.curtable === "albums")
        return;
    
    window.curtable = "albums";
    $('#albumContainer').show();
    $('#artistContainer').hide();
    $('#genreContainer').hide();
    
    $('#albumBar').addClass('active');
    $('#artistBar').removeClass('active');
    $('#genreBar').removeClass('active');    
}

function showArtistTable() {
    
    if (window.curtable === "artist")
        return;
    
    window.curtable = "artist";
    $('#albumContainer').hide();
    $('#artistContainer').show();
    $('#genreContainer').hide();
    
    $('#albumBar').removeClass('active');
    $('#artistBar').addClass('active');
    $('#genreBar').removeClass('active');
    
    // Necessary to apply striping, as the zebra striper won't color
    // anything hidden 
    if ( window.artistStriped == false ) {
        window.artistStriped = true;
        $( '#artistTable' ).trigger( 'update', [ true ] );
    }
}

function showGenreTable() {
    
    if (window.curtable === "genre")
        return;
    
    window.curtable = "genre";
    
    $('#albumContainer').hide();
    $('#artistContainer').hide();
    $('#genreContainer').show();
    
    $('#albumBar').removeClass('active');
    $('#artistBar').removeClass('active');
    $('#genreBar').addClass('active');
    
    // Necessary to apply striping, as the zebra striper won't color
    // anything hidden 
    if ( window.genreStriped == false ) {
        window.genreStriped = true;
        $( '#genreTable' ).trigger( 'update', [ true ] );
        console.log("Sorting");
    }
}
    
function startUp() {   
    $.getJSON("tagdata.json", function(json) {
        window.tagdata = json; 
        fillTables();        
    });         
};