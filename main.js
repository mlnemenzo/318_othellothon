$(document).ready(initializeApp);
function initializeApp(){
    buildGameBoard();
    applyClickHandlers();

}

var grid=[];
var thistokenCoordinate;
var thistokenRowCoordinate;
var thistokenColumnCoordinate;
var player1Check=true;
var player2Check=false;
var canBeClicked=true;
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
        $(this).append('<img src="images/Back.png">')
        console.log(thistokenCoordinate);
        player1Check=false;
        player2Check=true;
        // canBeClicked=false
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
        return
    }
}
