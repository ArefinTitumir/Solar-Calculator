jQuery(document).ready(function($){
    $("#samt_5").on("click", function(){
        let averageMonthlyUnitConsumption=($("#samt_4").val());
        let tarrifValue =$("#tariffType").val();

        
        const nf=Intl.NumberFormat('en-US',{
        minimumFractionDigits:0,
        maximumFractionDigits:0

        });

        const nff=Intl.NumberFormat('en-US',{
            minimumFractionDigits:0,
            maximumFractionDigits:1
        
        });

        let conf = false;

        if(tarrifValue==0 || averageMonthlyUnitConsumption==""){
            conf = confirm("Please enter the Tariff type and Average Yearly Unit  to perform the calculation.");
        }
        
        if(conf){
            $("#Result").css("display","none");
        } else {
            if(tarrifValue==1){
                var residential=23;
                var averageYearlyBillForResidential=(averageMonthlyUnitConsumption*residential)
                var averageYearlyBill=nf.format(averageYearlyBillForResidential)
                $("#samt_6").text(" Rs " +averageYearlyBill);
            }
            else if(tarrifValue==2){
                var commertial=28;
                var averageYearlyBillForCommertial=(averageMonthlyUnitConsumption*commertial);
                var averageYearlyBill=nf.format(averageMonthlyUnitConsumption*commertial);
                $("#samt_6").text(" Rs " +averageYearlyBill);
            }
            else {
                var industrial=22;
                var averageYearlyBillForIndustrial=(averageMonthlyUnitConsumption*industrial);
                var averageYearlyBill=nf.format(averageMonthlyUnitConsumption*industrial);
                $("#samt_6").text(" Rs "+averageYearlyBill);
            }
    
            let kwSystem=(averageMonthlyUnitConsumption/(12*30*4));
            let kwSystemRecommended=nff.format(kwSystem);
            $("#samt_7").text(kwSystemRecommended);
    
            let netSystem=(kwSystem*1000*90);
            let netSystemCost=nf.format(netSystem);
            $("#samt_8").text(" Rs "+ netSystemCost);
    
    
            let sizeRequire=(kwSystem*1000*0.1);
            let sizeRequireInSq=nf.format(sizeRequire).replace(',', '');
            $("#samt_9_InF").text(sizeRequireInSq);
            let sizeRequirePlus=(kwSystem*1000*0.1*0.093);
            let sizeRequireInM=nf.format(sizeRequirePlus);
            $("#samt_9_InM").text(sizeRequireInM);
            
            let estimatedGeneration=parseInt(kwSystem*4*30*12);
            let estimatedGenerationAnnually=nf.format(estimatedGeneration).replace(',', '');
            $("#samt_10").text(estimatedGenerationAnnually);
    
            let contribution=(estimatedGeneration*0.0313);
            let contributionToEnvironment=nf.format(contribution);
            $("#samt_11").html(contributionToEnvironment+"<h6>Trees Added</h6>");
    
            $("#Result").css("display","block");

            // Table Part From Here//
    
            
            if(tarrifValue==1){
    
                var billWithoutSolarForYearOne=(averageYearlyBillForResidential);
            }
    
            else if(tarrifValue==2){
    
                var billWithoutSolarForYearOne=(averageYearlyBillForCommertial);
            }
            else{
                var billWithoutSolarForYearOne=(averageYearlyBillForIndustrial);
            }
    
            let year_arry=[];
            let billWithoutSolar_arry=[];
            let billWithoutSolar_arry_f=[];
            let billWithSolar_arry=[];
            let billWithSolar_arry_f=[];
            let billWithSolarForYearOne=5000;
            let netCashFlow_arry=[];
            let netCashFlow_arry_f=[];
    
            for(var i=0; i<30; i++){
                year_arry.push(i+1);
            }
    
            for(var i=0; i<30; i++){
    
                if(i==0){
                    billWithoutSolar_arry.push(billWithoutSolarForYearOne);
                    billWithoutSolar_arry_f.push(billWithoutSolarForYearOne);
                }
                else{
                    let billWithoutSolarForOthers=billWithoutSolar_arry[i-1];
                    billWithoutSolarForOthers=(billWithoutSolarForOthers*(3/100)+billWithoutSolarForOthers);
                    billWithoutSolar_arry.push(billWithoutSolarForOthers);
                    billWithoutSolar_arry_f.push(Math.round(billWithoutSolarForOthers));
    
                }
            }
    
            console.log(billWithoutSolar_arry)
    
            for(var i=0; i<30; i++){
    
                if(i==0){
                    billWithSolar_arry.push(billWithSolarForYearOne);
                    billWithSolar_arry_f.push(billWithSolarForYearOne);
                }
                else{
                    let billWithSolarForOthers=billWithSolar_arry[i-1];
    
                    billWithSolarForOthers=(billWithSolarForOthers*(3/100)+billWithSolarForOthers);
                    billWithSolar_arry.push(billWithSolarForOthers);
                    billWithSolar_arry_f.push(Math.round(billWithSolarForOthers));
    
                }
            }
            
            for(var i=0; i<30; i++){ 
    
                if(i==0){
                    netCashFlow_arry.push(billWithoutSolarForYearOne-netSystem);
                    netCashFlow_arry_f.push(Math.round(billWithoutSolarForYearOne-netSystem));
                } else{          
                   netCashFlow_arry.push(netCashFlow_arry[i - 1] + billWithoutSolar_arry[i - 1]);
                   netCashFlow_arry_f.push(Math.round(netCashFlow_arry[i - 1] + billWithoutSolar_arry[i - 1]));
                 }
            }
            Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                colors:[
                    '#eda122'
                ]
                ,
                title: {
                    text: 'NET CASH OUTFLOW'
                },
    
                xAxis: {
                    categories: year_arry,
                    crosshair: true,
                    title: {
                        text: 'Year'
                    }
                },
                yAxis: {
                    title: {
                        text: 'INR'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding:0.02,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: "Net Cash OutFlow",
                   data: netCashFlow_arry
                }]
            });
            Highcharts.chart('Line-chart', {
    
                title: {
                    text: 'BILL AND SAVINGS PER YEAR'
                },
            
                yAxis: {
                    title: {
                        text: 'INR'
                    }
                },
            
                 xAxis: {
                    categories: year_arry,
                    crosshair: true,
                    title: {
                        text: 'Year'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
            
                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false
                        },
                        pointStart:0
                    }
                },
            
                series: [{
                    name: 'Annual bill without solar',
                    data: billWithoutSolar_arry_f
                },  {
                    name: 'Annual bill with solar',
                    data: billWithSolar_arry_f
                }],
            
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth:1200
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }
            
            });
        }
        
    })

})