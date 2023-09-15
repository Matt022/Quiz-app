import { getAllTests } from "./typescript_scripts/dbService.js";
const mainContainer = document.querySelector("section.main-container");
getAllTests().then((tests) => {
    tests.forEach((test) => {
        const divTestHolder = document.createElement("div");
        divTestHolder.classList.add("testHolder");
        const headingTestName = document.createElement("h2");
        headingTestName.classList.add("testName");
        headingTestName.textContent = test.nazov;
        divTestHolder.appendChild(headingTestName);
        const paragraphQuestionCount = document.createElement("p");
        paragraphQuestionCount.classList.add("question-counter");
        paragraphQuestionCount.textContent = `Počet otázok v teste: ${test.otazky.length.toString()}`;
        divTestHolder.appendChild(paragraphQuestionCount);
        const anchorViewDetail = document.createElement("a");
        anchorViewDetail.textContent = "View detail";
        anchorViewDetail.href = `/pages/testDetail.html?id=${test.id}`;
        divTestHolder.appendChild(anchorViewDetail);
        mainContainer.appendChild(divTestHolder);
    });
});
