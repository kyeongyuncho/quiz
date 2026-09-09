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

const puzzle =
    {

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