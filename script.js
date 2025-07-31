// Declsre part important
document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumPogressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLabel = document.querySelector(".easy-label");
  const mediumLabel = document.querySelector(".medium-label");
  const hardLabel = document.querySelector(".hard-label");
  const cardStatsContainer = document.querySelector(".stats-card");
  const a = document.querySelector(".msg");

  // remove right window in case open
  function removesidewindow() {
    const link = document.getElementById("link1");
    if (link) {
      document.head.removeChild(link);
    }
  }

  //check username
  function validateusername(username) {
    if (username.trim() == "") {
      removesidewindow();
      a.textContent = "Username should not be empty";
      return false;
    }
    const rege = /^[a-zA-Z0-9_-]{1,15}$/;
    const isMatching = rege.test(username);
    if (!isMatching) {
      removesidewindow();
      a.textContent = "Invalid Username";
    }
    return isMatching;
  }

  // fetching user details
  async function fetchuserdetail(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    try {
      searchButton.textContent = "Searching..";
      searchButton.disabled = true;
      const response = await fetch(url);
      if (!response.ok) {
        throw new error("unable to fetch the userdetails");
      }
      const parseddata = await response.json();
      if (parseddata.totalQuestions == 0) {
        removesidewindow();
        a.textContent = "Username is private or doesn't exist";
        return;
      }
      let link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "style2.css";
      link.id = "link1";
      document.head.append(link);
      document.getElementById("usernameheading").innerHTML = username;
      console.log("Logging data: ", parseddata);
      displayuserdata(parseddata);
    } catch (error) {
      statsContainer.innerHTML = "<p>No parseddata found</p>";
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  // updating value in circles
  function updateprogress(solved, total, label, circle) {
    const progressdeg = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressdeg}%`);
    label.textContent = `${solved}/${total}`;
  }

  // displaying info
  function displayuserdata(parseddata) {
    document.getElementById("easy").innerHTML = "Easy";
    document.getElementById("medium").innerHTML = "Medium";
    document.getElementById("hard").innerHTML = "Hard";
    console.log(parseddata);
    const totalques = parseddata.totalQuestions;
    const totaleasyques = parseddata.totalEasy;
    const totalmediumques = parseddata.totalMedium;
    const totalhardques = parseddata.totalHard;

    // // userdata
    const solvedtotalques = parseddata.totalSolved;
    const solvedtotaleasyques = parseddata.easySolved;
    const solvedtotalmediumques = parseddata.mediumSolved;
    const solvedtotalhardques = parseddata.hardSolved;

    updateprogress(
      solvedtotaleasyques,
      totaleasyques,
      easyLabel,
      easyProgressCircle
    );
    updateprogress(
      solvedtotalmediumques,
      totalmediumques,
      mediumLabel,
      mediumPogressCircle
    );
    updateprogress(
      solvedtotalhardques,
      totalhardques,
      hardLabel,
      hardProgressCircle
    );

    const totalSubmissions = Object.values(
      parseddata.submissionCalendar
    ).reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
    const cardsdata = [
      { label: "Total Solved", value: solvedtotalques },
      { label: "Total Submission", value: totalSubmissions },
      { label: "Acceptance Rate", value: parseddata.acceptanceRate },
      { label: "Ranking", value: parseddata.ranking },
    ];

    cardStatsContainer.innerHTML = cardsdata
      .map((card) => {
        return `
        <div class="card">
        <div >${card.label}</div>
        <div >${card.value}</div>
        </div>
        `;
      })
      .join("");
  }


//   click on search button 
  searchButton.addEventListener("click", () => {
    a.innerHTML = "";

    const username = usernameInput.value;
    if (validateusername(username)) {
      fetchuserdetail(username);
    }
  });
});
