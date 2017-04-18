/*Tämän päivän tiedot*/
var d = new Date();

var month = d.getMonth()+1;
var day = d.getDate();

var output = (day<10 ? '0' : '') + day + '.' + (month<10 ? '0' : '') + month + '.' + d.getFullYear();

$('#date').append(output);

var idTest = 1038;

function getTheatres() {
    $.ajax({
        'url': 'https://www.finnkino.fi/xml/TheatreAreas/',
        'dataType': 'xml',
        'success': onGetTheatres
    });
}

function onGetTheatres(xml) {
    document.getElementById("myDropdown").classList.toggle("show");

    var theatres = {};

    $(xml).find('TheatreArea').each(function () {
        var id = $(this).find('ID').text();
        var name = $(this).find('Name').text();
        /*console.log('ID: ' + id);
        console.log('Name: ' + name);
        console.log('---------------------------------------------');
        */
        theatres[id] = name;

        var teatteri = {};
        teatteri.name = name;
        teatteri.id = id;
        // TODO: addeventlistener
        $('#myDropdown').append('<option id="'+id+'">'+name+'</option>');       

    });
    console.log(theatres);
}

$('#myDropdown').change(function() {
    var id2 = $(this).children(":selected").attr("id");
    console.log(id2);
    getOptionMovies(id2);
});

function getOptionMovies(theatreId) {
    $.ajax({
          'url': 'https://www.finnkino.fi/xml/Schedule/?area='+theatreId+'&dt='+output,
          'dataType': 'xml',
          'success': onOptionData
    });
}

function onOptionData(xml) {
    //var xmlText = new XMLSerializer().serializeToString(xml);
    //console.log('onOptionData: '+xmlText);
    $('#moovies').empty();
    var movies = {};
    $(xml).find('Show').each(function() {
        var title = $(this).find('Title').text();
        var orgTitle = $(this).find('OriginalTitle').text();
        var genre = $(this).find('Genres').text();
        var kuva = $(this).find('EventSmallImagePortrait').text();
        var alkuAika = $(this).find('dttmShowStart').text();
        var loppuAika = $(this).find('dttmShowEnd').text();
        
        var movie = {};
        movie.title = title;
        movie.orgTitle = orgTitle;
        movie.genre = genre;
        movie.kuva = kuva;
        movie.alkuAika = alkuAika;
        movie.loppuAika = loppuAika;
        var alkuAikaNew = alkuAika.slice(11, 16);
        var loppuAikaNew = loppuAika.slice(11, 16);
        movie.alkuAikaNew = alkuAikaNew;
        movie.loppuAikaNew = loppuAikaNew;
        
        $('#moovies').append('<img src="'+kuva+'"><h3>'+title+' - <i>'+orgTitle+'</i> </h3><p>Genret : '+genre+'<br> Time: '+alkuAikaNew+' - '+loppuAikaNew+'</p><hr>');
    });
}
getTheatres();
getOptionMovies();