// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
var siteMap = {
    cert: {
        text: '資格マスタ一覧',
        create: '資格マスタ詳細'
    },
    certgroup: {
        text: '資格グループマスタ一覧',
        create: '資格グループマスタ詳細'
    },
    certapp: {
        text: '社員資格一覧',
        create: '社員資格詳細'
    },
    employee: {
        text: '社員一覧',
        create: '社員詳細'
    },
    stockholder: {
        text: '株主一覧',
        create: '株主詳細',
        sndprs: '株主発送処理'
    },
    stocktrans: {
        text: '株主一覧'
    },
    sendmail: {
        text: '株主通知処理',
        is_link: false
    },
    customer: {
        text: '顧客一覧',
        create: '顧客詳細',
    },
    customercompany: {
        text: '得意先一覧',
        create: '得意先詳細'
    },
    fiscalyear: {
        text: '事業年度一覧',
        create: '事業年度詳細'
    },
    notice: {
        text: 'お知らせ一覧',
        create: 'お知らせ詳細'
    },
    salary: {
        text: '給与仕訳処理'
    }
};
document.addEventListener("DOMContentLoaded", function () {

    el_autohide = document.querySelector('.autohide');

    // add padding-top to bady (if necessary)
    navbar_height = document.querySelector('.navbar').offsetHeight;
    document.body.style.paddingTop = navbar_height + 'px';

    if (el_autohide) {
        var last_scroll_top = 0;
        window.addEventListener('scroll', function () {
            if ($('#main_nav .dropdown-menu.show').is(':visible')) return;
            let scroll_top = window.scrollY;
            if (scroll_top < last_scroll_top) {
                el_autohide.classList.remove('scrolled-down');
                el_autohide.classList.add('scrolled-up');
            }
            else {
                el_autohide.classList.remove('scrolled-up');
                el_autohide.classList.add('scrolled-down');
            }
            last_scroll_top = scroll_top;

            if (document.getElementById('breadcrumb') == null) return;
            if (scroll_top > 0) document.getElementById('breadcrumb').classList.add('fixed-top');
            else document.getElementById('breadcrumb').classList.remove('fixed-top');
        });
        // window.addEventListener
    }
    // if
    $('.dropdown-menu .dropdown-item').each(function (e) {
        if (this.getAttribute('href').startsWith('#')) $(this).addClass('comming');
    })

    var routers = [];
    //['stockholder', 'create', '0001']
    var paths = window.location.pathname.split('/').filter(e => e);
    if (paths.length == 0) paths = ['Home'];
    var activePath = paths[0];
    if (activePath.toLowerCase() == 'master' && paths.length > 1) activePath += '/' + paths[1];
    if (activePath.toLowerCase() == 'stocktrans') {
        activePath = paths[0] = 'StockHolder';

        routers.push({ text: '株主一覧', url: activePath });
        routers.push({ text: '株主詳細', url: 'StockHolder/Create/' + paths[2] });
        if (paths[1].toLowerCase() == 'detail') {
            routers.push({ text: '移動履歴' });
        }
        else {
            routers.push({ text: '株式移動登録' });
        }

        createRouterBreadCrumb(routers);
    }
    $(`#main_nav li a.dropdown-item[href^="/${activePath}"]:first`).addClass('active')
        .closest('li.nav-item').find('a.nav-link').addClass('active');

    if (activePath.toLowerCase() == 'master' || routers.length > 0) return;

    paths.forEach((v, i, arr) => {
        var path = siteMap[v.toLowerCase()];
        if (path) {
            createBreadCrumb(path.text, v, !path.is_link && path.is_link == false);
            var create = arr[i + 1];
            if (arr.length > i + 1 && path[create.toLowerCase()]) {
                createBreadCrumb(path[create.toLowerCase()]);
            }
        }
    });
    
    function createBreadCrumb(text, url, is_remove) {
        if (url && !is_remove) {
            $('#breadcrumb ol').append(`<li class="breadcrumb-item"><a href="/${url}">${text}</a></li>`);
        }
        else $('#breadcrumb ol').append(`<li class="breadcrumb-item">${text}</li>`);
    }
    function createRouterBreadCrumb(routers) {
        routers.forEach((v, i, arr) => {
            createBreadCrumb(v.text, v.url, !v.is_link && v.is_link == false);
            //if (v.url) {
            //    $('#breadcrumb ol').append(`<li class="breadcrumb-item"><a href="/${v.url}">${v.text}</a></li>`);
            //}
            //else $('#breadcrumb ol').append(`<li class="breadcrumb-item">${v.text}</li>`);
        })
    }
});
// DOMContentLoaded  end