$(document).ready(initializeApp);
function initializeApp(){
    buildGameBoard();
    applyClickHandlers();
    populateStartPosition();
    $(".gamesPlayed .value").text(gamesPlayed);


}

var grid=[];
var gamesPlayed = 0;
var imgSrcName;
var tokenPop = ["3,3", "3,4", "4,4", "4,3"];
//token Pop is the token population. everytime a player clicks it goes into the token pop array
var tokenPopCopy=[];
//this is a copy of token pop which is used for comparisons during the position checks /splicing for array matches
var thistokenCoordinate;
//when the player clicks this is the coordinate of the div
var thistokenRowCoordinate;
// breaks out the thistokenCoordinate to just the Row (x) from (x,y)
var thistokenColumnCoordoinate;
// breaks out the thistokenCoordinate to just the Column (y) from (x,y)
var player1Check=true;
// flag when player 1 goes and then sets to false to let player 2 goes
var player2Check=false; 
// flag when player 2 goes and then sets to false to let player 1 goes
var canBeClicked=true;
//we don't really need this since we are using class reveal
var positionCheck = [];
//when the player clicks a square, there shoul be up to 8 coordinates filled into this array of all the possible directions
var firstVar=0;
//this shouldn't be a global. is used during the PC_TA_Check which is to compare the position check array with the token pop array
var secondVar=0;
//this shouldn't be a global. is used during the PC_TA_CHECK which is to compare the token pop  array with the position check array
var TA_PC_Matched=[];
//this array holds what is matched between the PC and TA array
var rowPosition=''; 
//this is to find the row of the given coordinates . used in many functions
var colPosition='';
//this is to find the coordinates of the given coordinates . used in many functions
var oppositeSourceArray=[];
//when the TA_PC_Matched populates, this array will hold the oopposite image source of "this". i.e if this is white the opposite source array will be black
var oppositeSourceArrayValue;
//this is a placeholder to be pushed the coordinate into the oppositeSourceArray
var thisRowPosition;
//this breaks up the "this" coordinate to only row ->couldve used other variables above but whatever
var thisColPosition;
//this breaks up the "this" coordinate to only column ->couldve used other variables above but whatever
var rowMath;
//this does math between  "this" row coordinate with opposite source row coordinate .. this will either be 0,-1,1
var colMath;
//this does math between  "this" column coordinate with opposite source column coordinate .. this will either be 0,-1,1
var rowColIncrement;
//for checks, this will increment the row or decrement (misleading but we were in a time crunch)
var completedMatchArray=[];
//we don't reall yneed this
var sortRowArray=[];
//this was to sort the rows but we didnt need this because cody had his own way to solve sandwich problems of the bug
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
//this was to solve the other diagonals which we couldn't but will revise the code

function buildGameBoard(){
    //this creates the game board via dom creation
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
            //this is hard coding the column coordinate with new square which is a number that increments
            divsToAppend.append(showSquare)
            grid.push(newRow+","+newSquare)
            //this is hard coding the row coordinate with new square which is a number that increments


        }
        divsToAppend.attr('row',newRow)
        console.log(grid)
        $("#game-board").append(divsToAppend)
    }

}

function gameReset() {
    $("#game-board").empty();
    player1Check=true;
    player2Check=false;
    buildGameBoard();
    populateStartPosition();
    gamesPlayed++;
    displayStats();
    //when button is pressed we are reseting the game board and incrementing the games played.
    //display stats of player 1 /player 2 will be empty for this game reset
}

function displayStats() {
    $(".gamesPlayed .value").text(gamesPlayed);
    //this function is only for the gamesplayed, does not refelect player 1 and player 2 that is further along the code

}

function applyClickHandlers(){
    $("#game-board").on('click',".square",squareClicked);
    //click handlers only for the squares
    $('.reset > button').on('click', gameReset);
    //reset button when clicked

}


