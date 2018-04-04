$(document).ready(initializeApp);
function initializeApp(){
    buildGameBoard();
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
        }
        divsToAppend.attr('row',newRow)
        $("#game-board").append(divsToAppend)
    }

}

