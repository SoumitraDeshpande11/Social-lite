// Script to add sample users to Firebase for demonstration
// Run this once to populate your database with fake users

const sampleUsers = [
    {
        name: "Alex Chen",
        age: 22,
        bio: "Love hiking and photography. Always up for new adventures!",
        interests: ["travel", "art", "music", "sports"],
        isActive: true
    },
    {
        name: "Maya Patel",
        age: 21,
        bio: "Computer science student who loves gaming and cooking.",
        interests: ["gaming", "cooking", "movies", "reading"],
        isActive: true
    },
    {
        name: "Jordan Smith",
        age: 23,
        bio: "Musician and coffee enthusiast. Let's jam together!",
        interests: ["music", "travel", "art", "cooking"],
        isActive: true
    },
    {
        name: "Sam Rodriguez",
        age: 20,
        bio: "Fitness lover and movie buff. Always down for a good workout or film discussion.",
        interests: ["sports", "movies", "travel", "music"],
        isActive: true
    },
    {
        name: "Riley Johnson",
        age: 24,
        bio: "Book lover and aspiring writer. Let's discuss our favorite stories!",
        interests: ["reading", "art", "movies", "cooking"],
        isActive: true
    },
    {
        name: "Casey Kim",
        age: 22,
        bio: "Art student who loves exploring new places and trying different cuisines.",
        interests: ["art", "travel", "cooking", "music"],
        isActive: true
    },
    {
        name: "Taylor Brown",
        age: 21,
        bio: "Sports enthusiast and gamer. Always ready for friendly competition!",
        interests: ["sports", "gaming", "movies", "travel"],
        isActive: true
    },
    {
        name: "Avery Davis",
        age: 23,
        bio: "Music producer and travel blogger. Life's an adventure!",
        interests: ["music", "travel", "art", "reading"],
        isActive: true
    }
];

// Function to add sample users
async function addSampleUsers() {
    console.log('Adding sample users to Firebase...');
    
    try {
        for (let i = 0; i < sampleUsers.length; i++) {
            const user = sampleUsers[i];
            user.timestamp = firebase.firestore.FieldValue.serverTimestamp();
            
            const docRef = await db.collection('users').add(user);
            console.log(`Added user ${user.name} with ID: ${docRef.id}`);
        }
        
        console.log('All sample users added successfully!');
        alert('Sample users added! You can now test the swipe functionality.');
        
    } catch (error) {
        console.error('Error adding sample users:', error);
        alert('Error adding sample users: ' + error.message);
    }
}

// Auto-run when page loads (only run once)
document.addEventListener('DOMContentLoaded', function() {
    // Check if sample users already added
    const sampleUsersAdded = localStorage.getItem('sampleUsersAdded');
    
    if (!sampleUsersAdded) {
        // Add a button to manually trigger adding sample users
        const addUsersBtn = document.createElement('button');
        addUsersBtn.textContent = 'Add Sample Users for Demo';
        addUsersBtn.className = 'btn-primary';
        addUsersBtn.style.position = 'fixed';
        addUsersBtn.style.top = '10px';
        addUsersBtn.style.right = '10px';
        addUsersBtn.style.zIndex = '9999';
        
        addUsersBtn.onclick = function() {
            addSampleUsers();
            localStorage.setItem('sampleUsersAdded', 'true');
            document.body.removeChild(addUsersBtn);
        };
        
        document.body.appendChild(addUsersBtn);
    }
});
