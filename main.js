$(document).ready(initializeApp);
function initializeApp(){
    buildGameBoard();
    applyClickHandlers();
    populateStartPosition();
    $(".gamesPlayed .value").text(gamesPlayed);


}
function applyClickHandlers(){
    $("#game-board").on('click',".square",squareClicked);


    $('.reset > button').on('click', gameReset);
}
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
var grid=[];
var gamesPlayed = 0;
var imgSrcName;
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
var thisRowPosition;
var thisColPosition;
var rowMath;
var colMath;
var rowColIncrement;
var completedMatchArray=[];
var sortRowArray=[];
var thirdCheckPosition;
var thirdCheckPositionRowChar;
var innerRowColIncrement;
var thirdCheckPositionColChar;
var parsedRowPosition;
var AddParsedRowPosition;
var AddParsedColPosition;
var InnerParsedRowPosition;
var InnerParsedColPosition;
var parsedColPosition;
var oppositel=0;

function populateStartPosition(){
    $("[row='3'] [column='3']").addClass('revealed').append('<img src="images/mkdragonblack.png">');
    $("[row='4'] [column='4']").addClass('revealed').append('<img src="images/mkdragonblack.png"">');
    $("[row='3'] [column='4']").addClass('revealed').append('<img src="images/mkdragonwhite.png">');
    $("[row='4'] [column='3']").addClass('revealed').append('<img src="images/mkdragonwhite.png">');


}
function gameReset() {
    $("#game-board").empty();
    player1Check=true;
    player2Check=false;
    buildGameBoard();
    populateStartPosition();
    gamesPlayed++;
    displayStats();
}

function displayStats() {
    $(".gamesPlayed .value").text(gamesPlayed);

}



function squareClicked(){

    //add loop looking through tokenPop and counting player score
    if (!canBeClicked) {
        return;
    }
    if ($(this).hasClass('revealed')) {
        return;
    }
    if(player1Check===true&&player2Check===false){

        thistokenRowCoordinate=$(this).parent().attr('row');
        thistokenColumnCoordinate=$(this).attr('column');
        thistokenCoordinate=thistokenRowCoordinate+','+thistokenColumnCoordinate;
        $(this).addClass('revealed')
        $(this).append('<img src="images/mkdragonwhite.png">')
        console.log(thistokenCoordinate);
        player1Check=false;
        player2Check=true;
        // canBeClicked=false
        tokenPop.push(thistokenCoordinate);
        imgSrcName="images/mkdragonwhite.png"
        legalMoveCheck(parseInt($(this).parent().attr('row')),parseInt($(this).attr('column')));
        //runs the function of legalmove check
        
        doMath();
        //runs the doMath function
        // flipCards();
        countToken();
        //runs the flip chard function
        oppositeSourceArray=[]
        TA_PC_Matched=[]
        positionCheck=[]
        return
    }
    if(player2Check===true&&player1Check===false){
        thistokenRowCoordinate=$(this).parent().attr('row');
        thistokenColumnCoordinate=$(this).attr('column');
        thistokenCoordinate=thistokenRowCoordinate+','+thistokenColumnCoordinate;
        $(this).addClass('revealed')
        $(this).append('<img src="images/mkdragonblack.png">')
        console.log(thistokenCoordinate);
        player2Check=false;
        player1Check=true;
        tokenPop.push(thistokenCoordinate);
        imgSrcName="images/mkdragonblack.png"
        legalMoveCheck(parseInt($(this).parent().attr('row')),parseInt($(this).attr('column')));

        doMath();
        // flipCards();
        countToken()
        oppositeSourceArray=[]
        TA_PC_Matched=[]
        positionCheck=[]
        return
    }

}


