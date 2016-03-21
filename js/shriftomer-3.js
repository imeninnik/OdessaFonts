(function ($) {
    'use strict';
    $(document).ready(run);

    function run() {
        var currentFontData, defaultFontData,
            bypassCalculationForDistance, bypassCalculationForHeight,
            currentDistance, currentHeight, mapInitInterval, map;



        var $distanceInput =  $('#distance-input');
        var $symbolsHeight = $('#symbols-height');
        var $map = $('.mapus');

        var fonts = {
            //original Direct type
            DIRECT: {k:4.8780487804878, m:51.7, ratio: 2.732 }
        };

        defaultFontData = fonts.DIRECT;
        currentFontData = defaultFontData;

        mapInitInterval = setInterval(function() {
            if (window.ymaps && window.ymaps.Map) {
                initMap();
                clearInterval(mapInitInterval);
                mapInitInterval = null;
            }
        },300);



        $('#show-on-map').click(function() {
            var visible = ($map.css('visibility') == 'visible');
            visible ? $map.css('visibility','hidden') : $map.css('visibility','visible');
        });


        $($distanceInput).on('focus', function() { currentDistance = $($distanceInput).val(); });
        $($symbolsHeight).on('focus', function() { currentHeight = $($symbolsHeight).val();  });

        $($distanceInput).on('change blur keyup', calculateLettersHeightSimplified);
        $($symbolsHeight).on('change blur keyup', calculateDistanceSimplified);


        function calculateLettersHeightSimplified() {
            var thisValue, lettersHeight;

            if (bypassCalculationForHeight) return;

            thisValue = $distanceInput.val();

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

        function initMap() {
            map = new ymaps.Map("mapus-map", {
                center: [46.4845,30.7418],
                zoom: 17
            });

            map.behaviors.get('ruler').geometry.events.add('change', function(e) {
                console.warn( map.behaviors.get('ruler').geometry.getDistance() );
                var distance = map.behaviors.get('ruler').geometry.getDistance();
                $distanceInput.val(distance.toFixed(2));
                if (distance) calculateLettersHeightSimplified();
            });

        }

    }

})(jQuery);
