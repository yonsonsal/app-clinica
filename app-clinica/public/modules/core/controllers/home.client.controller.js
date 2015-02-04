'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location',
    function($scope, Authentication, $location) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        if ($scope.authentication.user === ""){
            $location.path('signin');
        }
        $('.fa-bars').click();

        $scope.alertList = [
            {
                'id': 12356,
                'name': "producto 1",
                'stockActual': 30,
                'stockMinimo': 20,
                'status': 'good',
                'order': 3
            },
            {
                'id': 434344,
                'name': "producto 2",
                'stockActual': 40,
                'stockMinimo': 20,
                'status': 'good',
                'order': 3
            },
            {
                'id': 12122,
                'name': "producto 3",
                'stockActual': 350,
                'stockMinimo': 10,
                'status': 'good',
                'order': 3
            }
            ,
            {
                'id': 545455,
                'name': "producto 4",
                'stockActual': 10,
                'stockMinimo': 10,
                'status': 'warning',
                'order': 2
            },
            {
                'id': 53884355,
                'name': "producto 5",
                'stockActual': 0,
                'stockMinimo': 10,
                'status': 'danger',
                'order': 1
            },
            {
                'id': 44689,
                'name': "producto 6",
                'stockActual': 15,
                'stockMinimo': 10,
                'status': 'warning',
                'order': 2
            }
            ,
            {
                'id': 564456,
                'name': "producto 7",
                'stockActual': 10,
                'stockMinimo': 10,
                'status': 'warning',
                'order': 2
            },
            {
                'id': 123158,
                'name': "producto 8",
                'stockActual': 0,
                'stockMinimo': 10,
                'status': 'danger',
                'order': 1
            }
            ,
            {
                'id': 123158,
                'name': "producto 9",
                'stockActual': 30,
                'stockMinimo': 10,
                'status': 'good',
                'order': 3
            }]
    }
])

    .directive('commonUtilities', ['$timeout', function ($timeout){
        return {
            restrict: 'A',
            link: function () {

                $timeout(function() {

                    function responsiveView() {
                        var wSize = $(window).width();
                        if (wSize <= 768) {
                            $('#container').addClass('sidebar-close');
                            $('#sidebar > ul').hide();
                        }

                        if (wSize > 768) {
                            $('#container').removeClass('sidebar-close');
                            $('#sidebar > ul').show();
                        }
                    }

                    $(function() {
                        responsiveView();
                        $(window).on('resize', responsiveView);
                    });


                    $('.fa-bars').click(function () {
                        if ($('#sidebar > ul').is(":visible") === true) {
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

                    // custom scrollbar
                    $("#sidebar").niceScroll({styler:"fb",cursorcolor:"#4ECDC4", cursorwidth: '3', cursorborderradius: '10px', background: '#404040', spacebarenabled:false, cursorborder: ''});

                    $("html").niceScroll({styler:"fb",cursorcolor:"#4ECDC4", cursorwidth: '6', cursorborderradius: '10px', background: '#404040', spacebarenabled:false,  cursorborder: '', zindex: '1000'});


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

                });

            }
        }
    }]);