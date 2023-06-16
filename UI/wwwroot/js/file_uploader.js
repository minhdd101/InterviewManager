; (function ($) {

  "use strict";

  // Create the defaults once
  var pluginName = "file_uploader",
      defaults = {}

  // The actual plugin constructor
  function Plugin(element, options) {
      this.element = element;

      this.settings = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {
      init: function () {
          this.registerEvent(this.settings);
      },
      registerEvent: function (settings) {
          this.initEvent(settings);
      },
      initEvent: function (params) {

        var code = $(params.code).val();

        function createLinkParam(link, fileName) {
          return `${link}?folder=${params.folder}&code=${code}&file=${fileName}`
        };

        $('.file').each(function () {

          if($(this).text()) {
            var fileName = $(this).text();

            $(this).on('click', function () {
              window.open(createLinkParam('/File/OpenFile', fileName), '_blank');
            });

          };
        });

        $('.deleteBtn').each(function () {

          $(this).on('click', function () {
            var file = $(this).data('file');
            var link = createLinkParam('/File/Delete', file);

            msgbox.init('', 'ファイルを削除してよろしいでしょうか')
              .confirmV2({
                url: link,
                method: 'DELETE',
                success: function (data) {
                  msgbox.init('', 'ファイルが削除されました。').infoCallback(function () {
                    location.reload();
                  }, '完了');
                }
              }, 'いいえ', 'はい', '#dc3545', '#0d6efd');
          });
        });

        $('#btnUploadFile').on('click', function () {
          $('#uploadFilePopup').modal('show');
        });

        $('#fileLink').on('click', function () {
          window.open(createLinkParam('/File/OpenFile'), '_blank');
        });

        $('#btnUpload').on('click', function () {
          var code = $(params.code).val();
          var attachment = $('#fileUpload')[0].files[0];
          var formData = new FormData();
          var fileName = '';

          if(params.fileName) fileName = params.fileName;


          formData.append('code', code);
          formData.append('file', attachment);
          formData.append('folder', params.folder);
          formData.append('isOverride', params.isOverride);
          formData.append('fileName', fileName);

          $.ajax({
            url: '/File/Upload',
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (res) {
              msgbox.init('', 'ファイルがアップロード成功しました。').infoCallback(function () {
                location.reload();
                // $('#fileLink').text(res.name);
                // $('#deleteFile').addClass('d-block').removeClass('d-none');
                // $('#uploadFilePopup').modal('hide');
              }, '完了');
            }
          });
        });
      }
  });

  $.fn[pluginName] = function (options) {
      return this.each(function () {
          if (!$.data(this, "plugin_" + pluginName)) {
              $.data(this, "plugin_" +
                  pluginName, new Plugin(this, options));
          }
      });
  };

})(jQuery);