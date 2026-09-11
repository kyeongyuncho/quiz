/*
========================================
Firebase
========================================
*/

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    updateDoc,
    getDoc,
    onSnapshot,
    collection,
    query,
    orderBy,
    getDocs,
    writeBatch,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


import {
    firebaseConfig
} from "./firebase-config.js";


const app =
    initializeApp(firebaseConfig);


const auth =
    getAuth(app);


const db =
    getFirestore(app);


const EVENT_ID =
    "privacy-quiz-2026";


let currentIndex =
    -1;


let status =
    "waiting";


let unsubscribeAnswers =
    null;


/*
========================================
Firebase 관리자 인증
========================================
*/

signInAnonymously(auth)
    .catch(
        error => {

            console.error(
                error
            );

            alert(
                "Firebase 인증에 실패했습니다."
            );

        }
    );


/*
========================================
퍼즐 데이터
========================================
*/

const puzzle = {

    rows: 16,
    cols: 14,

    words: [

        {
            number: 1,
            direction: "down",
            row: 2,
            col: 4,
            answer: "개인정보",
            question:
                "살아 있는 개인을 알아볼 수 있는 정보"
        },

        {
            number: 2,
            direction: "across",
            row: 5,
            col: 3,
            answer: "정보주체",
            question:
                "개인정보로 알아볼 수 있는 사람, 정보의 주인을 뜻함"
        },

        {
            number: 3,
            direction: "across",
            row: 2,
            col: 4,
            answer: "개인정보처리자",
            question:
                "업무를 목적으로 개인정보파일을 운용하기 위하여 스스로 또는 다른사람을 통하여 개인정보를 처리하는 공공기관 법인 단체 및 개인 등을 말함"
        },

        {
            number: 4,
            direction: "down",
            row: 6,
            col: 4,
            answer: "취급자",
            question:
                "개인정보처리자의 지휘 감독을 받아 실제로 개인정보를 처리하는 자"
        },

        {
            number: 5,
            direction: "down",
            row: 7,
            col: 7,
            answer: "고유식별정보",
            question:
                "개인을 고유하게 구별하기 위해 부여된 정보는?"
        },

        {
            number: 6,
            direction: "down",
            row: 9,
            col: 9,
            answer: "생명주기",
            question:
                "개인정보를 수집~파기하기까지 거치는 주요 관리 단계"
        },

        {
            number: 7,
            direction: "across",
            row: 8,
            col: 11,
            answer: "동의",
            question:
                "개인정보를 수집 이용할 때 정보주체에게 처리 목적 등을 알리고 적법하게 처리하는 위한 대표적인 근거는?"
        },

        {
            number: 8,
            direction: "down",
            row: 10,
            col: 11,
            answer: "최소수집",
            question:
                "개인정보를 처리할 때 업무에 필요한 범위 내에서 꼭 필요한 정보만 수집해야 한다는 원칙은?"
        },

        {
            number: 9,
            direction: "down",
            row: 4,
            col: 8,
            answer: "비밀유지",
            question:
                "개인정보보호법에 따라 업무상 알게 된 개인정보를 다른 사람에게 누설하거나 부당한 목적으로 쓰지 않아야 하는 법적 의무"
        },

        {
            number: 10,
            direction: "across",
            row: 6,
            col: 8,
            answer: "유출",
            question:
                "개인정보가 정당한 권한 없이 외부로 공개되거나 제공되는 사고를 무엇이라고 하는가?"
        },

        {
            number: 11,
            direction: "across",
            row: 14,
            col: 9,
            answer: "파기",
            question:
                "개인정보를 처리한 목적이 달성되어 더 이상 보유할 필요가 없을 때 이를 없애는 행위는?"
        },

        {
            number: 12,
            direction: "down",
            row: 12,
            col: 7,
            answer: "보유기간",
            question:
                "개인정보를 일정기간 보관한 후 파기하는 기준이 되는 기간은?"
        },

        {
            number: 13,
            direction: "down",
            row: 14,
            col: 9,
            answer: "파쇄",
            question:
                "개인정보가 포함된 문서를 더 이상 복구할 수 없도록 잘게 파기하는 방법은?"
        },

        {
            number: 14,
            direction: "across",
            row: 15,
            col: 3,
            answer: "피싱",
            question:
                "신뢰할 수 있는 기관이나 사람으로 위장하여 사용자를 속이는 사이버 범죄 행위"
        },

        {
            number: 15,
            direction: "down",
            row: 13,
            col: 4,
            answer: "스미싱",
            question:
                "문자(SMS)와 피싱의 합성어로, 악성 앱 주소나 링크가 포함된 문자를 전송하는 사기 수법"
        },

        {
            number: 16,
            direction: "across",
            row: 4,
            col: 8,
            answer: "비밀번호",
            question:
                "이용자가 시스템에 대한 접근권한을 가지고 있음을 증명하는 암호 문자는?"
        },

        {
            number: 17,
            direction: "across",
            row: 10,
            col: 2,
            answer: "접근권한",
            question:
                "개인정보에 접근할 수 있는 사람이나 시스템의 범위를 업무상 필요한 수준으로 제한하는 것은?"
        },

        {
            number: 18,
            direction: "down",
            row: 10,
            col: 2,
            answer: "접근통제",
            question:
                "개인정보를 업무상 필요 이상으로 열람하거나 조회하지 못하도록 하는 원칙은?"
        },

        {
            number: 19,
            direction: "across",
            row: 12,
            col: 11,
            answer: "수탁자",
            question:
                "개인정보 처리 업무의 일부를 다른 업체에 맡기는 경우 해당 업체를 법에서 무엇이라고 하는가?"
        },

        {
            number: 20,
            direction: "across",
            row: 12,
            col: 5,
            answer: "화면보호기",
            question:
                "PC를 사용하지 않을 때 화면을 자동으로 잠가 타인의 접근을 막는 기능은?(윈도우 + L)"
        }







    ]

};


