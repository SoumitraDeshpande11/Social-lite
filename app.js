
let currentUser = null;
let currentProfileIndex = 0;
let profiles = [];
let surveyCompleted = false;


function showTab(tabName) {
   
    if (!surveyCompleted) {
        alert('Please complete the survey first!');
        return;
    }
    
   
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    
    document.getElementById(tabName).classList.add('active');
    
    
    event.target.classList.add('active');
    
    
    if (tabName === 'discover') {
        loadProfiles();
    } else if (tabName === 'matches') {
        loadMatches();
    }
}

document.getElementById('profileForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const interests = [];
    
    
    document.querySelectorAll('input[name="interests"]:checked').forEach(checkbox => {
        interests.push(checkbox.value);
    });
    
    
    if (interests.length > 5) {
        alert('Please select maximum 5 interests');
        return;
    }
    
    const profileData = {
        name: formData.get('name'),
        age: parseInt(formData.get('age')),
        bio: formData.get('bio'),
        interests: interests,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        isActive: true
    };
    
    try {
        if (currentUser) {
            
            await db.collection('users').doc(currentUser).update(profileData);
        } else {
            
            const docRef = await db.collection('users').add(profileData);
            currentUser = docRef.id;
            localStorage.setItem('currentUser', currentUser);
        }
        
        showSuccessMessage('Profile saved successfully!');
    } catch (error) {
        console.error('Error saving profile:', error);
        alert('Error saving profile. Please try again.');
    }
});


async function loadProfiles() {
    if (!currentUser) {
        document.getElementById('cardStack').innerHTML = `
            <div class="profile-card">
                <h3>Create Your Profile First!</h3>
                <p>Please go to the Profile tab and create your profile to start discovering people.</p>
            </div>
        `;
        return;
    }
    
    try {
        const snapshot = await db.collection('users')
            .where('isActive', '==', true)
            .limit(10)
            .get();
        
        profiles = [];
        snapshot.forEach(doc => {
            if (doc.id !== currentUser) {
                profiles.push({
                    id: doc.id,
                    ...doc.data()
                });
            }
        });
        
        currentProfileIndex = 0;
        displayCurrentProfile();
    } catch (error) {
        console.error('Error loading profiles:', error);
    }
}


function displayCurrentProfile() {
    const cardStack = document.getElementById('cardStack');
    
    if (currentProfileIndex >= profiles.length) {
        cardStack.innerHTML = `
            <div class="profile-card">
                <h3>No More Profiles!</h3>
                <p>You've seen all available profiles. Check back later for more!</p>
            </div>
        `;
        return;
    }
    
    const profile = profiles[currentProfileIndex];
    const interestsHtml = profile.interests ? 
        profile.interests.map(interest => `<span class="interest-tag">${interest}</span>`).join('') : '';
    
    cardStack.innerHTML = `
        <div class="profile-card">
            <h3>${profile.name}, ${profile.age}</h3>
            <p>${profile.bio || 'No bio available'}</p>
            <div class="interests">
                ${interestsHtml}
            </div>
        </div>
    `;
}


