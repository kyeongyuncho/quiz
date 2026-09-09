/*
========================================
가로세로 낱말퀴즈 설정
========================================

direction
    across = 가로
    down   = 세로

row / col
    1부터 시작

예)

1번 가로
row: 2
col: 3
answer: "최소수집"

→ 2행 3열부터
→ 최 / 소 / 수 / 집
→ 가로로 활성화

*/

let selectedWordIndex = null;

const puzzle = {

    // 퍼즐판 크기
    rows: 13,
    cols: 13,


    // 문제
    words: [

        {
            number: 1,
            direction: "across",

            row: 2,
            col: 2,

            answer: "최소수집",

            question:
                "개인정보를 필요한 범위에서만 수집하는 원칙"
        },


        {
            number: 2,
            direction: "down",

            row: 1,
            col: 4,

            answer: "개인정보",

            question:
                "살아 있는 개인을 알아볼 수 있는 정보"
        },


        {
            number: 3,
            direction: "across",

            row: 5,
            col: 4,

            answer: "파기",

            question:
                "보유기간이 지나거나 처리 목적이 달성된 개인정보를 없애는 것"
        },


        {
            number: 4,
            direction: "down",

            row: 4,
            col: 6,

            answer: "안전성확보",

            question:
                "개인정보의 분실·도난·유출 등을 방지하기 위한 조치"
        },


        {
            number: 5,
            direction: "across",

            row: 8,
            col: 3,

            answer: "접근권한",

            question:
                "개인정보처리시스템에 접근할 수 있는 권한"
        },


        {
            number: 6,
            direction: "down",

            row: 7,
            col: 8,

            answer: "고유식별정보",

            question:
                "개인을 고유하게 구별하기 위해 부여된 정보"
        }

    ]
};



// ========================================
// 여기부터는 수정하지 않아도 됩니다.
// ========================================


const grid = document.getElementById("puzzleGrid");

const questionNumber =
    document.getElementById("questionNumber");

const questionText =
    document.getElementById("questionText");

const questionList =
    document.getElementById("questionList");


// 칸 정보 저장
const cells = {};


// ----------------------------------------
// 좌표 키
// ----------------------------------------

function getKey(row, col) {

    return `${row}-${col}`;

}


// ----------------------------------------
// 퍼즐 데이터 생성
// ----------------------------------------

function makePuzzle() {

    puzzle.words.forEach((word, wordIndex) => {

        const answer = [...word.answer];

        answer.forEach((letter, index) => {

            let row = word.row - 1;
            let col = word.col - 1;


            // 세로
            if (word.direction === "down") {

                row += index;

            }


            // 가로
            if (word.direction === "across") {

                col += index;

            }


            const key = getKey(row, col);


            // 해당 칸이 처음 만들어지는 경우
            if (!cells[key]) {

                cells[key] = {

                    row: row,
                    col: col,

                    letter: letter,

                    words: []

                };

            }


            // 해당 칸에 들어가는 문제 저장
            cells[key].words.push(wordIndex);

        });

    });

}


// ----------------------------------------
// 퍼즐판 그리기
// ----------------------------------------

function drawGrid() {

    grid.innerHTML = "";

    grid.style.gridTemplateColumns =
        `repeat(${puzzle.cols}, 1fr)`;


    for (
        let row = 0;
        row < puzzle.rows;
        row++
    ) {

        for (
            let col = 0;
            col < puzzle.cols;
            col++
        ) {

            const cell =
                document.createElement("div");

            cell.classList.add("puzzle-cell");


            const key =
                getKey(row, col);


            const data = cells[key];


            // 활성화되지 않은 칸
            if (!data) {

                cell.classList.add("block");

            }


            // 활성화된 칸
            else {

                cell.classList.add("active");

                cell.dataset.row = row;
                cell.dataset.col = col;


                // 문제 시작 번호 표시
                const startWord =
                    puzzle.words.find(
                        word =>
                            word.row - 1 === row &&
                            word.col - 1 === col
                    );


                if (startWord) {

                    const number =
                        document.createElement("span");

                    number.classList.add("cell-number");

                    number.textContent =
                        startWord.number;

                    cell.appendChild(number);

                }


                // 클릭
                cell.addEventListener(
                    "click",
                    () => {

                        selectCell(data);

                    }
                );

            }


            grid.appendChild(cell);

        }

    }

}


