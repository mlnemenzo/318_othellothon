$(document).ready(initializeApp);
function initializeApp(){
    buildGameBoard();
    applyClickHandlers();
    populateStartPosition();

}

var grid=[];
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
        flipCards();
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
        flipCards();
        countToken()
        oppositeSourceArray=[]
        TA_PC_Matched=[]
        positionCheck=[]
        return
    }

}
function populateStartPosition(){
    $("[row='3'] [column='3']").addClass('revealed').append('<img src="images/mkdragonblack.png">');
    $("[row='4'] [column='4']").addClass('revealed').append('<img src="images/mkdragonblack.png"">');
    $("[row='3'] [column='4']").addClass('revealed').append('<img src="images/mkdragonwhite.png">');
    $("[row='4'] [column='3']").addClass('revealed').append('<img src="images/mkdragonwhite.png">');


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
    //function to check the common coordinates between the position check and the Tokenpop check. if there is a match push it in the TA_PC_Matched

    checkSourcePC_TA_Check();
        //function to check the common coordinates between the position check and the Tokenpop check. if there is a match push it in the TA_PC_Matched

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
    //function to check the TA_PC_Matched to see if it is differnt source of what was clicked
    //those that are opposite source are now in opposite source array


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

    for (var p=0; p<tokenPop.length;p++){
        InnerRowPositionCheck=tokenPop[p].charAt(0);
        InnerColPositionCheck=tokenPop[p].charAt(2);
        if(InnerColPositionCheck===thistokenCoordinate.charAt(2)){
            sortRowArray.push(tokenPop[p])
            sortRowArray.sort()
        }else if(InnerRowPositionCheck===thistokenCoordinate.charAt(0)){
            sortColArray.push(tokenPop[p])
            sortColArray.sort()
        }
    }
    for (i = 0; i < oppositeSourceArray.length; i++) {
        rowPosition = oppositeSourceArray[i].charAt(0);
        colPosition = oppositeSourceArray[i].charAt(2);
        thisRowPosition = thistokenCoordinate.charAt(0);
        thisColPosition = thistokenCoordinate.charAt(2);
        rowMath=thisRowPosition-rowPosition;
        colMath=thisColPosition-colPosition;
        tokenPop.sort()
        

        if (rowMath===-1&&colMath===0){
            for(var k=rowPosition; k <= 7; k++) {
                rowColIncrement=k+","+colPosition
                for (var j=0;j<tokenPop.length;j++){
                    tokenPop[j];
                    InnerRowPositionCheck=tokenPop[j].charAt(0);
                    InnerColPositionCheck=tokenPop[j].charAt(2);
                    if(rowColIncrement===tokenPop[j] && $("[row="+InnerRowPositionCheck+"] [column="+InnerColPositionCheck+"]").find('img').attr('src')!==imgSrcName) { 
                        //this is opposite source in the vertical direction
                        thirdCheckPosition=rowColIncrement
                        thirdCheckPositionRowChar=thirdCheckPosition.charAt(0)
                        for (var l=thirdCheckPositionRowChar;l<8;l++){
                            innerRowColIncrement=l+","+colPosition
                            if ($("[row="+l+"] [column="+InnerColPositionCheck+"]").find('img').attr('src')===imgSrcName){
                                //IF opposite source direction we encouter opposite source -which is THIS source L is the last token 
                                for(var r=parseInt(thistokenCoordinate.charAt(0))+1;r<=l;r++ ){
                                //then add cody's code and in the for function just addclass flip.
                                $("[row="+r+"] [column="+InnerColPositionCheck+"]").addClass('flip')
                                // break;
                                }
                            }
                        }

                        // completedMatchArray.push(rowColIncrement)
                    }
                }
            }
        }
        if (rowMath===0&&colMath===-1){
            for(var k=colPosition; k <= 7; k++) {
                incrementCol=rowPosition+","+k
                for (var j=0;j<tokenPop.length;j++){
                    tokenPop[j];
                    InnerRowPositionCheck=tokenPop[j].charAt(0);
                    InnerColPositionCheck=tokenPop[j].charAt(2);
                    if(incrementCol===tokenPop[j] && $("[row="+InnerRowPositionCheck+"] [column="+InnerColPositionCheck+"]").find('img').attr('src')!==imgSrcName) {
                        //&& $("[row="+thisRowPosition+"] [column="+sortColArray[sortColArray.length-1].charAt(2)+"]").find('img').attr('src')===imgSrcName
                        thirdCheckPosition=incrementCol
                        thirdCheckPositionColChar=thirdCheckPosition.charAt(2)
                        for (var l=thirdCheckPositionColChar;l<8;l++){
                            innerRowColIncrement=rowPosition+","+l
                            if ($("[row="+InnerRowPositionCheck+"] [column="+l+"]").find('img').attr('src')===imgSrcName){
                                //IF opposite source direction we encouter opposite source -which is THIS source L is the last token 
                                for(var r=parseInt(thistokenCoordinate.charAt(2))+1;r<=l;r++ ){
                                //then add cody's code and in the for function just addclass flip.
                                $("[row="+InnerRowPositionCheck+"] [column="+r+"]").addClass('flip')
                                // break;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (rowMath===0&&colMath===1){
            for(var k=colPosition; k >= 0; k--) {
                incrementCol=rowPosition+","+k
                //maybe change to thisCol
                for (var j=0;j<tokenPop.length;j++){
                    tokenPop[j];
                    InnerRowPositionCheck=tokenPop[j].charAt(0);
                    InnerColPositionCheck=tokenPop[j].charAt(2);
                    if(incrementCol===tokenPop[j] && $("[row="+InnerRowPositionCheck+"] [column="+InnerColPositionCheck+"]").find('img').attr('src')!==imgSrcName) {
                        //&& $("[row="+thisRowPosition+"] [column="+sortColArray[sortColArray.length-1].charAt(2)+"]").find('img').attr('src')===imgSrcName
                        thirdCheckPosition=incrementCol
                        thirdCheckPositionColChar=thirdCheckPosition.charAt(2)
                        for (var l=thirdCheckPositionColChar;l>=0;l--){
                            innerRowColIncrement=rowPosition+","+l
                            if ($("[row="+InnerRowPositionCheck+"] [column="+l+"]").find('img').attr('src')===imgSrcName){
                                //IF opposite source direction we encouter opposite source -which is THIS source L is the last token 
                                for(var r=parseInt(thistokenCoordinate.charAt(2))+1;r>=l;r--){
                                //then add cody's code and in the for function just addclass flip.
                                $("[row="+InnerRowPositionCheck+"] [column="+r+"]").addClass('flip')
                                // break;
                                }
                            }
                        }
                    }
                }
            }
        }

        if (rowMath===-1&&colMath===-1){
            for(var k=colPosition; k >= 0; k--) {
                incrementCol=rowPosition+","+k
                //maybe change to thisCol
                for (var j=0;j<tokenPop.length;j++){
                    tokenPop[j];
                    InnerRowPositionCheck=tokenPop[j].charAt(0);
                    InnerColPositionCheck=tokenPop[j].charAt(2);
                    if(incrementCol===tokenPop[j] && $("[row="+InnerRowPositionCheck+"] [column="+InnerColPositionCheck+"]").find('img').attr('src')!==imgSrcName) {
                        //&& $("[row="+thisRowPosition+"] [column="+sortColArray[sortColArray.length-1].charAt(2)+"]").find('img').attr('src')===imgSrcName
                        thirdCheckPosition=incrementCol
                        thirdCheckPositionColChar=thirdCheckPosition.charAt(2)
                        for (var l=thirdCheckPositionColChar;l>=0;l--){
                            innerRowColIncrement=rowPosition+","+l
                            if ($("[row="+InnerRowPositionCheck+"] [column="+l+"]").find('img').attr('src')===imgSrcName){
                                //IF opposite source direction we encouter opposite source -which is THIS source L is the last token 
                                for(var r=parseInt(thistokenCoordinate.charAt(2))+1;r>=l;r--){
                                //then add cody's code and in the for function just addclass flip.
                                $("[row="+InnerRowPositionCheck+"] [column="+r+"]").addClass('flip')
                                // break;
                                }
                            }
                        }
                    }
                }
            }
        }


        if (rowMath===1&&colMath===0){
            for(var k=thisRowPosition; k >= 0; k--) {
                rowColIncrement=k+","+colPosition
                for (var j=0;j<tokenPop.length;j++){
                    tokenPop[j];
                    InnerRowPositionCheck=tokenPop[j].charAt(0);
                    InnerColPositionCheck=tokenPop[j].charAt(2);
                    if(rowColIncrement===tokenPop[j] && $("[row="+InnerRowPositionCheck+"] [column="+InnerColPositionCheck+"]").find('img').attr('src')!==imgSrcName) {
                        thirdCheckPosition=rowColIncrement
                        thirdCheckPositionRowChar=thirdCheckPosition.charAt(0)
                        for (var l=thirdCheckPositionRowChar;l>=0;l--){
                            innerRowColIncrement=l+","+colPosition
                            if ($("[row="+l+"] [column="+InnerColPositionCheck+"]").find('img').attr('src')===imgSrcName){
                                //IF opposite source direction we encouter opposite source -which is THIS source L is the FIRST token 
                                for(var r=parseInt(thistokenCoordinate.charAt(0))-1;r>=l;r-- ){
                                //then add cody's code and in the for function just addclass flip.
                                $("[row="+r+"] [column="+InnerColPositionCheck+"]").addClass('flip')
                                // break;
                                }
                            }
                        }
                        
                        // completedMatchArray.push(rowColIncrement)
                    }
                }
            }
        }
               
                // we need to increment row while checking if new position is in TP
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