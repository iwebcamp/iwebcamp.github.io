$(document).ready(function() {

    var video = videojs($('#video-blog')[0]);

    var generate_url = function(id) {
        if (id == '') {
            $('#alert-empty-id').removeClass('d-invisible');
            setTimeout(function() {
                $('#alert-empty-id').addClass('d-invisible');
            }, 5000);
        }else {
            $('#alert-empty-id').addClass('d-invisible');
            window.location = '?article='+id;
        }
    }
    
    $('#generate-pub').click(function() {
        generate_url($('#pub-id-check').val());
    });
    
    $('#pub-id-check').keypress(function(e) {
        if (e.which == 13) {
            generate_url($('#pub-id-check').val());
        }
    });

    $('#mobile-generate-pub').click(function() {
        let link = $('#mobile-pub-link-check').val();
        let text = $('#mobile-empty-link').text();
        if (link == '') {
            $('#mobile-empty-link').removeClass('d-invisible');
            setTimeout(function() {
                $('#mobile-empty-link').addClass('d-invisible');
            }, 5000);
        }else if (extractID(link)) {
            $('#mobile-empty-link').addClass('d-invisible');
            $('#mobile-pub-link-check').removeClass('is-error');
            window.location = '?article='+extractID(link);
        }else {
            $('#mobile-empty-link').removeClass('d-invisible').text('Link inválido.');
            $('#mobile-pub-link-check').addClass('is-error');
            setTimeout(function() {
                $('#mobile-empty-link').addClass('d-invisible').text(text);
                $('#mobile-pub-link-check').removeClass('is-error');
            }, 5000);
        }
    });
});

function extractID(link) {
    link = link.match(/\/p\/(.*?)\//g);
    if (link) {
        link = link[0].replace(/\/p\/(.*?)\//g, '$1');
        return link;
    }
    return null;
}