function legalMoveCheck(row,col) {
    //function to check everything around what is clicked - should be 8 coordinates in the position check array
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
    //function to check the common coordinates between the position check and the Tokenpop check. if there is a match push it in the TA_PC_Matched    tokenPopCopy=tokenPop.slice();
    tokenPopCopy=tokenPop.slice();
    for(var i=positionCheck.length-1;i>=0;i--){
        firstVar=positionCheck[i];
        console.log(i);
        for(var j=tokenPopCopy.length-1;j>=0;j--){
            secondVar=tokenPopCopy[j];
            if(firstVar===secondVar){
                positionCheck.splice(i,1);
                // console.log("this is position check splice" +positionCheck)
                tokenPopCopy.splice(j,1);
                // console.log("this is tokencopy check splice" +tokenPopCopy)
                console.log(secondVar)
                TA_PC_Matched.push(secondVar)


            }
        }
    }
}

function checkSourcePC_TA_Check (){
    for (i=0;i<TA_PC_Matched.length;i++){
        oppositeSourceArrayValue=TA_PC_Matched[i]
        rowPosition=TA_PC_Matched[i].charAt(0)
        colPosition=TA_PC_Matched[i].charAt(2)
        if ($("[row="+rowPosition+"] [column="+colPosition+"]").find('img').attr('src')!==imgSrcName){
            oppositeSourceArray.push(oppositeSourceArrayValue)
            //add class of wrong
        }
    }
}

function doMath() {
    //function to check the distance of opposite source tokens comapred to what was clicked
    var InnerRowPositionCheck;
    var InnerColPositionCheck;
    sortRowArray=[];
    sortColArray=[];
    var incrementCol='';
    for (i = 0; i < oppositeSourceArray.length; i++) {
        debugger;
        rowPosition = parseInt(oppositeSourceArray[i].charAt(0));
        colPosition = parseInt(oppositeSourceArray[i].charAt(2));
        thisRowPosition = parseInt(thistokenCoordinate.charAt(0));
        thisColPosition = parseInt(thistokenCoordinate.charAt(2));
        rowMath=thisRowPosition-rowPosition;
        colMath=thisColPosition-colPosition;
        addRow=rowMath*-1
        addCol=colMath*-1
        while (rowPosition>=0 && rowPosition<=7&& colPosition>=0 && colPosition<=7){
            var i=3
            $("[row="+rowPosition+"] [column="+colPosition+"]").addClass('flip')
            rowPosition+=addRow
            colPosition+=addCol
            if ($("[row="+rowPosition+"] [column="+colPosition+"]").find('img').attr('src')===imgSrcName) {
                flipCards();
                rowPosition+=7
            }

            if($("[row="+rowPosition+"] [column="+colPosition+"]").find('img').attr('src')!==imgSrcName){
                $("[row="+rowPosition+"] [column="+colPosition+"]").addClass('flip')
            }
            if ($("[row="+rowPosition+"] [column="+colPosition+"]").find('img').attr('src')===null) {
                console.log('nothing')
                rowPosition+=7
            }
        }
        $('.flip').removeClass('flip');
    }
       
}
    
function flipCards(){
        $('.flip').find('img').attr('src', ' ');
        $('.flip').find('img').attr('src', imgSrcName);
        $('.flip').removeClass('flip');

    }

function countToken(){
    var checkRowCounter;
    var checkColCounter;
    var countArrayBlack=[];
    var countArrayWhite=[];
    var scorePlayer1=0;
    var scorePlayer2=0;
    for (var i=0; i<tokenPop.length;i++){
        checkRowCounter=tokenPop[i].charAt(0);
        checkColCounter=tokenPop[i].charAt(2);
        if($("[row="+checkRowCounter+"] [column="+checkColCounter+"]").find('img').attr('src')==="images/mkdragonblack.png"){
            countArrayBlack.push(tokenPop[i])
        }
        else{
            countArrayWhite.push(tokenPop[i])
        }
    }
    scorePlayer2=countArrayBlack.length
    scorePlayer1=countArrayWhite.length
    $('.scoreP1 .value').text(scorePlayer1);
    $('.scoreP2 .value').text(scorePlayer2);
   
}