function squareClicked(){
    //this is the major function which does
        //1. has flags on whether somethings is clicked or not
        //2.calls all the functions that does work on the game board
    if (!canBeClicked) {
        return;
        //this if statement is pretty useless since we are doing has class revealed
    }
    if ($(this).hasClass('revealed')) {
        return;
        //if the tokens are showing on the game board they all have the revealed class and it can't be clicked anymore
    }
    if(player1Check===true&&player2Check===false){
        //this if statement is to check if it is player 1's turn
        thistokenRowCoordinate=$(this).parent().attr('row');
        //pull the row coordinate from the DOM by getting the parent attribute of the row
        thistokenColumnCoordinate=$(this).attr('column');
        //pull the column coordinate from the DOM by getting column number which is an attribute of the square
        thistokenCoordinate=thistokenRowCoordinate+','+thistokenColumnCoordinate;
        $(this).addClass('revealed')
        //when clicked it adds a class of reveal. when it is revealed it can't be clicked again
        $(this).append('<img src="images/mkdragonwhite.png">')
        //this is creating all player 1 as the dragon white source
        console.log(thistokenCoordinate);
        player1Check=false;
        //after player 1 clicks, player 1 turn will be over
        player2Check=true;
        //after player 1 clicks, player 2 will commence
        tokenPop.push(thistokenCoordinate);
        //every time they click, we will input that coordinate into the tokenpop array (token population)
        imgSrcName="images/mkdragonwhite.png"
        //this variable is to just save it as the source so we don't have to manually write out the source to compare
        legalMoveCheck(parseInt($(this).parent().attr('row')),parseInt($(this).attr('column')));   
        //this variable legalmovecheck sucks. to be more precise it should be positionCheck function which puts 8 possible directions in an array
        doMath();
        flipCards();
        countToken();
        //after every turn we need to reset these arrays below
        oppositeSourceArray=[]
        TA_PC_Matched=[]
        positionCheck=[]
        return
    }
    if(player2Check===true&&player1Check===false){
        //this is the same logic as the above
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
    //this function is called when the game starts and when the game resets
    $("[row='3'] [column='3']").addClass('revealed').append('<img src="images/mkdragonblack.png">');
    //we needed to target the specific coordinates of (3,3) and to do that is "[row='3'] [column='3']"
    //have to add a class of revealed so it doesnt get clicked again.
    //then we have to append the image sorce
    $("[row='4'] [column='4']").addClass('revealed').append('<img src="images/mkdragonblack.png"">');
    $("[row='3'] [column='4']").addClass('revealed').append('<img src="images/mkdragonwhite.png">');
    $("[row='4'] [column='3']").addClass('revealed').append('<img src="images/mkdragonwhite.png">');


}

function legalMoveCheck(row,col) {
    //this variable legalmovecheck sucks. to be more precise it should be positionCheck function which puts 8 possible directions in an array
    //this logic is very similar to dom creation to check all 8 positions
    //copied this code from homeboy on GIT
    for (var rowIndex = row - 1; rowIndex <= row + 1; rowIndex++) {
        //row and col are variables of THIScoordinate when the function is called.
        //the first loop starts -1 of the position then stops +1 of the position
        console.log('check1');
        console.log(rowIndex);
        for (var colIndex = col - 1; colIndex <= col + 1; colIndex++) {
            if (rowIndex === row && colIndex === col) {
                console.log(rowIndex, colIndex, 'hi');

                continue;
                //in this inner loop we are going to get -1 of the column and +1 of the column
            }
            positionCheck.push(rowIndex + ',' + colIndex);
            //push all 8 positions into the position check array ..however if it is in the corner then we don't have to push

        }

    }

    PC_TA_Check();
    //function to check the common coordinates between the position check and the Tokenpop check. if there is a match push it in the TA_PC_Matched

    checkSourcePC_TA_Check();
        //function to check the common coordinates between the position check and the Tokenpop check. if there is a match push it in the TA_PC_Matched

}


function PC_TA_Check(){
    //function to check the common coordinates between the position check and the Tokenpop check. 
    //if there is a match push it in the TA_PC_Matched 
    //we've done this before in one of the practice problem TIM gave us
    tokenPopCopy=tokenPop.slice();
    //as the coordinate match between token population and position check array, we need to remove the coordinate values on tokenpopulation
    //however we don't want to mess with tokenpop array because we need that as an ongiong list so we are going to make a copy of it 
    for(var i=positionCheck.length-1;i>=0;i--){
        //increments the position check array (8) possibities
        firstVar=positionCheck[i];
        //firstVar is a variable to hold the coordinate of the position Check
        console.log(i);
        for(var j=tokenPopCopy.length-1;j>=0;j--){
        //increments the Tokepop array which has coordinates of all the pieces on the board
            secondVar=tokenPopCopy[j];
            //secondVar is a variable to hold the coordinate of the tokenPop Array Check
            if(firstVar===secondVar){
                //if the position check coordinate and token pop coordinate match then we need to put that coordinate in the array
                positionCheck.splice(i,1);
                //we need to splice the coordinate that has a match because we don't want to keep looping over it 
                    //we need to delete that entry and go on to the next value or else we'll have a huge array
                tokenPopCopy.splice(j,1);
                //same logic as position check, don't want to loop over same coordinate in tokenpopcopy
                console.log(secondVar)
                TA_PC_Matched.push(secondVar)
                //when there is a match w are going to push it in the TA_PC_Matched arrays
                //this array just has matches between position check and the token array


            }

        }

    }

}


function checkSourcePC_TA_Check (){
    //function to put coordinates into oppositeSource Array if coordinates has opposite img source than "this" clicked
    for (i=0;i<TA_PC_Matched.length;i++){
        //function will loop through the TA_PCMatched array and pull out the row and coordinates to compare img source
        oppositeSourceArrayValue=TA_PC_Matched[i]
        rowPosition=TA_PC_Matched[i].charAt(0)
        colPosition=TA_PC_Matched[i].charAt(2)
        if ($("[row="+rowPosition+"] [column="+colPosition+"]").find('img').attr('src')!==imgSrcName){
            //if the coordinates are opposite sources we are going to store them in oppositeSourceArray 
            oppositeSourceArray.push(oppositeSourceArrayValue)
        }

    }

}

function doMath() {
    //THIS HUGE ASS FUNCTION slaps on the class "flip" based on the rules of reversi
    var InnerRowPositionCheck;
    var InnerColPositionCheck;
    sortRowArray=[];
    sortColArray=[];
    var incrementCol='';

    for (var p=0; p<tokenPop.length;p++){
        //this whole for loop we don't actually need because we got the logic of reversi wrong
        //we didn't need to check the LAST position of a row or column..
        //if THIS img src has an opposite img src and then THIS img src at another coordinate at the same positon
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
        //we are looping through the opposite Source Array and doing math between opposite source position with "this"position
        //for time sake, i'm just going to detail comment out 1/6 scenarios
        rowPosition = oppositeSourceArray[i].charAt(0);
        colPosition = oppositeSourceArray[i].charAt(2);
        thisRowPosition = thistokenCoordinate.charAt(0);
        thisColPosition = thistokenCoordinate.charAt(2);
        rowMath=thisRowPosition-rowPosition;
        colMath=thisColPosition-colPosition;
        tokenPop.sort()        
        //we don't really need to sort the token population
        if (rowMath===-1&&colMath===0){
            //if the math fits this scenario then we continue with the loop
            for(var k=rowPosition; k <= 7; k++) {
                // for loop search the direction starting from the opposite source until it hits the same source as THIS
                rowColIncrement=k+","+colPosition
                //rowColIncremet is a place holder of the coordinate of all potential coordinates in that direction
                for (var j=0;j<tokenPop.length;j++){
                    //this for loop is going to compare coordinates in the token population with rowColIncrement
                    tokenPop[j];
                    InnerRowPositionCheck=tokenPop[j].charAt(0);
                    InnerColPositionCheck=tokenPop[j].charAt(2);
                    if(rowColIncrement===tokenPop[j] && $("[row="+InnerRowPositionCheck+"] [column="+InnerColPositionCheck+"]").find('img').attr('src')!==imgSrcName) { 
                        //if there is a match of coordinates AND the sources are opposite we are going to continue with more LOOPs
                        thirdCheckPosition=rowColIncrement
                        thirdCheckPositionRowChar=thirdCheckPosition.charAt(0)
                        for (var l=thirdCheckPositionRowChar;l<8;l++){
                            //since we already found the opposite source (from opposite source array)
                            //this for loop is going to find the next source that is THIS (the square that is clicked) img src
                            innerRowColIncrement=l+","+colPosition
                            if ($("[row="+l+"] [column="+InnerColPositionCheck+"]").find('img').attr('src')===imgSrcName && $("[row="+InnerRowPositionCheck+"] [column="+l+"]").hasClass('revealed')){
                                continue;
                                for(var r=parseInt(thistokenCoordinate.charAt(0))+1;r<=l;r++ ){
                                //this loop is going to FLAG all the opposite source from THIS coordinate
                                $("[row="+r+"] [column="+InnerColPositionCheck+"]").addClass('flip')                               }
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
                            if ($("[row="+InnerRowPositionCheck+"] [column="+l+"]").find('img').attr('src')===imgSrcName && $("[row="+InnerRowPositionCheck+"] [column="+l+"]").hasClass('revealed')){
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
                            if ($("[row="+InnerRowPositionCheck+"] [column="+l+"]").find('img').attr('src')===imgSrcName && $("[row="+InnerRowPositionCheck+"] [column="+l+"]").hasClass('revealed')){
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
            for(var k=parseInt(thisColPosition)+1; k <= 7; k++) {
                parsedRowPosition=parseInt(k);
                parsedColPosition=parseInt(k);
                incrementCol=parsedRowPosition+","+parsedColPosition
                //maybe change to thisCol
                for (var j=0;j<tokenPop.length;j++){
                    tokenPop[j];
                    InnerRowPositionCheck=tokenPop[j].charAt(0);
                    InnerColPositionCheck=tokenPop[j].charAt(2);
                    if(incrementCol===tokenPop[j] && $("[row="+InnerRowPositionCheck+"] [column="+InnerColPositionCheck+"]").find('img').attr('src')!==imgSrcName) {
                        //we want to match opposite with token array
                        for (var l=parseInt(tokenPop[j].charAt(0));l<8;l++){  
                            var InnerParsedRowPosition=l;
                            var InnerParsedColPosition=l;
                            innerRowColIncrement=InnerParsedRowPosition+","+InnerParsedColPosition
                            if ($("[row="+InnerParsedRowPosition+"] [column="+InnerParsedColPosition+"]").find('img').attr('src')===imgSrcName && $("[row="+InnerRowPositionCheck+"] [column="+l+"]").hasClass('revealed')){
                                //IF opposite source direction we encouter opposite source -which is THIS source L is the last token 
                                for(var r=parseInt(thistokenCoordinate.charAt(2))+1;r<=l;r++){
                                //then add cody's code and in the for function just addclass flip.
                                $("[row="+r+"] [column="+r+"]").addClass('flip')
                                // break;
                                }
                            }
                        }
                    }
                }
            }
        }


        if (rowMath===1&&colMath===1){
            for(var k=parseInt(colPosition); k >= 0; k--) {
                parsedRowPosition=parseInt(rowPosition);
                parsedColPosition=parseInt(colPosition);
                AddParsedRowPosition=parsedRowPosition
                AddParsedColPosition=parsedRowPosition
                incrementCol=AddParsedRowPosition+","+AddParsedColPosition
                //maybe change to thisCol
                for (var j=0;j<tokenPop.length;j++){
                    tokenPop[j];
                    InnerRowPositionCheck=tokenPop[j].charAt(0);
                    InnerColPositionCheck=tokenPop[j].charAt(2);
                    if(incrementCol===tokenPop[j] && $("[row="+InnerRowPositionCheck+"] [column="+InnerColPositionCheck+"]").find('img').attr('src')!==imgSrcName) {
                        for (var l=parseInt(tokenPop[j].charAt(0));l>=0;l--){  
                            var InnerParsedRowPosition=parseInt(tokenPop[j].charAt(0))-l;
                            var InnerParsedColPosition=parseInt(tokenPop[j].charAt(2))-l;
                            innerRowColIncrement=InnerParsedRowPosition+","+InnerParsedColPosition
                            if ($("[row="+InnerParsedRowPosition+"] [column="+InnerParsedColPosition+"]").find('img').attr('src')===imgSrcName && $("[row="+InnerRowPositionCheck+"] [column="+l+"]").hasClass('revealed')){
                                //IF opposite source direction we encouter opposite source -which is THIS source L is the last token 
                                for(var r=parseInt(thistokenCoordinate.charAt(2))-1;r>=l;r--){
                                //then add cody's code and in the for function just addclass flip.
                                $("[row="+r+"] [column="+r+"]").addClass('flip')
                                // break;
                                }
                            }
                        }
                    }
                }
            }
        }

        if (rowMath===1&&colMath===-1){
            for(var k=parseInt(colPosition); k >= 0; k--) {
                parsedRowPosition=parseInt(rowPosition);
                parsedColPosition=parseInt(colPosition);
                incrementCol=parsedRowPosition+","+parsedColPosition
                //maybe change to thisCol
                for (var j=0;j<tokenPop.length;j++){
                    tokenPop[j];
                    InnerRowPositionCheck=tokenPop[j].charAt(0);
                    InnerColPositionCheck=tokenPop[j].charAt(2);
                    if(incrementCol===tokenPop[j] && $("[row="+InnerRowPositionCheck+"] [column="+InnerColPositionCheck+"]").find('img').attr('src')!==imgSrcName) {
                        for (var l=parseInt(tokenPop[j].charAt(0));l>=0;l--){  
                            var InnerParsedRowPosition=parseInt(tokenPop[j].charAt(0))-l;
                            oppositel=l*-1;
                            var InnerParsedColPosition=parseInt(tokenPop[j].charAt(2))-oppositel;
                            innerRowColIncrement=InnerParsedRowPosition+","+InnerParsedColPosition
                            if ($("[row="+InnerParsedRowPosition+"] [column="+InnerParsedColPosition+"]").find('img').attr('src')===imgSrcName){
                                //IF opposite source direction we encouter opposite source -which is THIS source L is the last token 
                                for(var r=parseInt(thistokenCoordinate.charAt(0))-1;r<=l;r--){
                                //then add cody's code and in the for function just addclass flip.
                                $("[row="+r+"] [column="+r+"]").addClass('flip')
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
                            if ($("[row="+l+"] [column="+InnerColPositionCheck+"]").find('img').attr('src')===imgSrcName && $("[row="+InnerRowPositionCheck+"] [column="+l+"]").hasClass('revealed')){
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
    //after every click we are going to clear the count Black Token 
    var countArrayWhite=[];
    //after every click we are going to clear the count White Token
    var scorePlayer1=0;
    var scorePlayer2=0;
    for (var i=0; i<tokenPop.length;i++){
        //we are going to loop through the token population array
        
        checkRowCounter=tokenPop[i].charAt(0);
        checkColCounter=tokenPop[i].charAt(2);
        if($("[row="+checkRowCounter+"] [column="+checkColCounter+"]").find('img').attr('src')==="images/mkdragonblack.png"){
            //when we find the "black" token we are going to push it in the countArrayWhite
            countArrayBlack.push(tokenPop[i])
        }
        else{
            countArrayWhite.push(tokenPop[i])
            //when we find the "white" token we are going to push it in the countArrayWhite
        }
    }
    scorePlayer2=countArrayBlack.length
    scorePlayer1=countArrayWhite.length
    $('.scoreP1 .value').text(scorePlayer1);
    //we jquery the text of the score
    $('.scoreP2 .value').text(scorePlayer2);
   
}