var end_point = 'https://api.instagram.com/oembed?url=http://instagr.am/p/';
var end_point_media = 'https://instagram.com/p/';
var end_point_tags = 'https://www.instagram.com/explore/tags/';
var end_point_profile = 'https://www.instagram.com/';
var path_render = 'static/';
var default_home = 'home';
var uri = getUri();

render(uri);

$(document).ready(function() {
    $(window).on('scroll', function() {
        $('.box-image.big-box').css({
            'background-position-y': -$(window).scrollTop() * 50 / 100
        });
        if ($(window).scrollTop() > 47) {
            $('meta[name="theme-color"]').attr('content', '#000');
            $('.navbar-fixed').slideDown('fast', function() {
                $('.navbar-fixed').css('display', 'flex');
            });
        }else {
            $('meta[name="theme-color"]').attr('content', '#eeeeee');
            $('.navbar-fixed').slideUp('fast');
        }
    });
});

function render(uri) {
    if (uri !== null) {
        if (uri[0] == '') {
            normalizeViews();
            $('#body-content').html('<div class="box-loading"><div class="loading loading-lg"></div></div>');
            $('#body-content').load(path_render+default_home+'.html', function(res, status, xhr) {
                if (status == 'error') {
                    $('#body-content').load(path_render+'404.html');
                }
            });
        }else if (uri[0] == 'article' && uri.length > 1) {
            $('#body-content').html('<div class="box-loading"><div class="loading loading-lg"></div></div>');
            $('title').text('I Web Camp | Blog');
            $.get(end_point+uri[1], function(data) {

                let text = regularContent(data.title);
                let prev = regularPrev(data.title)+'...';
                let title = regularTitle(data.title)+'...';
                let date = getDatePublication(data.html);

                $('title').text('I Web Camp | Blog | @'+data.author_name+' - '+title);
                $('.bloggram-logo').text('Blog').attr('title', 'Artigo de @'+data.author_name+' no Blog');
                
                $('#body-content').load(path_render+'article_content.html', function(res, status, xhr) {
                    if (status == 'success') {
                        $.get(end_point_media+uri[1]+'/media/?size=l', function(data_url) {
                            $('.box-image').css({
                                'background-image': 'url('+end_point_media+uri[1]+'/media/?size=l)',
                                'height': 'calc(100vh - 200px)'
                            });
                        }).fail(function() {
                            $('.box-image').remove();
                        });
                        $('#article-title').html('<a class="text-dark" target="_blank" href="'+end_point_profile+'p/'+uri[1]+'">'+title+'</a>');
                        $('#article-title-sm').html('<a class="text-dark" target="_blank" href="'+end_point_profile+'p/'+uri[1]+'">'+title+'</a>');
                        $('#article-check').html(prev);
                        $('#article-date').text(date).attr('title', 'Publicado em '+date);
                        $('#article-author-name').html('<a target="_blank" href="'+data.author_url+'">Por @'+data.author_name+'</a>');
                        $('#btn-link-profile').attr('href', data.author_url);
                        $('#btn-link-profile-2').attr('href', data.author_url);
                        $('#article-author-name-sm').html('<a target="_blank" href="'+data.author_url+'">Por @'+data.author_name+'</a>');
                        $('#article-content').html(text);
                        getImageProfile(data.author_url, function(src) {
                            $('#article-image-author').attr('src', src);
                            $('#article-image-author-sm').attr('src', src);
                            $('#logo-gram').attr('src', src);
                            $('#logo-gram-sm').attr('src', src);
                        });
                        getLinkBio(data.author_url, function(link) {
                            if (link) {
                                $('#btn-bios-link-p').removeClass('d-invisible');
                                $('#btn-bios-link-tr').removeClass('d-invisible');
                                $('#btn-bios-link-p').click(function() {
                                    location = link;
                                });
                                $('#btn-bios-link-tr').click(function() {
                                    location = link;
                                });
                            }
                        });
                    }
                });
            }).fail(function() {
                $('#body-content').load(path_render+'400.html');
            });
        }else {
            normalizeViews();
            $('#body-content').html('<div class="box-loading"><div class="loading loading-lg"></div></div>');
            $('#body-content').load(path_render+uri[0]+'.html', function(res, status, xhr) {
                if (status == 'error') {
                    $('#body-content').load(path_render+'404.html');
                }
            });
        }
    }else if (uri == null) {
        normalizeViews();
        $('#body-content').html('<div class="box-loading"><div class="loading loading-lg"></div></div>');
        $('#body-content').load(path_render+'404.html');
    }
}

