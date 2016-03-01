(function ($) {
    'use strict';

    var currentFontData;

    var fonts = {
        Arial: {k:4, m:56.6},
        ARIAL: {k:5, m:66.6},
        Direct: {k:4.8780487804878, m:51.7},
        DIRECT: {k:7, m:61.7},
        Meringue: {k:5, m:76.6},
        MERINGUE: {k:5, m:76.6},
        Tahoma: {k:6, m:86.6},
        TAHOMA: {k:6, m:86.6},
        Times: {k:8, m:16.6},
        TIMES: {k:8, m:16.6},
        Verdana: {k:9, m:26.6},
        VERDANA: {k:9, m:26.6}
    };

    var defaultFontData =  {k:4.8780487804878, m:51.7};

    var dotSize = 0.0320855526772571;

    var $fontFamilyInput = $('#font-family-input');
    var $lettersCaseSelect = $('#letters-case-select');
    var $distanceInput =  $('#distance-input');
    var $letterBodySizeInput = $('#letter-body-size-input');

    var $distanceOutput = $('#distance-output');
    var $lettersHeightOutput = $('#letters-height-output');
    var $lettersBodySizeOutput = $('#letters-body-size-output');
    var $symbolsHeight = $('#symbols-height');



    var $map = $('.js-map');
    $('#show-on-map').click(function() {
        var visible = ($('.mapus').css('visibility') == 'visible');
        visible ? $('.mapus').css('visibility','hidden') : $('.mapus').css('visibility','visible');
    });


    $([$fontFamilyInput, $lettersCaseSelect]).each(function(){
        this.on('change focus blur', recalculateAll);
    });

    $($distanceInput).on('change focus blur', calculateRequiredFontBodySize);
    //$($letterBodySizeInput).on('change focus blur', calculateDistance);
    $($symbolsHeight).on('change focus blur', calculateDistance);

    recalculateAll();


    function recalculateAll() {

        var postfix;
        var capitals =  parseInt( $lettersCaseSelect.val() );
        var currentFont = $fontFamilyInput.val();

        capitals ? postfix = 'Capitals' : postfix = '';
        currentFontData = fonts[currentFont+postfix];


        //console.log(currentFontData);

        if (!currentFontData) currentFontData = defaultFontData;

        calculateRequiredFontBodySize();
        calculateDistance();
    }

    function calculateRequiredFontBodySize() {
        var lettersHeight, requiredBodySize;

        lettersHeight = getLettersHeight();
        $lettersHeightOutput.html( lettersHeight.toFixed(2) );

        requiredBodySize = lettersHeight * currentFontData.m / 10;
        $lettersBodySizeOutput.html( requiredBodySize.toFixed(2) );

        $symbolsHeight.val( requiredBodySize.toFixed(2) )
    }

    function calculateDistance() {

        var distance, sybmolsHeight, fontBodySize, fontK, fontM;
        fontBodySize = $letterBodySizeInput.val() || 0;
        fontK = currentFontData.k;
        fontM = currentFontData.m;

        distance = fontBodySize / Math.tan( radians( dotSize * fontK) ) / 100 / fontM;
        $distanceOutput.html(distance.toFixed(2) );

        sybmolsHeight = fontBodySize / fontM * 10;
        //$symbolsHeight.html( sybmolsHeight.toFixed(2) );

        $symbolsHeight.val( sybmolsHeight.toFixed(2) );

        console.log(sybmolsHeight.toFixed(2) );
        //$distanceInput.val( sybmolsHeight.toFixed(2) )

    }

    function getLettersHeight() {
        var distance, result, fontK;

        fontK = currentFontData.k;
        distance = $distanceInput.val();

        result = distance * Math.tan( radians(dotSize * fontK) ) * 1000;

        return result;
    }

    function radians(degrees) {
        return degrees * (Math.PI / 180);
    }


})(jQuery);
