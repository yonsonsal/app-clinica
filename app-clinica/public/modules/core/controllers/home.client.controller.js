'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location', 'Productos',
    function($scope, Authentication, $location, Productos) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        if ($scope.authentication.user === ""){
            $location.path('signin');
        }

        $('.fa-bars').click();

        $scope.productos = Productos.query(function(productos) {
            $scope.productos = productos;

            for(var i=0; i < $scope.productos.length; i++) {
                $scope.productos[i].dashboard = {};
                if ($scope.productos[i].stockActual > $scope.productos[i].stockMinimo){
                    $scope.productos[i].status = 'good';
                    $scope.productos[i].position = 3;
                }else if ($scope.productos[i].stockActual == $scope.productos[i].stockMinimo){
                    $scope.productos[i].status = 'warning';
                    $scope.productos[i].position = 2;
                }else {
                    $scope.productos[i].status = 'danger';
                    $scope.productos[i].position = 1;
                }
            }
        });

        $scope.goToProductEdit = function(id) {
            $location.path("/productos/"+id+"/edit");
        }
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
                    //$("#sidebar").niceScroll({styler:"fb",cursorcolor:"#4ECDC4", cursorwidth: '3', cursorborderradius: '10px', background: '#404040', spacebarenabled:false, cursorborder: ''});

                    //$("html").niceScroll({styler:"fb",cursorcolor:"#4ECDC4", cursorwidth: '6', cursorborderradius: '10px', background: '#404040', spacebarenabled:false,  cursorborder: '', zindex: '1000'});


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