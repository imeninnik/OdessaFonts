(function ($) {
    'use strict';

    var currentFontData,
        bypassCalculationForDistance, bypassCalculationForHeight,
        currentDistance, currentHeight, map;

    var fonts = {
        //original Direct type
        DIRECT: {k:4.8780487804878, m:51.7, ratio: 2.732 }
    };

    var defaultFontData =  fonts.DIRECT;

    var dotSize = 0.0320855526772571;

    currentFontData = defaultFontData;

    //todo refactor
    setTimeout(function() { createMap();  }, 2000);


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

    $($distanceInput).on('focus', function() { currentDistance = $($distanceInput).val(); });
    $($symbolsHeight).on('focus', function() { currentHeight = $($symbolsHeight).val();  });

    $($distanceInput).on('change blur keyup', calculateLettersHeightSimplified);
    $($symbolsHeight).on('change blur keyup', calculateDistanceSimplified);

    //recalculateAll();


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
        var thisValue, lettersHeight, requiredBodySize;

        thisValue = $(this).val();
        if (thisValue) thisValue = thisValue.replace(/\D/g,'');

        if (!thisValue) return;

        console.warn(!thisValue);

        lettersHeight = getLettersHeight();
        $lettersHeightOutput.html( lettersHeight.toFixed(2) );

        requiredBodySize = lettersHeight * currentFontData.m / 10;
        $lettersBodySizeOutput.html( requiredBodySize.toFixed(2) );

        $symbolsHeight.val( requiredBodySize.toFixed(2) )
    }

    function calculateLettersHeight() {
        var thisValue, lettersHeight, requiredBodySize;

        thisValue = $(this).val();
        if (thisValue) thisValue = thisValue.replace(/\D/g,'');

        if (!thisValue) return;

        lettersHeight = getLettersHeight(thisValue);
        $lettersHeightOutput.html( lettersHeight.toFixed(2) );

        // requiredBodySize = lettersHeight * currentFontData.m / 10;
        // $lettersBodySizeOutput.html( requiredBodySize.toFixed(2) );
        //
        $symbolsHeight.val( lettersHeight.toFixed(2) )
    }

    function calculateLettersHeightSimplified() {
        var thisValue, lettersHeight;
        //debugger; //debugger
        if (bypassCalculationForHeight) return;

        thisValue = $distanceInput.val();
        //if (thisValue) thisValue = thisValue.replace(/\D/g,'');

        if (!thisValue) return;
        if (thisValue == currentDistance) return;

        bypassCalculationForDistance = true;
        lettersHeight = thisValue * currentFontData.ratio;
        $symbolsHeight.val( lettersHeight.toFixed(2) );
        setTimeout(function() { bypassCalculationForDistance = null; }, 100);

        currentDistance = thisValue;
        currentHeight = lettersHeight;
    }

    function calculateDistanceSimplified() {
        var thisValue, distance;

        if (bypassCalculationForDistance) return;



        thisValue = $symbolsHeight.val();
        //if (thisValue) thisValue = thisValue.replace(/\D/g,'');

        if (!thisValue) return;
        if (thisValue == currentHeight) return;

        distance = thisValue / currentFontData.ratio;
        bypassCalculationForHeight = true;
        $distanceInput.val( distance.toFixed(2) );
        setTimeout(function() { bypassCalculationForHeight = null; }, 100);

        currentDistance = distance;
        currentHeight = thisValue;
    }

    function calculateDistance() {
        var thisValue, distance, sybmolsHeight, fontBodySize, fontK, fontM;

        thisValue = $(this).val();
        if (thisValue) thisValue = thisValue.replace(/\D/g,'');

        if (!thisValue) return;

        console.warn(!thisValue);

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

    function getLettersHeight(distance) {
        var result, fontK;

        fontK = currentFontData.k;

        result = distance * Math.tan( radians(dotSize * fontK) ) * 1000;

        // 13 = 5 * tang( Rrads(0.0320 * 4.8780) ) * 1000

        return result;
    }

    function radians(degrees) {
        return degrees * (Math.PI / 180);
    }

    function createMap() {
        window.map = new ymaps.Map("mapus-map", {
            center: [46.4845,30.7418],
            zoom: 17
        });


        window.map.behaviors.get('ruler').geometry.events.add('change', function(e) {
            console.warn( window.map.behaviors.get('ruler').geometry.getDistance() );
            var distance = window.map.behaviors.get('ruler').geometry.getDistance();
            $distanceInput.val(distance.toFixed(2));
            if (distance) calculateLettersHeightSimplified();
        });

        /*window.map.events.add('click', function (e) {
            console.warn(1);
           // if (!map.behaviors.get('ruler').geometry) return;

            console.warn(

                window.map.behaviors.get('ruler').geometry.getDistance()
                //turn ruler on by default
                //map.behaviors.get('ruler').enable()

                // close all
                // map.behaviors.get('ruler').close(true);
            );
        });*/

    }

})(jQuery);
