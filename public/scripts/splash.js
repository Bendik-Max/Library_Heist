const storyModal = document.getElementById("storyModal");
const storySpan = document.getElementsByClassName("close");
const rulesModal = document.getElementById("rulesModal");
const rulesSpan = document.getElementsByClassName("close");

const openStoryModal = () => {
    storyModal.style.display = "block";    
};

const closeStoryModal = () => {
    storyModal.style.display = "none";
};

const openRulesModal = () => {
    rulesModal.style.display = "block";
};

const closeRulesModal = () => {
    rulesModal.style.display = "none";
};
