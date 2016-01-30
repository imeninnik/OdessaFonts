(function ($) {
    'use strict';

    var currentFontData;

    var fonts = {
        arial: {k:4, m:56.6},
        arialCapitals: {k:4, m:56.6},
        direct: {k:4.8780487804878, m:51.7},
        directCapitals: {k:7, m:61.7},
        meringue: {k:5, m:76.6},
        meringueCapitals: {k:5, m:76.6},
        tahoma: {k:6, m:86.6},
        tahomaCapitals: {k:6, m:86.6},
        story: {k:7, m:96.6},
        storyCapitals: {k:7, m:96.6},
        times: {k:8, m:16.6},
        timesCapitals: {k:8, m:16.6},
        verdana: {k:9, m:26.6},
        verdanaCapitals: {k:9, m:26.6}
    };

    var dotSize = 0.0320855526772571;

    var $fontFamilyInput = $('#font-family-input');
    var $lettersCaseSelect = $('#letters-case-select');
    var $distanceInput =  $('#distance-input');
    var $letterBodySizeInput = $('#letterBodySize-input');

    var $distanceOutput = $('#distance-output');
    var $lettersHeightOutput = $('#letters-height-output');
    var $lettersBodySizeOutput = $('#letters-body-size-output');
    var $symbolsHeight = $('#symbols-height');


    $([$fontFamilyInput, $lettersCaseSelect]).each(function(){
        this.on('change focus blur', recalculateAll);
    });

    $($distanceInput).on('change focus blur', calculateRequiredFontBodySize);
    $($letterBodySizeInput).on('change focus blur', calculateDistance);

    recalculateAll();


    function recalculateAll() {
        var postfix;
        var capitals =  parseInt( $lettersCaseSelect.val() );
        var currentFont = $fontFamilyInput.val();

        capitals ? postfix = 'Capitals' : postfix = '';
        currentFontData = fonts[currentFont+postfix];


        console.log(currentFontData);

        calculateRequiredFontBodySize();
        calculateDistance();
    }

    function calculateRequiredFontBodySize() {
        var lettersHeight, requiredBodySize;

        lettersHeight = getLettersHeight();
        $lettersHeightOutput.html( lettersHeight.toFixed(2) );

        requiredBodySize = lettersHeight * currentFontData.m / 10;
        $lettersBodySizeOutput.html( requiredBodySize.toFixed(2) );
    }

    function calculateDistance() {
        var distance, sybmolsHeight, fontBodySize, fontK, fontM;

        fontBodySize = $letterBodySizeInput.val();
        fontK = currentFontData.k;
        fontM = currentFontData.m;

        distance = fontBodySize / Math.tan( radians( dotSize * fontK) ) / 100 / fontM;
        $distanceOutput.html(distance.toFixed(2) );

        sybmolsHeight = fontBodySize / fontM * 10;
        $symbolsHeight.html( sybmolsHeight.toFixed(2) );

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