// ----------------------------------------
// 칸 클릭
// ----------------------------------------

function selectCell(data) {

    // 기존 강조 제거
    document
        .querySelectorAll(".puzzle-cell")
        .forEach(cell => {
            cell.classList.remove(
                "selected",
                "word-selected"
            );
        });

    /*
     * 하나의 칸에 여러 단어가 걸쳐 있는 경우
     * 일단 첫 번째 단어를 선택
     */
    const wordIndex = data.words[0];

    selectedWordIndex = wordIndex;

    const word = puzzle.words[wordIndex];

    // 문제 표시
    questionNumber.textContent =
        `${word.direction === "across" ? "가로" : "세로"} ${word.number}번`;

    questionText.textContent =
        word.question;

    // 선택된 단어 전체 강조
    highlightWord(word);

    // 실제 클릭한 칸 강조
    const selectedCell =
        document.querySelector(
            `.puzzle-cell[data-row="${data.row}"][data-col="${data.col}"]`
        );

    if (selectedCell) {
        selectedCell.classList.add("selected");
    }

    // 입력창 초기화
    const answerInput =
        document.getElementById("answerInput");

    answerInput.value = "";

    answerInput.focus();
}


// ----------------------------------------
// 선택된 단어 전체 강조
// ----------------------------------------

function highlightWord(word) {

    const length =
        [...word.answer].length;


    for (let i = 0; i < length; i++) {

        let row =
            word.row - 1;

        let col =
            word.col - 1;


        if (word.direction === "across") {

            col += i;

        }


        if (word.direction === "down") {

            row += i;

        }


        const cell =
            document.querySelector(
                `.puzzle-cell[data-row="${row}"][data-col="${col}"]`
            );


        if (cell) {

            cell.classList.add("word-selected");

        }

    }

}


// ----------------------------------------
// 문제 목록 만들기
// ----------------------------------------

function makeQuestionList() {

    questionList.innerHTML = "";


    puzzle.words.forEach(
        (word, index) => {

            const item =
                document.createElement("button");


            item.classList.add("question-item");

            item.dataset.index = index;


            item.innerHTML = `
                <strong>
                    ${word.direction === "across" ? "가로" : "세로"}
                    ${word.number}번
                </strong>

                ${word.question}
            `;


            item.addEventListener(
                "click",
                () => {

                    const firstKey =
                        getKey(
                            word.row - 1,
                            word.col - 1
                        );


                    selectCell(cells[firstKey]);

                }
            );


            questionList.appendChild(item);

        }
    );

}

const answerInput =
    document.getElementById("answerInput");

const answerButton =
    document.getElementById("answerButton");


answerButton.addEventListener("click", () => {

    if (selectedWordIndex === null) {
        alert("먼저 퍼즐에서 문제를 선택해주세요.");
        return;
    }

    const word =
        puzzle.words[selectedWordIndex];

    const answer =
        answerInput.value.trim();

    if (!answer) {
        alert("정답을 입력해주세요.");
        answerInput.focus();
        return;
    }

    const answerLength =
        [...word.answer].length;

    if ([...answer].length !== answerLength) {

        alert(
            `정답은 ${answerLength}글자입니다.`
        );

        answerInput.focus();
        return;
    }

    fillAnswer(word, answer);
});

function fillAnswer(word, answer) {

    const letters = [...answer];

    letters.forEach((letter, index) => {

        let row = word.row - 1;
        let col = word.col - 1;

        if (word.direction === "across") {
            col += index;
        }

        if (word.direction === "down") {
            row += index;
        }

        const cell =
            document.querySelector(
                `.puzzle-cell[data-row="${row}"][data-col="${col}"]`
            );

        if (!cell) return;

        let letterElement =
            cell.querySelector(".cell-letter");

        if (!letterElement) {

            letterElement =
                document.createElement("span");

            letterElement.classList.add(
                "cell-letter"
            );

            cell.appendChild(letterElement);
        }

        letterElement.textContent = letter;
    });
}


// ----------------------------------------
// 실행
// ----------------------------------------

makePuzzle();

drawGrid();

makeQuestionList();