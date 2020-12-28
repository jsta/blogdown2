var oTable;
$(document).ready( function () {
    var radio = $('input[type=radio]')
    // var checkbox = $('input[type=checkbox]')
    var markdown = new showdown.Converter();

    oTable = $('#packagestable').DataTable({
        "ajax": {
            "url": "https://raw.githubusercontent.com/jsta/jsta/main/releases.json",
            "dataSrc": ""
        },
        "columns": [
            {
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": '<i class="label fa fa-caret-right"></i>'
            },
            {
                "data" : function(row, type, set, meta){
                    return '<a href="' + row.repo_url + '">' + row.repo +'</a>';
                },
                title: "Name"
            },                                    
            {
                "data": function(row, type, set, meta) {
                    return markdown.makeHtml(row.description);
                },
                "title": "description",
            },
            {
                "data": function(row, type, set, meta){
                    return row.keywords || ""
                },
                "visible": false
            }                                    
        ],        
        "createdRow" : function( row, data, index ){     
            // data.ropensci_category                   
            $(row).addClass(data.keywords.split(", "));            
        },        
        "info": false, // won't display showed entries of total
        "pagingType": "simple_numbers",
        "pageLength": 18,
        "lengthChange": false, // Disables ability to change results number per page
                "language": {
            "search": ' ', // Changes 'Search' label value
            "searchPlaceholder": "Search by: name or keyword", // adds placeholder text to search field
            "paginate": {
                "previous": "Prev", //changes 'Previous' label value
            }
        }
    }).on('search', function(){
        if(oTable.search())
            radio.prop('checked', false);
    });

    $(radio).change(function() {
        oTable.search("").draw();
    });

    // $(checkbox).change(function() {
    //     oTable.search("").draw();
    // });

    /* Custom filtering function which will filter data in column four between two values */
    
    $.fn.dataTableExt.afnFiltering.push(
        function (oSettings, aData, iDataIndex) {

            var selected = $('input:checked')
            // console.log(selected)
            var filter = selected.attr('class')
            // console.log(filter)            

            return !filter || filter == 'all' || $(oSettings.aoData[iDataIndex].nTr).hasClass(filter);
        }
    );   

        function makeDetailsRow(data){
            // console.log(data)
            var text = '<h5>Keywords</h5><p><i>' + (data.keywords || "No details for this package available.") + "</i><p>";
    
            return '<div class="packagedetails">' + text + '</div>';
        }
    
        // Add event listener for opening and closing details
        $('#packagestable tbody').on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var row = oTable.row( tr );
            if ( row.child.isShown() ) {
                $(this).empty().append('<i class="label fa fa-caret-right"></i>')
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                $(this).empty().append('<i class="label fa fa-caret-down"></i>')
                // Open this row
                row.child( makeDetailsRow(row.data())).show();
                tr.addClass('shown');
            }
        });
        
        var DataTablesLinkify = function(dataTable) {
        this.dataTable = dataTable;
        this.url = location.protocol+'//'+location.host+location.pathname;
        this.link = function() {
            return this.url +
                '?dtsearch='+this.dataTable.search() +
                '&dtpage='+this.dataTable.page();
                //more params like current sorting column could be added here
        }
        //based on http://stackoverflow.com/a/901144/1407478
        this.getParam = function(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
        this.restore = function() {
            var page = this.getParam('dtpage'), 
                search = this.getParam('dtsearch');
            if (search) this.dataTable.search(search).draw(false);
            if (page) this.dataTable.page(parseInt(page)).draw(false);
            //more params to take care of could be added here
        }
        this.restore();
        return this;
    };

    linkify = DataTablesLinkify(oTable);
    var url = linkify.link()
});

    