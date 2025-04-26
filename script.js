document.addEventListener('DOMContentLoaded',function(){


    const searchButton = document.getElementById('search-btn');
    const usernameInput = document.getElementById('user-input');
    const cardstatsContainer = document.querySelector('.stats-card')
    const easyLabel = document.getElementById('easy-label');
    const mediumLabel = document.getElementById('medium-label');
    const hardLabel = document.getElementById('hard-label');
    const easyProgressCircle = document.querySelector('.easy-progress');
    const mediumProgressCircle = document.querySelector('.medium-progress');
    const hardProgressCircle = document.querySelector('.hard-progress');
    const statsContainer = document.querySelector('.stats-container');
    const container = document.querySelector('.container');

    function validateUsername(username){
        if(username.trim() === ''){
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching){
            alert("Incorrect username");
        }
        return isMatching;
    }

    function updateUserDetails(total,solved,label,circle){
        const progressDegree = (solved/total) * 100;
        label.textContent = `${solved}/${total}`;
        circle.style.setProperty('--progress-degree', `${progressDegree}%`);
    }
    function displayUserDetails(data){
        statsContainer.style.setProperty('display','flex');
        const totalEasy = data['totalEasy'];
        const totalMedium = data['totalMedium'];
        const totalHard = data['totalHard'];
        const easySolved = data['easySolved'];
        const mediumSolved = data['mediumSolved'];
        const hardSolved = data['hardSolved'];
       

        updateUserDetails(totalEasy,easySolved,easyLabel,easyProgressCircle);
        updateUserDetails(totalMedium,mediumSolved,mediumLabel,mediumProgressCircle);
        updateUserDetails(totalHard,hardSolved,hardLabel,hardProgressCircle);

        const card_data = [
            {label:"Overall Submission" , value: data['totalSolved']},
            {label:"Overall Easy Submission",value: data['easySolved']},
            {label:"Overall Medium Submission",value:data['mediumSolved']},
            {label:"Overall Hard Submission",value:data['hardSolved']}
        ];
        
        cardstatsContainer.innerHTML = card_data.map(
            data=>{
                return `
                    <div class="card">
                        <h3>${data.label}</h3>
                        <p>${data.value}</p>
                    </div>
                `
            }
        ).join("");

        // window.scrollTo({ top: 0, behavior: 'smooth' });
        container.style.setProperty('height', '400px');

    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try{
            searchButton.textContent="Searching...";
            searchButton.disabled = true;
            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Unable to process.");
            }
            const data = await response.json();
            console.log(data);
            if(data['status'] != 'success'){
                alert('Invalid username');
                throw new Error("Unable to process.");
            }
            displayUserDetails(data);

        }
        catch(error){
            console.log(error);
            cardstatsContainer.innerHTML="<p>No data found</p>"
            usernameInput.value="";
        }
        finally{
            searchButton.disabled =false;
            searchButton.textContent="Search";
        }
    }

    searchButton.addEventListener('click',function(){
        statsContainer.style.setProperty('display','none');
        container.style.setProperty('height', 'auto');
        const username = usernameInput.value;
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
        
    })

})