/*
========================================
DOM
========================================
*/

const currentQuestion =
    document.getElementById(
        "currentQuestion"
    );

const currentClue =
    document.getElementById(
        "currentClue"
    );

const quizStatus =
    document.getElementById(
        "quizStatus"
    );


/*
========================================
행사 상태 감시
========================================
*/

const eventRef =
    doc(
        db,
        "events",
        EVENT_ID
    );


onSnapshot(
    eventRef,
    snapshot => {

        if (
            !snapshot.exists()
        ) {

            currentIndex = -1;

            status =
                "waiting";

            renderCurrent();

            return;

        }


        const data =
            snapshot.data();


        currentIndex =
            typeof data.currentQuestion ===
            "number"
                ? data.currentQuestion
                : -1;


        status =
            data.status ||
            "waiting";


        renderCurrent();

        listenAnswers();

    }
);


/*
========================================
현재 문제 표시
========================================
*/

function renderCurrent() {

    if (
        status ===
        "finished"
    ) {

        currentQuestion.textContent =
            "🎉 퀴즈 종료";

        currentClue.textContent =
            "최종 순위를 확인하세요.";

        quizStatus.textContent =
            "종료";

        return;

    }


    if (
        currentIndex < 0
    ) {

        currentQuestion.textContent =
            "시작 전";

        currentClue.textContent =
            "문제 시작 버튼을 눌러주세요.";

        quizStatus.textContent =
            "대기 중";

        return;

    }


    const word =
        puzzle.words[currentIndex];


    currentQuestion.textContent =
        `${currentIndex + 1}번 · ${
            word.direction === "across"
                ? "가로"
                : "세로"
        }`;


    currentClue.textContent =
        word.question;


    quizStatus.textContent =
        status === "running"
            ? "진행 중"
            : "일시정지";

}


