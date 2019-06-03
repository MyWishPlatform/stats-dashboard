(function($) {
    $.fn.marquee = function() {
        var _this = $(this);
        var textIndent = 0;
        setInterval(function() {
            textIndent+= 1;
            var firstChild = _this.children().first();
            var firstChildWidth = firstChild.outerWidth();

            if (firstChildWidth <= textIndent) {
                textIndent-= firstChildWidth;
                _this.append(firstChild);
            }

            _this.css({
                textIndent: -textIndent + 'px'
            });
        }, 10);
    }
})(jQuery);
