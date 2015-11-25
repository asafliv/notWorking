'use strict';

angular.module('asafApp')
    .directive('bars', function() {
        return {
            scope: {
                currSigVars: "="
            },
            restrict: 'E',
            replace: true,
            template: '<div id="chart"></div>',
            link: function (scope, element, attrs) {

                scope.$watch("currSigVars",function(newValue,oldValue) {
                    var data=[]
                    var data2=[]
                    debugger
                    if (!newValue){
                        return;
                    }
                    for (var val in newValue){
                        data2.push(newValue[val].relativeChange)
                    }
                    var data = data2,
                        chart = d3.select('#chart')
                            .append("div").attr("class", "chart")
                            .selectAll('div')
                            .data(data).enter()
                            .append("div")
                            .transition().ease("elastic")
                            .attr("fill", "teal")

                            .style("width", function (d) {
                                return d + "%";
                            })
                            .text(function (d) {
                                return d + "%";
                            });
                });
            }
        };
    })
    .controller('MainCtrl', function ($scope,$http) {

        $scope.currentPage = 1;

        $http.get('../anomaly.json')
            .then(function(res){
                $scope.jsonFile = res.data;
                $scope.significantVariables = $scope.jsonFile["significantVariables"];
                $scope.numberOfPages = Math.ceil($scope.significantVariables.length / 8);
                $scope.anomalousProperty = $scope.jsonFile["anomalousProperty"];
                $scope.currSigVars=[]
                $scope.updateCurrSigVars()
            });


        $scope.checkFiltersMax = function(significantVariable) {
            if ($scope.variableFilterValueMax == undefined){
                return true
            }
            return  $scope.variableFilterValueMax >= significantVariable.relativeChange
        }

        $scope.checkFiltersMin = function(significantVariable) {
            debugger;
            if ($scope.variableFilterValueMin == undefined){
                return true
            }
            return  $scope.variableFilterValueMin <= significantVariable.relativeChange
        };


        $scope.checkKeyStr = function(significantVariable){
            $scope.currSigVars=[];
            if (!$scope.keySearch){
                $scope.currSigVars = $scope.significantVariables;
            }
            for (var i = 0; i< $scope.significantVariables.length; i++){
                if ($scope.significantVariables[i].key.indexOf($scope.keySearch) > -1){
                    $scope.currSigVars.push($scope.significantVariables[i]);

                }
            }
            return (significantVariable.key.indexOf($scope.keySearch) > -1);

        };

        $scope.checkValuestr = function(){
            $scope.currSigVars=[];
            if (!$scope.valueSearch){
                $scope.currSigVars = $scope.significantVariables;
            }
            for (var i = 0; i< $scope.significantVariables.length; i++){
                if ($scope.significantVariables[i].value.indexOf($scope.valueSearch) > -1){
                    $scope.currSigVars.push($scope.significantVariables[i]);

                }
            }
        };

        $scope.updateCurrSigVars = function(){
            $scope.currSigVars=[]
            for (var i = $scope.currentPage * 8 - 8; i<= $scope.currentPage * 8-1; i++){
                if (i == $scope.significantVariables.length){
                    return
                }
                $scope.currSigVars.push($scope.significantVariables[i]);
            }
            debugger;
        }
    });