function normalizeViews() {
    $('.bloggram-logo').text('');
    $('#avatar-f-sm').remove();
    $('#avatar-f-lg').remove();
    $('#btn-bios-link-p').remove();
    $('#btn-bios-link-tr').remove();
}

function getLinkBio(uri, callback) {
    $.get(uri, function(data) {

        let shared = data.match(/window._sharedData = {(.*?)};/g);

        let link = shared;
        link = shared[0].match(/,"external_url":"(.*?)",/g);

        if (link) {
            link = link[0].replace(/,"external_url":"(.*?)",/g, '$1');
            callback(link);
        }else {
            callback(null);
        }
        
    });
}

function getDatePublication(html) {
    let data = html;
    data = data.match(/<time(.*?)<\/time>/g);
    data = data[0].match(/>(.*?)</g);
    data = data[0].replace(/>(.*?)</g, '$1');
    return data;
}

function getImageProfile(uri, callback) {
    $.get(uri, function(data_author) {

        let shared = data_author.match(/window._sharedData = {(.*?)};/g);

        let image_profile = shared;
        image_profile = shared[0].match(/,"profile_pic_url_hd":"(.*?)",/g);
        image_profile = image_profile[0].replace(/,"profile_pic_url_hd":"(.*?)",/g, '$1');

        callback(image_profile)
    });
}

function regularPrev(text) {
    text = text.replace(/\n/g, '');
    text = text.substr(80, 190);
    return text;
}

function regularContent(text) {
    let urls = text.match(/(https?:\/\/[^\s]+)|(http?:\/\/[^\s]+)|(www(.*?).com.br)|(www(.*?).com)/g);
    $.each(urls, function(i, val) {

        let issetLink = val;
        issetLink = issetLink.match(/http|https/g);

        if (issetLink !== null) {
            text = text.replace(/(https?:\/\/[^\s]+)|(http?:\/\/[^\s]+)|(www(.*?).com.br)|(www(.*?).com)/g, '<a target="_blank" class="btn btn-success tooltip m-2" data-tooltip="Visitar o site" href="'+val+'">'+val+'</a>');
        }else {
            text = text.replace(/(https?:\/\/[^\s]+)|(http?:\/\/[^\s]+)|(www(.*?).com.br)|(www(.*?).com)/g, '<a target="_blank" class="btn btn-success tooltip m-2" data-tooltip="Visitar este site" href="https://'+val+'">'+val+'</a>');
        }
    });
    text = text.replace(/@(.*?) /g, '<a target="_blank" href="'+end_point_profile+'$1">@$1</a> ');
    text = text.replace(/(?<=[\s>]|^)#(\w*[A-Za-z_]+\w*)\b(?!;)/g, '<a target="_blank" href="'+end_point_tags+'$1"><span class="chip">$1</span></a> ');
    text = text.replace(/ "(.*?)" /g, ' <blockquote><p>$1</p></blockquote> ');
    text = text.replace(/  |   |    |     |      |       |        |         |          /g, ' ');
    text = text.replace(/\n/g, '<br>');
    return text;
}

function regularTitle(title) {
    title = title.replace(/  |   |    |     |      |       |        |         |          /g, ' ');
    title = title.replace(/\n/g, '');
    title = title.replace(/\.\./g, '. ');
    title = title.substr(0, 80);
    return title.toUpperCase();
}

function getUri() {
    let winuri = window.location.search;
    winuri = winuri.replace(/\?|\//g, '');
    winuri = winuri.split('=');

    if (winuri.length > 2) {
        return null;
    }
    return winuri;
}