/*
========================================
문제 시작
========================================
*/

document
    .getElementById(
        "startButton"
    )
    .addEventListener(
        "click",
        async () => {

            if (
                currentIndex < 0
            ) {

                currentIndex =
                    0;

            }


            await setDoc(
                eventRef,
                {

                    currentQuestion:
                        currentIndex,

                    status:
                        "running",

                    updatedAt:
                        serverTimestamp()

                },
                {
                    merge:
                        true
                }
            );

        }
    );


/*
========================================
다음 문제
========================================
*/

document
    .getElementById(
        "nextButton"
    )
    .addEventListener(
        "click",
        async () => {

            const nextIndex =
                currentIndex + 1;


            if (
                nextIndex >=
                puzzle.words.length
            ) {

                if (
                    confirm(
                        "마지막 문제입니다.\n퀴즈를 종료할까요?"
                    )
                ) {

                    await updateDoc(
                        eventRef,
                        {

                            status:
                                "finished",

                            updatedAt:
                                serverTimestamp()

                        }
                    );

                }

                return;

            }


            await updateDoc(
                eventRef,
                {

                    currentQuestion:
                        nextIndex,

                    status:
                        "running",

                    updatedAt:
                        serverTimestamp()

                }
            );

        }
    );


/*
========================================
이전 문제
========================================
*/

document
    .getElementById(
        "previousButton"
    )
    .addEventListener(
        "click",
        async () => {

            if (
                currentIndex <= 0
            ) {

                alert(
                    "첫 번째 문제입니다."
                );

                return;

            }


            await updateDoc(
                eventRef,
                {

                    currentQuestion:
                        currentIndex - 1,

                    status:
                        "running",

                    updatedAt:
                        serverTimestamp()

                }
            );

        }
    );


/*
========================================
일시정지
========================================
*/

document
    .getElementById(
        "pauseButton"
    )
    .addEventListener(
        "click",
        async () => {

            await updateDoc(
                eventRef,
                {

                    status:
                        status === "paused"
                            ? "running"
                            : "paused",

                    updatedAt:
                        serverTimestamp()

                }
            );

        }
    );


/*
========================================
참가자 실시간 조회
========================================
*/

const participantsRef =
    collection(
        db,
        "events",
        EVENT_ID,
        "participants"
    );


const rankingQuery =
    query(
        participantsRef,
        orderBy(
            "totalScore",
            "desc"
        )
    );


onSnapshot(
    rankingQuery,
    snapshot => {

        const participants =
            [];


        snapshot.forEach(
            item => {

                participants.push(
                    {
                        id: item.id,
                        ...item.data()
                    }
                );

            }
        );


        /*
        참가자 수
        */

        document
            .getElementById(
                "participantCount"
            )
            .textContent =
            participants.length;


        /*
        TOP 5
        */

        document
            .getElementById(
                "adminRanking"
            )
            .innerHTML =
            participants
                .slice(0, 5)
                .map(
                    (participant, index) => `

                        <div
                            class="admin-ranking-row"
                        >

                            <span>
                                ${index + 1}위
                            </span>

                            <strong>
                                ${escapeHtml(
                                    participant.nickname
                                )}
                            </strong>

                            <b>
                                ${participant.totalScore || 0}점
                            </b>

                        </div>

                    `
                )
                .join("");


        /*
        전체 참가자
        */

        document
            .getElementById(
                "participantList"
            )
            .innerHTML =
            participants
                .map(
                    participant => `

                        <div
                            class="admin-ranking-row"
                        >

                            <span>
                                -
                            </span>

                            <strong>
                                ${escapeHtml(
                                    participant.nickname
                                )}
                            </strong>

                            <b>
                                ${participant.totalScore || 0}점
                            </b>

                        </div>

                    `
                )
                .join("");

    }
);


/*
========================================
답안 조회
========================================
*/

