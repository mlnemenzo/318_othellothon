$(document).ready(initializeApp);
function initializeApp(){
    buildGameBoard();
    applyClickHandlers();
    populateStartPosition();

}

var grid=[];
var tokenPop = ["3,3", "3,4", "4,4", "4,3"];
var tokenPopCopy=[];
var thistokenCoordinate;
var thistokenRowCoordinate;
var thistokenColumnCoordinate;
var player1Check=true;
var player2Check=false;
var canBeClicked=true;
var positionCheck = [];
var firstVar=0;
var secondVar=0;
var TA_PC_Matched=[];
var rowPosition='';
var colPosition='';
var oppositeSourceArray=[];
var oppositeSourceArrayValue;
function buildGameBoard(){
    var boardSize = { rows: 8, squares: 8 };
    var gameBoard = $('#game-board');
    for (var newRow=0;newRow<boardSize.rows;newRow++){
        var divsToAppend;
        divsToAppend=$("<div>").addClass("row")    
        for(var newSquare=0;newSquare<boardSize.rows;newSquare++){       
            var showSquare=$("<div>").addClass("square")    
            if(newSquare%2===0 && newRow%2===0){
                showSquare.addClass("light")    
            } else if(newSquare%2===1 && newRow%2===1){
                showSquare.addClass("light")    
            } else if(newSquare%2===1 && newRow%2===0){
                showSquare.addClass("dark")    
            } else{
                showSquare.addClass("dark")    
            }
            showSquare.attr('column',newSquare)
            divsToAppend.append(showSquare)
            grid.push(newRow+","+newSquare)

        }
        divsToAppend.attr('row',newRow)
        console.log(grid)
        $("#game-board").append(divsToAppend)
    }

}


function applyClickHandlers(){
    $("#game-board").on('click',".square",squareClicked);
}


function squareClicked(){
    //add loop looking through tokenPop and counting player score
    if (!canBeClicked) {
        return;
    }
legalMoveCheck();
    if ($(this).hasClass('revealed')) {
        return;
    }
    if(player1Check===true&&player2Check===false){
        thistokenRowCoordinate=$(this).parent().attr('row');
        thistokenColumnCoordinate=$(this).attr('column');
        thistokenCoordinate=thistokenRowCoordinate+','+thistokenColumnCoordinate;
        $(this).addClass('revealed')
        $(this).append('<img src="images/Back.png">')
        console.log(thistokenCoordinate);
        player1Check=false;
        player2Check=true;
        // canBeClicked=false
        tokenPop.push(thistokenCoordinate);
        // legalMoveCheck(thistokenRowCoordinate,thistokenColumnCoordinate);

        return
    }
    if(player2Check===true&&player1Check===false){
        thistokenRowCoordinate=$(this).parent().attr('row');
        thistokenColumnCoordinate=$(this).attr('column');
        thistokenCoordinate=thistokenRowCoordinate+','+thistokenColumnCoordinate;
        $(this).addClass('revealed')
        $(this).append('<img src="images/s-l300.jpg">')
        console.log(thistokenCoordinate);
        player2Check=false;
        player1Check=true;
        // $("#game-board").off('click',".square",squareClicked);
        // canBeClicked=false
        tokenPop.push(thistokenCoordinate);
        // legalMoveCheck(thistokenRowCoordinate,thistokenColumnCoordinate);

        return
    }
}
function populateStartPosition(){
    $("[row='3'] [column='3']").addClass('revealed').append('<img src="images/Back.png">');
    $("[row='4'] [column='4']").addClass('revealed').append('<img src="images/Back.png">');
    $("[row='3'] [column='4']").addClass('revealed').append('<img src="images/s-l300.jpg">');
    $("[row='4'] [column='3']").addClass('revealed').append('<img src="images/s-l300.jpg">');


}

function legalMoveCheck(row,col) {

    for (var rowIndex = row - 1; rowIndex <= row + 1; rowIndex++) {
        console.log('check1');
        console.log(rowIndex);
        // if (rowIndex.hasClass('revealed')) {
        //     console.log('has it')
        // }
        for (var colIndex = col - 1; colIndex <= col + 1; colIndex++) {
            if (rowIndex === row && colIndex === col) {
                console.log(rowIndex, colIndex, 'hi');

                continue;
            }
            positionCheck.push(rowIndex + ',' + colIndex);

        }

    }

    PC_TA_Check();
    checkSourcePC_TA_Check();
}


function PC_TA_Check(){
    tokenPopCopy=tokenPop.slice();
    for(var i=positionCheck.length-1;i>=0;i--){
        firstVar=positionCheck[i];
        console.log(i);
        for(var j=tokenPopCopy.length-1;j>=0;j--){
            secondVar=tokenPopCopy[j];
            if(firstVar===secondVar){
                positionCheck.splice(i,1);
                console.log("this is position check splice" +positionCheck)
                tokenPopCopy.splice(j,1);
                console.log("this is tokencopy check splice" +tokenPopCopy)
                console.log(secondVar)
                TA_PC_Matched.push(secondVar)


            }

        }

    }

}


function checkSourcePC_TA_Check (){
    for (i=0;i<TA_PC_Matched.length-1;i++){
        oppositeSourceArrayValue=TA_PC_Matched[i]
        rowPosition=TA_PC_Matched[i].charAt(0)
        colPosition=TA_PC_Matched[i].charAt(2)
        if ($("[row=rowPosition] [column=colPosition]").find('img').attr('src')!=="images/Back.png"){
            oppositeSourceArray.push(oppositeSourceArrayValue)
        }

    }
}