async function swipe(action) {
    if (!currentUser || currentProfileIndex >= profiles.length) {
        alert('Please create your profile first!');
        return;
    }
    
    const targetProfile = profiles[currentProfileIndex];
    
    
    try {
        await db.collection('swipes').add({
            swiperId: currentUser,
            targetId: targetProfile.id,
            action: action, 
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        
        if (action === 'like') {
            await checkForMatch(targetProfile.id);
        }
        
        
        currentProfileIndex++;
        displayCurrentProfile();
        
    } catch (error) {
        console.error('Error recording swipe:', error);
    }
}


async function checkForMatch(targetId) {
    try {
        
        const mutualLike = await db.collection('swipes')
            .where('swiperId', '==', targetId)
            .where('targetId', '==', currentUser)
            .where('action', '==', 'like')
            .get();
        
        if (!mutualLike.empty) {
            
            await db.collection('matches').add({
                user1: currentUser,
                user2: targetId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active'
            });
            
            showSuccessMessage('🎉 It\'s a match!');
        }
    } catch (error) {
        console.error('Error checking for match:', error);
    }
}


async function loadMatches() {
    if (!currentUser) {
        document.getElementById('matchesList').innerHTML = '<p>Please create your profile first!</p>';
        return;
    }
    
    try {
        const matchesSnapshot = await db.collection('matches')
            .where('user1', '==', currentUser)
            .get();
        
        const matches2Snapshot = await db.collection('matches')
            .where('user2', '==', currentUser)
            .get();
        
        const matchIds = new Set();
        const allMatches = [];
        
        matchesSnapshot.forEach(doc => {
            const data = doc.data();
            matchIds.add(data.user2);
            allMatches.push(data.user2);
        });
        
        matches2Snapshot.forEach(doc => {
            const data = doc.data();
            if (!matchIds.has(data.user1)) {
                matchIds.add(data.user1);
                allMatches.push(data.user1);
            }
        });
        
        if (allMatches.length === 0) {
            document.getElementById('matchesList').innerHTML = '<p>No matches yet. Keep swiping!</p>';
            return;
        }
        
        
        let matchesHtml = '';
        for (const matchId of allMatches) {
            try {
                const userDoc = await db.collection('users').doc(matchId).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    const interestsHtml = userData.interests ? 
                        userData.interests.map(interest => `<span class="interest-tag">${interest}</span>`).join('') : '';
                    
                    matchesHtml += `
                        <div class="match-item">
                            <h4>${userData.name}, ${userData.age}</h4>
                            <p>${userData.bio || 'No bio'}</p>
                            <div class="interests">${interestsHtml}</div>
                        </div>
                    `;
                }
            } catch (error) {
                console.error('Error loading match profile:', error);
            }
        }
        
        document.getElementById('matchesList').innerHTML = matchesHtml || '<p>No matches found.</p>';
        
    } catch (error) {
        console.error('Error loading matches:', error);
        document.getElementById('matchesList').innerHTML = '<p>Error loading matches.</p>';
    }
}


function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        document.body.removeChild(successDiv);
    }, 3000);
}


document.addEventListener('DOMContentLoaded', function() {
    
    surveyCompleted = localStorage.getItem('surveyCompleted') === 'true';
    
    if (!surveyCompleted) {
        
        document.getElementById('surveyModal').style.display = 'block';
        
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.style.opacity = '0.5';
            btn.style.pointerEvents = 'none';
        });
    } else {
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        });
    }
    
    
    document.getElementById('surveyForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('Survey form submitted');
        
        const formData = new FormData(e.target);
        const surveyData = {
            challenge: formData.get('challenge'),
            loneliness: formData.get('loneliness'),
            suggestions: formData.get('suggestions'),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userId: currentUser || 'anonymous_' + Date.now()
        };
        
        console.log('Survey data:', surveyData);
        
        try {
            console.log('Attempting to save to Firebase...');
            const docRef = await db.collection('surveys').add(surveyData);
            console.log('Document written with ID: ', docRef.id);
            
           
            surveyCompleted = true;
            localStorage.setItem('surveyCompleted', 'true');
            
           
            document.getElementById('surveyModal').style.display = 'none';
            
            
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            });
            
            
            showSuccessMessage('Survey completed! You can now access all features.');
            
            
            e.target.reset();
            
        } catch (error) {
            console.error('Detailed error submitting survey:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            alert('Error submitting survey: ' + error.message);
        }
    });
    
    
    currentUser = localStorage.getItem('currentUser');
    
    
    if (currentUser) {
        loadUserProfile();
    }
});


async function loadUserProfile() {
    try {
        const userDoc = await db.collection('users').doc(currentUser).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            
            
            document.querySelector('input[name="name"]').value = userData.name || '';
            document.querySelector('input[name="age"]').value = userData.age || '';
            document.querySelector('textarea[name="bio"]').value = userData.bio || '';
            
            
            if (userData.interests) {
                userData.interests.forEach(interest => {
                    const checkbox = document.querySelector(`input[name="interests"][value="${interest}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

document.addEventListener('change', function(e) {
    if (e.target.name === 'interests') {
        const checkedBoxes = document.querySelectorAll('input[name="interests"]:checked');
        if (checkedBoxes.length > 5) {
            e.target.checked = false;
            alert('You can select maximum 5 interests!');
        }
    }
});
