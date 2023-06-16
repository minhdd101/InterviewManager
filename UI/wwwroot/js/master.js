var msgbox = {
    opts: {},
    alert: function (title, text, icon, ajaxOpts, buttons) {
        var opts = {
            title: title,
            text: text,
            type: icon
        };

        if (ajaxOpts) {
            var that = this;
            opts = $.extend(opts, buttons);
            new swal(opts).then(function (result) {
                if (result.value) {
                    $.ajax(ajaxOpts);
                }
            });
        }
        else {
            new swal(opts);
        }
    },
    warning: function (title, text) {
        this.alert(title, text, 'warning');
    },
    success: function (title, text) {
        this.alert(title, text, 'success');
    },
    info: function (title, text) {
        this.alert(title, text, 'info');
    },
    error: function (title, text) {
        this.alert(title, text, 'error');
    },
    confirm: function (title, text, ajaxOpts, buttonText = 'Delete') {
        this.alert(title, text, 'question', ajaxOpts, {
            showCancelButton: true,
            confirmButtonText: buttonText,
            cancelButtonClass: 'py-2',
            confirmButtonClass: 'py-2'
        });
    },
    init: function (title, text) {
        this.opts = {
            title: title,
            text: text
        };
        return this;
    },
    initHtml: function (title, html) {
        this.opts = {
            title: title,
            html: html
        };
        return this;
    },
    addTimer: function (timer = 1500) {
        this.opts = $.extend(this.opts, { timer: timer });
        return this;
    },
    //'top', 'top-start', 'top-end', 'center', 'center-start', 'center-end', 'bottom', 'bottom-start', or 'bottom-end'.
    addPosition: function (position = 'center') {
        this.opts = $.extend(this.opts, { position: position });
        return this;
    },
    warningV2: function () {
        this.show('warning');
    },
    successV2: function () {
        this.show('success');
    },
    infoV2: function () {
        this.show('info');
    },
    infoCallback: function (callBack, confirmButtonText = 'OK') {
        swal.fire({ ...this.opts, confirmButtonText: confirmButtonText }).then(callBack);
    },
    errorV2: function () {
        this.show('error');
    },
    show: function (icon) {
        this.opts = $.extend(this.opts, { type: icon });
        this.alertV2()
    },
    confirmV2: function (ajaxOpts, cancelText = 'Cancel',
        confirmText = 'Delete', confirmBtnColor = '#3085d6', cancelBtnColor = '#aaa') {
        this.alertV2(ajaxOpts, {
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            cancelButtonClass: 'py-2',
            confirmButtonClass: 'py-2',
            confirmButtonColor: confirmBtnColor,
            cancelButtonColor: cancelBtnColor

        });
    },
    confirmCallback: function (callBack, confirmButtonText = '登録') {
        swal.fire({ ...this.opts, showCancelButton: true, confirmButtonText: confirmButtonText, cancelButtonText: 'キャンセル' })
            .then((result) => { if (result.isConfirmed) callBack.apply(); });
    },
    alertV2: function (ajaxOpts, buttons) {
        if (ajaxOpts) {
            this.opts = $.extend(this.opts, buttons);
            new swal(this.opts).then(function (result) {
                if (result.value) {
                    $.ajax(ajaxOpts);
                }
            });
        }
        else {
            new swal(this.opts);
        }
    },
    downloadSelect: function (callback, options = {}) {
        swal.fire({
            title: 'CSV出力',
            text: 'CSVファイルへの出力対象を選択してください。',
            showDenyButton: true,
            showCancelButton: false,
            showCloseButton: true,
            confirmButtonText: '検索結果全て',
            denyButtonText: '選択チェックのみ',
            denyButtonColor: '#3085d6',
            confirmButtonColor: '#3085d6',
            ...options
        }).then(function (result) {
            if(result.isConfirmed) {
                callback(true);
            } else if(result.isDenied) {
                callback(false);
            }
        })
    }
};
// Get query string params
var qs = (function (a) {
    if (a === "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length === 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

var fukui_utils = {
    timezone: function () {
        return $('#userDropdown').data('tz');
    },
    formatNumber: function (num) {
        var options = {
            maximumFractionDigits: 0
        }
        return num.toLocaleString(undefined, options)
    },
    localStringToNumber: function (s) {
        return Number(String(s).replace(/[^0-9.-]+/g, ""))
    },
    render: {
        number: function (precision = 0) {
            return $.fn.dataTable.render.number(',', '.', precision, '', '');
        },
        currency: function (precision = 0, suffix = ' VNĐ') {
            return $.fn.dataTable.render.number(',', '.', precision, '', suffix);
        },
        percent: function (precision = 0, suffix = ' %') {
            return $.fn.dataTable.render.number(',', '.', precision, '', suffix);
        },
        //DD-MM-YYYY HH:mm:ss
        date: function (format = 'YYYY/MM/DD') {
            return {
                display: function (dt) {
                    if (dt) return moment.utc(dt).local().format(format);
                    return '';
                }
            }
        },
        dateTz: function (format = 'YYYY/MM/DD HH:mm') {
            return {
                display: function (dt) {
                    if (dt) {
                        var dateTime = moment(dt);
                        if (dateTime.isValid())
                            return dateTime.add(vss_utils.timezone(), 'minutes').format(format);
                    }
                    return '';
                }
            }
        },
        checkbox: function () {
            return {
                display: function (check) {
                    return '<input type="checkbox" class="control-input" disabled ' + (check ? 'checked' : '') + ' />';
                }
            }
        },
        text: function () {
            return $.fn.dataTable.render.text();
        },
        textNull: function (def = '') {
            return {
                display: function (text) {
                    return text ?? def;
                }
            }
        },
        formatCode: function (element, padding) {
            const originalValue = $(element).val();

            if (!originalValue) return;

            const newValue = String(originalValue).padStart(padding, '0');
            $(element).val(newValue)
        }
    },
    files: {
        download: function (url) {
            window.open(`/File/Download?url=${url}`, '_blank');
        },
        embed: function (element, url) {
            $(element).html(`<embed
                                    src='${url}#toolbar=0&navpanes=0&scrollbar=0'
                                    type="application/pdf"
                                    frameBorder="0"
                                    scrolling="auto"
                                    height="100%"
                                    width="100%"
                                    ></embed>`);
        },
        downloadCsv: function ({url, fileName, table, listParamName, ids, all}) {
            let params = {
                all_filter: false,
                [listParamName]: all ? ids : fukui_utils.table.getSeleletedRecordId(table)
            }

            if(params[listParamName].length === 0) {
                msgbox.init('出力するデータがありません。', '').warningV2()
                return;
            }

            $.ajax({
                url,
                method: 'POST',
                data: params,
                xhrFields: {
                    responseType: 'blob'
                },
                success: function (res) {
                    if(res.size === 0) {
                        msgbox.init('出力するデータがありません。', '').warningV2()
                        return;
                    }

                    var downloadLink = document.createElement('a');
                    var url = window.URL.createObjectURL(res);
                    downloadLink.href = url;
                    downloadLink.download = fileName;
                    document.body.append(downloadLink);
                    downloadLink.click();
                    downloadLink.remove();
                    window.URL.revokeObjectURL(url);
               }
            })
        },
        downloadByUrl: function (fileName, url) {
            $.ajax({
                url,
                method: 'POST',
                xhrFields: {
                    responseType: 'blob'
                },
                success: function (res) {
                    if(res.size === 0) {
                        msgbox.init('出力するデータがありません。', '').warningV2()
                        return;
                    }

                    var downloadLink = document.createElement('a');
                    var url = window.URL.createObjectURL(res);
                    downloadLink.href = url;
                    downloadLink.download = fileName;
                    document.body.append(downloadLink);
                    downloadLink.click();
                    downloadLink.remove();
                    window.URL.revokeObjectURL(url);
               }
            })
        }
    },
    table: {
        getSeleletedRecordId: function (table) {
            const rows = table.state().checkboxes[0];

            return Object.keys(rows).map(key => key);
        }
    },
    event: {
        isNumber: function (e) {
            var charCode = (e.which) ? e.which : event.keyCode;
            if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57))
                return false;
            return true;
        },
        isNumberAndHyphen: function (e) {
            const charCode = (e.which) ? e.which : event.keyCode;

            if (charCode != 46 && charCode != 45 && charCode > 31
                && (charCode < 48 || charCode > 57))
                 return false;
        },
        copyNumberAndHyphen: function (e) {
            return /^[0-9]+(-[0-9]+)+$/.test(e.target.value);
        },
        back: function (e) {
            if (window.history.length == 1 || e.target.dataset.backUrl) {
                window.location.href = e.target.dataset.backUrl;
            }
            else {
                window.history.back();
            }
        },
        handleForm: function () {
            $('input').not(':input[type=submit]').on("keydown", function (event) {
                // return event.key != "Enter";
                if (event.key == 'Enter')
                    event.preventDefault();
            });
            $('form input[type=submit]').on('click', function (e) {
                if ($('#editForm').valid() == false) return true;

                e.preventDefault();
                msgbox.init('登録してよろしいでしょうか。').confirmCallback(function () { $('form').submit(); })
                return false;
            })
        }
    }
}
var fukui = {
    closeFlg: {
        Not: 0,
        Closed: 1
    },
    getCloseFlag: function (data) {
        return data === fukui.closeFlg.Not ? '<span class="badge bg-success">未</span>' : '<span class="badge bg-danger">締め済</span>';
    },
    expireFlg: {
        Expired: 1,
        Unexpired: 0
    },
    getExpiredFlg: function (data) {
        return data === fukui.expireFlg.Unexpired ? '<span class="badge bg-success">有り</span>' : '<span class="badge bg-danger">無し</span>';
    },
    availFlg: {
        Disavailable: 0,
        Avaiable: 1
    },
    availFlgSelect: [
        { label: '無効', value: 0 },
        { label: '有効', value: 1 }
    ],
    getAvailFlg: function (data) {
        return data === fukui.availFlg.Avaiable ? '<span class="badge bg-success">有効</span>' : '<span class="badge bg-danger">無効</span>';
    },
    getLogStatus: function (data) {
        switch (data) {
            case 0:
                return "新規"; //New
            case 1:
                return "更新"; //Modify
            case 2:
                return "削除"; //Delete
            case 3:
                return "CSV更新"; //CSV
        }
    },
    formatDate: function (date) {
        return moment.utc(date).local().format('YYYY/MM/DD')
    },
    error: {
        required: "^必須項目が入力されていません。",
        too_long: "^入力された文字数が超過しています。",
        format: '^%{value}桁を入力してください。',
        full_width: '^全角文字を入力してください。',
        half_width: '^半角カナ文字を入力してください。',
        must_be: "^%{count}桁を入力してください。",
    },
    mapValidationResult: function (payload, result, editor) {
        if (result == undefined || result == null) {
            return true;
        }

        for (const [key, value] of Object.entries(result)) {

            if (key in payload) {
                editor.field(key).error(value[0])
            }
        }

        return !editor.inError();
    },
    ui: {
        dom: "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6 text-end'l>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row mt-2'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        save: '<button class="btn btn-success btn-sm">更新</button>',
        edit: '<button class="btn btn-primary btn-sm">編集</button>',
        create: '追加'
    },
    event: { //Input blur event
        convertToHalf: function (e) {
            this.value = this.value.replace(/[！-～]/g, halfwidthChar => String.fromCharCode(halfwidthChar.charCodeAt(0) - 0xfee0));
        },
        convertToFull: function (e) {
            this.value = this.value.replace(/[!-~]/g, fullwidthChar => String.fromCharCode(fullwidthChar.charCodeAt(0) + 0xfee0));
        },
        zenkana2Hankana: function (e) {
            fukui.event.convertToHalf.apply(this);

            var str = this.value;

            var kanaMap = {
                "ガ": "ｶﾞ", "ギ": "ｷﾞ", "グ": "ｸﾞ", "ゲ": "ｹﾞ", "ゴ": "ｺﾞ",
                "ザ": "ｻﾞ", "ジ": "ｼﾞ", "ズ": "ｽﾞ", "ゼ": "ｾﾞ", "ゾ": "ｿﾞ",
                "ダ": "ﾀﾞ", "ヂ": "ﾁﾞ", "ヅ": "ﾂﾞ", "デ": "ﾃﾞ", "ド": "ﾄﾞ",
                "バ": "ﾊﾞ", "ビ": "ﾋﾞ", "ブ": "ﾌﾞ", "ベ": "ﾍﾞ", "ボ": "ﾎﾞ",
                "パ": "ﾊﾟ", "ピ": "ﾋﾟ", "プ": "ﾌﾟ", "ペ": "ﾍﾟ", "ポ": "ﾎﾟ",
                "ヴ": "ｳﾞ", "ヷ": "ﾜﾞ", "ヺ": "ｦﾞ",
                "ア": "ｱ", "イ": "ｲ", "ウ": "ｳ", "エ": "ｴ", "オ": "ｵ",
                "カ": "ｶ", "キ": "ｷ", "ク": "ｸ", "ケ": "ｹ", "コ": "ｺ",
                "サ": "ｻ", "シ": "ｼ", "ス": "ｽ", "セ": "ｾ", "ソ": "ｿ",
                "タ": "ﾀ", "チ": "ﾁ", "ツ": "ﾂ", "テ": "ﾃ", "ト": "ﾄ",
                "ナ": "ﾅ", "ニ": "ﾆ", "ヌ": "ﾇ", "ネ": "ﾈ", "ノ": "ﾉ",
                "ハ": "ﾊ", "ヒ": "ﾋ", "フ": "ﾌ", "ヘ": "ﾍ", "ホ": "ﾎ",
                "マ": "ﾏ", "ミ": "ﾐ", "ム": "ﾑ", "メ": "ﾒ", "モ": "ﾓ",
                "ヤ": "ﾔ", "ユ": "ﾕ", "ヨ": "ﾖ",
                "ラ": "ﾗ", "リ": "ﾘ", "ル": "ﾙ", "レ": "ﾚ", "ロ": "ﾛ",
                "ワ": "ﾜ", "ヲ": "ｦ", "ン": "ﾝ",
                "ァ": "ｧ", "ィ": "ｨ", "ゥ": "ｩ", "ェ": "ｪ", "ォ": "ｫ",
                "ッ": "ｯ", "ャ": "ｬ", "ュ": "ｭ", "ョ": "ｮ",
                "。": "｡", "、": "､", "ー": "ｰ", "「": "｢", "」": "｣", "・": "･", "　": " "
            }
            var reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
            this.value = str
                .replace(reg, function (match) {
                    return kanaMap[match];
                })
                .replace(/゛/g, 'ﾞ')
                .replace(/゜/g, 'ﾟ');
        },
        hankana2Zenkana: function (e) {
            fukui.event.convertToFull.apply(this);

            var str = this.value;

            var kanaMap = {
                'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
                'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
                'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
                'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
                'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
                'ｳﾞ': 'ヴ', 'ﾜﾞ': 'ヷ', 'ｦﾞ': 'ヺ',
                'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
                'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
                'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
                'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
                'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
                'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
                'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
                'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
                'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
                'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
                'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
                'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
                '｡': '。', '､': '、', 'ｰ': 'ー', '｢': '「', '｣': '」', '･': '・'
            };

            var reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
            this.value = str
                .replace(reg, function (match) {
                    return kanaMap[match];
                })
                .replace(/ﾞ/g, '゛')
                .replace(/ﾟ/g, '゜');
        },
        numberCode: function (e) {
            //convert to half
            if (this.value.length == 0) return;

            var newValue = this.value.replace(/[！-～]/g, halfwidthChar => String.fromCharCode(halfwidthChar.charCodeAt(0) - 0xfee0));
            newValue = newValue.replace(/\D/g, '');

            var padding = this.maxLength;
            if (newValue.length > 0 && padding && padding > 0) this.value = newValue.padStart(padding, '0');
            else this.value = newValue;
            //trigger clear validate
            $('#editForm').validate().element(this);
        },
        padLeftZero: function (e) {
            //blur event
            var padding = $(this).data('length');

            if (this.value.length == 0 || !padding) return;
            this.value = this.value.padStart(padding, '0');
        }
    },
    pref_list: [{ id: "01", text: "北海道" }, { id: "02", text: "青森県" }, { id: "03", text: "岩手県" }, { id: "04", text: "宮城県" }, { id: "05", text: "秋田県" }, { id: "06", text: "山形県" }, { id: "07", text: "福島県" }, { id: "08", text: "茨城県" }, { id: "09", text: "栃木県" }, { id: "10", text: "群馬県" }, { id: "11", text: "埼玉県" }, { id: "12", text: "千葉県" }, { id: "13", text: "東京都" }, { id: "14", text: "神奈川県" }, { id: "15", text: "新潟県" }, { id: "16", text: "富山県" }, { id: "17", text: "石川県" }, { id: "18", text: "福井県" }, { id: "19", text: "山梨県" }, { id: "20", text: "長野県" }, { id: "21", text: "岐阜県" }, { id: "22", text: "静岡県" }, { id: "23", text: "愛知県" }, { id: "24", text: "三重県" }, { id: "25", text: "滋賀県" }, { id: "26", text: "京都府" }, { id: "27", text: "大阪府" }, { id: "28", text: "兵庫県" }, { id: "29", text: "奈良県" }, { id: "30", text: "和歌山県" }, { id: "31", text: "鳥取県" }, { id: "32", text: "島根県" }, { id: "33", text: "岡山県" }, { id: "34", text: "広島県" }, { id: "35", text: "山口県" }, { id: "36", text: "徳島県" }, { id: "37", text: "香川県" }, { id: "38", text: "愛媛県" }, { id: "39", text: "高知県" }, { id: "40", text: "福岡県" }, { id: "41", text: "佐賀県" }, { id: "42", text: "長崎県" }, { id: "43", text: "熊本県" }, { id: "44", text: "大分県" }, { id: "45", text: "宮崎県" }, { id: "46", text: "鹿児島県" }, { id: "47", text: "沖縄県" }]
}

jQuery.fn.extend({
    //Register event for input[type=number]
    checkNumber: function (numberOnly = false) {
        //this.disableCcp();
        this.on('keypress', function (e) {
            var charCode = (e.which) ? e.which : event.keyCode;
            if ((numberOnly && charCode === 46) ||
                (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)))
                return false;
            return true;
        });
    },
    disableCcp: function () {
        this.on('cut copy paste', function (e) { e.preventDefault(); });
    },
    
})