function listenAnswers() {

    if (
        unsubscribeAnswers
    ) {

        unsubscribeAnswers();

    }


    if (
        currentIndex < 0
    ) {

        return;

    }


    const submissionsRef =
        collection(
            db,
            "events",
            EVENT_ID,
            "submissions"
        );


    const answerQuery =
        query(
            submissionsRef,
            orderBy(
                "submittedAt",
                "asc"
            )
        );


    unsubscribeAnswers =
        onSnapshot(
            answerQuery,
            snapshot => {

                const answers =
                    [];


                snapshot.forEach(
                    item => {

                        const data =
                            item.data();


                        if (
                            data.questionIndex ===
                            currentIndex
                        ) {

                            answers.push(
                                data
                            );

                        }

                    }
                );


                const container =
                    document.getElementById(
                        "answerList"
                    );


                if (
                    answers.length === 0
                ) {

                    container.textContent =
                        "아직 답안이 없습니다.";

                    return;

                }


                container.innerHTML =
                    answers
                        .map(
                            answer => `

                                <div
                                    class="answer-row"
                                >

                                    <span>
                                        ${escapeHtml(
                                            answer.nickname
                                        )}
                                    </span>

                                    <strong>
                                        ${escapeHtml(
                                            answer.answer
                                        )}
                                    </strong>

                                    <span
                                        class="${
                                            answer.correct
                                                ? "correct"
                                                : "wrong"
                                        }"
                                    >
                                        ${
                                            answer.correct
                                                ? "정답"
                                                : "오답"
                                        }
                                    </span>

                                    <b>
                                        +${answer.points || 0}점
                                    </b>

                                </div>

                            `
                        )
                        .join("");

            }
        );

}


/*
========================================
퀴즈 전체 초기화
========================================
*/

const resetButton =
    document.getElementById(
        "resetButton"
    );


if (resetButton) {

    resetButton.addEventListener(
        "click",
        async () => {

            const confirmed =
                confirm(
                    "퀴즈 전체 초기화를 진행할까요?\n\n참가자, 모든 답안, 문제별 정답 순위가 모두 삭제되고 퀴즈가 대기 상태로 돌아갑니다."
                );

            if (!confirmed) return;

            resetButton.disabled = true;
            resetButton.textContent = "초기화 중...";

            try {

                const batch = writeBatch(db);

                const participantsSnapshot =
                    await getDocs(
                        collection(
                            db,
                            "events",
                            EVENT_ID,
                            "participants"
                        )
                    );

                const submissionsSnapshot =
                    await getDocs(
                        collection(
                            db,
                            "events",
                            EVENT_ID,
                            "submissions"
                        )
                    );

                const questionsSnapshot =
                    await getDocs(
                        collection(
                            db,
                            "events",
                            EVENT_ID,
                            "questions"
                        )
                    );

                participantsSnapshot.forEach(
                    item => batch.delete(item.ref)
                );

                submissionsSnapshot.forEach(
                    item => batch.delete(item.ref)
                );

                questionsSnapshot.forEach(
                    item => batch.delete(item.ref)
                );

                batch.set(
                    eventRef,
                    {
                        currentQuestion: -1,
                        status: "waiting",
                        updatedAt: serverTimestamp()
                    },
                    { merge: true }
                );

                await batch.commit();

                alert(
                    "퀴즈 전체 초기화가 완료되었습니다.\n새 참가자를 받아 다시 시작할 수 있습니다."
                );

            } catch (error) {

                console.error(
                    "퀴즈 초기화 오류:",
                    error
                );

                alert(
                    "퀴즈 초기화 중 오류가 발생했습니다.\n콘솔(F12)에서 오류 내용을 확인해주세요."
                );

            } finally {

                resetButton.disabled = false;
                resetButton.textContent = "🗑️ 퀴즈 전체 초기화";

            }

        }
    );

}


/*
========================================
HTML 안전처리
========================================
*/

function escapeHtml(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}