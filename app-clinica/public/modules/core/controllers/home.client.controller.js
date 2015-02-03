'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location',
	function($scope, Authentication, $location) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

        if ($scope.authentication.user === ""){
             $location.path('signin');
        }
        $('.fa-bars').click();
	}
])

    .directive('commonUtilities', ['$timeout', function ($timeout){
        return {
            restrict: 'A',
            link: function () {

                function adaptContainerWidth() {
                    if ($('#sidebar').hasClass("ng-hide")) {
                        $('#main-content').css({
                            'margin-left': '0px'
                        });
                        $('#sidebar').css({
                            'margin-left': '-210px'
                        });
                        $('#sidebar > ul').hide();
                        $("#container").addClass("sidebar-closed");
                    } else {
                        $('#main-content').css({
                            'margin-left': '210px'
                        });
                        $('#sidebar > ul').show();
                        $('#sidebar').css({
                            'margin-left': '0'
                        });
                        $("#container").removeClass("sidebar-closed");
                    }
                }

                $timeout(function() {
                    $('.fa-bars').click(function () {
                        if ($('#sidebar > ul').is(":visible") === true || $('#sidebar').hasClass("ng-hide")) {
                            $('#main-content').css({
                                'margin-left': '0px'
                            });
                            $('#sidebar').css({
                                'margin-left': '-210px'
                            });
                            $('#sidebar > ul').hide();
                            $("#container").addClass("sidebar-closed");
                        } else {
                            $('#main-content').css({
                                'margin-left': '210px'
                            });
                            $('#sidebar > ul').show();
                            $('#sidebar').css({
                                'margin-left': '0'
                            });
                            $("#container").removeClass("sidebar-closed");
                        }
                    });

                    $(function() {
                        function responsiveView() {
                            var wSize = $(window).width();
                            if (wSize <= 768) {
                                $('#container').addClass('sidebar-close');
                                $('#sidebar').hide();
                            }

                            if (wSize > 768) {
                                $('#container').removeClass('sidebar-close');
                                $('#sidebar').show();
                            }
                            adaptContainerWidth ();
                        }
                        $(window).on('load', responsiveView);
                        $(window).on('resize', responsiveView);
                    });

                    jQuery('#sidebar .sub-menu > a').click(function () {
                        var o = ($(this).offset());
                        var diff = 250 - o.top;
                        if(diff>0)
                            $("#sidebar").scrollTo("-="+Math.abs(diff),500);
                        else
                            $("#sidebar").scrollTo("+="+Math.abs(diff),500);
                    });

                    $(function() {
                        $('#nav-accordion').dcAccordion({
                            eventType: 'click',
                            autoClose: true,
                            saveState: true,
                            disableLink: true,
                            speed: 'slow',
                            showCount: false,
                            autoExpand: true,
                            classExpand: 'dcjq-current-parent'
                        });
                    });

                    adaptContainerWidth ();

                });

            }
        }
    }])
;

