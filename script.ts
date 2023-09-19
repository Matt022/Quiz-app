import { Test } from "./typescript_models/test";
import { getAllTests } from "./typescript_scripts/dbService.js";

const mainContainer: HTMLDivElement = <HTMLDivElement>document.querySelector("section.main-container");

getAllTests().then((tests: Test[]) => {
    tests.forEach((test: Test) => {
        const divTestHolder: HTMLDivElement = document.createElement("div");
        divTestHolder.classList.add("testHolder");

        const headingTestName: HTMLHeadingElement = document.createElement("h2");
        headingTestName.classList.add("testName");
        headingTestName.textContent = test.title;
        divTestHolder.appendChild(headingTestName);

        const paragraphQuestionCount: HTMLParagraphElement = document.createElement("p");
        paragraphQuestionCount.classList.add("question-counter");
        paragraphQuestionCount.innerHTML = `Number of questions in the test: <strong>${test.questions.length.toString()}</strong>`;
        divTestHolder.appendChild(paragraphQuestionCount);

        const anchorViewDetail: HTMLAnchorElement = document.createElement("a");
        anchorViewDetail.textContent = "Apply to test";
        anchorViewDetail.href = `/pages/testApplying.html?id=${test.id}`;
        divTestHolder.appendChild(anchorViewDetail);

        mainContainer.appendChild(divTestHolder);
    });
});