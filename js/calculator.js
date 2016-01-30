(function ($) {
    'use strict';

    var currentFontData;

    var fonts = {
        arial: {k:4, m:56.6},
        direct: {k:4.9, m:61.7},
        meringue: {k:5, m:76.6},
        tahoma: {k:6, m:86.6},
        story: {k:7, m:96.6},
        times: {k:8, m:16.6},
        verdana: {k:9, m:26.6}
    };

    var dotSize = 0.0321;

    var $fontFamilyInput = $('#font-family-input');
    var $lettersCaseSelect = $('#letters-case-select');
    var $distanceInput =  $('#distance-input');
    var $letterBodySizeInput = $('#letterBodySize-input');

    var $distanceOutput = $('#distance-output');
    var $lettersHeightOutput = $('#letters-height-output');
    var $lettersBodySizeOutput = $('#letters-body-size-output');
    var $symbolsHeight = $('#symbols-height');


    $([$fontFamilyInput, $lettersCaseSelect]).each(function(){
        this.on('change', recalculateAll);
    });

    $($distanceInput).on('change', calculateRequiredFontBodySize);
    $($letterBodySizeInput).on('change', calculateDistance);

    recalculateAll();


    function recalculateAll() {
        var currentFont = $fontFamilyInput.val();
        currentFontData = fonts[currentFont];

        calculateRequiredFontBodySize();
        calculateDistance();
    }

    function calculateRequiredFontBodySize() {
        var currentFont, lettersHeight, requiredBodySize;

        currentFont = $fontFamilyInput.val();
        currentFontData = fonts[currentFont];

        lettersHeight = getLettersHeight();
        $lettersHeightOutput.html( Math.round(lettersHeight*100)/100 );

        requiredBodySize = lettersHeight * currentFontData.m / 10;
        $lettersBodySizeOutput.html( Math.round(requiredBodySize*100)/100 );
    }

    function calculateDistance() {
        var distance, sybmolsHeight, fontBodySize, fontK, fontM;

        fontBodySize = $letterBodySizeInput.val();
        fontK = currentFontData.k;
        fontM = currentFontData.m;

        distance = fontBodySize / Math.tan( radians( dotSize * fontK) ) / 100 / fontM;
        $distanceOutput.html( Math.round(distance*100)/100 );

        sybmolsHeight = fontBodySize / fontM * 10;
        $symbolsHeight.html( Math.round(sybmolsHeight*100)/100 );

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

