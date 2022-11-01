document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let width = 10
    let bombAmount = 20
    let squares = []
    let isGameOver = false
    let flags = 0 
    //function create board

    const createBoard = () => {
        //get shuffled game array with random 
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width * width - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombsArray)
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            square.addEventListener('click',function(e) {
                click(square)
            })
            //left click on square
            square.oncontextmenu = function(e) {
                e.preventDefault()
                addFlag(square)
            }
        }

        //add numbers to board
        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeft = ( i % width === 0)
            const isRight = (i % width === width - 1)

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeft && squares[i - 1].classList.contains('bomb')) total++
                if (i > 9 && !isRight && squares[i + 1 - width].classList.contains('bomb')) total++
                if (i > 10 && squares[i - width].classList.contains('bomb')) total++
                if (i > 11 && !isLeft && squares[i - 1 - width].classList.contains('bomb')) total++
                if (i < 98 && !isRight && squares[i + 1].classList.contains('bomb')) total++
                if (i < 90 && !isLeft && squares[i - 1 + width].classList.contains('bomb')) total++
                if (i < 88 && !isRight && squares[i + 1 + width].classList.contains('bomb')) total++
                if (i < 89 && squares[i + width ].classList.contains('bomb')) total++
                squares[i].setAttribute('data', total) 
              
            }
        }



    }
    createBoard()

    //add flag with the right click button
    const addFlag = (square) => {
        if (isGameOver) return 
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = ' 🚩'
                flags ++
                checkForWin()
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags --
            } 
        }
    }

    //click on square action button
    const click = (square) => {
        let currentId = square.id
        if (isGameOver) return
        if (square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('bomb')) {
            gameOver(square)
        } else {
            let total = square.getAttribute('data')
            if (total != 0) {
                square.classList.add('checked')
                square.innerHTML = total
                return
            }
            checkedSquare(square, currentId)
           
        }
        square.classList.add('checked')
    }

    //checked neighbours squares once square is clicked
    const checkedSquare = (square, currentId) => {
        const left = (currentId % width === 0)
        const right = (currentId % width === width - 1)
        
        setTimeout(() => {
            if (currentId > 0 && !left) {
                const newId = squares[parseInt(currentId) - 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId > 9 && !right) {
                const newId = squares[parseInt(currentId) + 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId > 10) {
                const newId = squares[parseInt(currentId - width)].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId > 11 && !left) {
                const newId = squares[parseInt(currentId) - 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId < 98 && !right) {
                const newId = squares[parseInt(currentId) + 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId < 90 && !left) {
                const newId = squares[parseInt(currentId) - 1 + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }


            if (currentId < 88 && !right) {
                const newId = squares[parseInt(currentId) + 1 + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId < 89) {
                const newId = squares[parseInt(currentId) + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }


        },10)
    }

    //game over
    const gameOver = (square) => {
        console.log('BOOM! Game Over!')
        isGameOver = true

        //show all the bombs
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣'
            }
        })
    }

    //function check for win 
    const checkForWin = () => {
        let matches = 0
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches ++
            }
            if (matches === bombAmount) {
                console.log('You won!')
                isGameOver = true
            }
        }
    }
})